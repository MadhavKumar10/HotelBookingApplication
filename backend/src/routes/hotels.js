import express from "express";
import Hotel from "../models/hotel.js";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth.js";

const stripe = new Stripe(process.env.STRIPE_API_KEY);

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req, res) => {
    try {
      console.log("=== PAYMENT INTENT REQUEST ===");
      console.log("User ID:", req.userId);
      console.log("Hotel ID:", req.params.hotelId);
      console.log("Body:", req.body);

      const { numberOfNights } = req.body;
      const hotelId = req.params.hotelId;

      // Validate input
      if (!numberOfNights || isNaN(numberOfNights) || numberOfNights <= 0) {
        return res.status(400).json({ 
          message: "Valid number of nights is required" 
        });
      }

      if (!hotelId) {
        return res.status(400).json({ 
          message: "Hotel ID is required" 
        });
      }

      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ 
          message: "Hotel not found" 
        });
      }

      const totalCost = hotel.pricePerNight * parseInt(numberOfNights);
      console.log("Total cost calculation:", {
        pricePerNight: hotel.pricePerNight,
        numberOfNights: numberOfNights,
        totalCost: totalCost
      });

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalCost * 100), // Convert to cents/pence
        currency: "gbp",
        metadata: {
          hotelId: hotelId,
          userId: req.userId.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log("Stripe payment intent created:", {
        id: paymentIntent.id,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret ? "present" : "missing"
      });

      if (!paymentIntent.client_secret) {
        return res.status(500).json({ 
          message: "Payment intent created but no client secret received" 
        });
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        totalCost: totalCost,
      };

      res.json(response);
    } catch (error) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ 
        message: "Failed to create payment intent",
        error: error.message 
      });
    }
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req, res) => {
    try {
      console.log("=== BOOKING REQUEST ===");
      console.log("Headers:", req.headers);
      console.log("Body:", req.body);
      console.log("User ID:", req.userId);
      console.log("Hotel ID:", req.params.hotelId);

      const { 
        paymentIntentId,
        firstName,
        lastName,
        email,
        adultCount,
        childCount,
        checkIn,
        checkOut,
        totalCost
      } = req.body;

      if (!paymentIntentId) {
        console.error("No paymentIntentId provided");
        return res.status(400).json({ message: "Payment intent ID is required" });
      }

      console.log("Creating booking with data:", req.body);

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (!paymentIntent) {
        console.error("Payment intent not found");
        return res.status(400).json({ message: "Payment intent not found" });
      }

      console.log("Payment intent status:", paymentIntent.status);
      console.log("Payment intent metadata:", paymentIntent.metadata);

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        console.error("Payment intent mismatch");
        return res.status(400).json({ message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        console.error("Payment not succeeded:", paymentIntent.status);
        return res.status(400).json({
          message: `Payment not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking = {
        firstName,
        lastName,
        email,
        adultCount: parseInt(adultCount),
        childCount: parseInt(childCount),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalCost: parseFloat(totalCost),
        userId: req.userId,
      };

      console.log("New booking object:", newBooking);

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        },
        { new: true }
      );

      if (!hotel) {
        console.error("Hotel not found");
        return res.status(400).json({ message: "Hotel not found" });
      }

      await hotel.save();


      res.status(200).json({ 
        message: "Booking saved successfully",
        bookingId: hotel.bookings[hotel.bookings.length - 1]._id 
       });
    } catch (error) {
      console.log("Booking error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams) => {
  let constructedQuery = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;