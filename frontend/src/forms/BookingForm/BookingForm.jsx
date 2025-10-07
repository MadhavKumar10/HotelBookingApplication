import { useForm } from "react-hook-form";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useState } from "react";

const BookingForm = ({ currentUser, paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const search = useSearchContext();
  const { hotelId } = useParams();

  const { showToast } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // FIXED: Added proper mutationFn
  const { mutate: bookRoom, isLoading: isBookingLoading } = useMutation({
    mutationFn: (bookingData) => apiClient.createRoomBooking(bookingData),
    onSuccess: (responseData) => {
      console.log("Booking successful:", responseData);
      showToast({ 
        message: responseData?.message || "Booking Saved!", 
        type: "SUCCESS" 
      });
      navigate("/my-bookings");
    },
    onError: (error) => {
      console.error("Booking error:", error);
      showToast({ 
        message: error.message || "Error saving booking", 
        type: "ERROR" 
      });
      setIsProcessing(false);
    },
  });

  const { handleSubmit, register } = useForm({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async (formData) => {
    if (!stripe || !elements) {
      console.error("Stripe or elements not loaded");
      return;
    }

    setIsProcessing(true);
    console.log("Starting payment process...");

    try {
      const { error, paymentIntent: result } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-bookings`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Stripe payment error:", error);
        showToast({ message: error.message, type: "ERROR" });
        setIsProcessing(false);
        return;
      }

      if (result && result.status === "succeeded") {
        console.log("Payment succeeded, creating booking...");
        console.log("Booking data:", {
          ...formData,
          paymentIntentId: result.id
        });
        
        // Payment succeeded, create booking
        bookRoom({ 
          ...formData, 
          paymentIntentId: result.id 
        });
      } else {
        console.error("Unexpected payment result:", result);
        showToast({ message: "Payment failed or was cancelled", type: "ERROR" });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      showToast({ message: "An unexpected error occurred", type: "ERROR" });
      setIsProcessing(false);
    }
  };

  const isLoading = isProcessing || isBookingLoading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: £{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <div className="border rounded-md p-4 bg-gray-50">
          <PaymentElement />
        </div>
        
        {/* Test card information */}
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-1">Test Card Information</h4>
          <p className="text-sm text-yellow-700">
            <strong>Card:</strong> 4242 4242 4242 4242<br />
            <strong>Date:</strong> Any future date (e.g., 12/34)<br />
            <strong>CVC:</strong> Any 3 digits<br />
            <strong>ZIP:</strong> Any 5 digits
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white py-2 px-6 rounded font-bold hover:bg-gray-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="bg-blue-600 text-white py-2 px-6 rounded font-bold hover:bg-blue-500 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : `Confirm Booking - £${paymentIntent.totalCost}`}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;