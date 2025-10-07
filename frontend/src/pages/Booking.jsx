import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState(0);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  console.log("=== DEBUG ===");
  console.log("hotelId:", hotelId);
  console.log("numberOfNights:", numberOfNights);
  console.log("checkIn:", search.checkIn);
  console.log("checkOut:", search.checkOut);

  // Fetch current user first
  const { data: currentUser, error: userError, isLoading: userLoading } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    {
      retry: 1,
    }
  );

  console.log("currentUser:", currentUser);

  // Fetch hotel details
  const { data: hotel, error: hotelError, isLoading: hotelLoading } = useQuery(
    ["fetchHotelByID", hotelId],
    () => apiClient.fetchHotelById(hotelId),
    {
      enabled: !!hotelId,
      retry: 1,
    }
  );

  console.log("hotel:", hotel);

  // Create payment intent only when we have all required data
  const { 
    data: paymentIntentData, 
    error: paymentIntentError, 
    isLoading: paymentIntentLoading 
  } = useQuery(
    ["createPaymentIntent", hotelId, numberOfNights],
    () => apiClient.createPaymentIntent(hotelId, numberOfNights.toString()),
    {
      enabled: !!hotelId && numberOfNights > 0 && !!currentUser,
      retry: 1,
      onSuccess: (data) => {
        console.log("Payment intent success:", data);
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      },
      onError: (error) => {
        console.error("Payment intent error:", error);
      }
    }
  );

  console.log("paymentIntentData:", paymentIntentData);
  console.log("paymentIntentError:", paymentIntentError);
  console.log("clientSecret:", clientSecret);

  // Show loading states
  if (userLoading || hotelLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading hotel details...</div>;
  }

  if (userError) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading user: {userError.message}</div>;
  }

  if (hotelError) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading hotel: {hotelError.message}</div>;
  }

  if (paymentIntentError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div>
          <h2 className="text-xl font-bold mb-2">Payment Error</h2>
          <p>Error creating payment: {paymentIntentError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Stripe Not Configured</h2>
          <p>Please check your Stripe publishable key in the environment variables.</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="flex justify-center items-center min-h-screen">Hotel not found</div>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-8">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      
      <div className="flex justify-center items-center min-h-[400px]">
        {paymentIntentLoading ? (
          <div className="text-lg">Creating payment session...</div>
        ) : clientSecret && currentUser && paymentIntentData ? (
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret: clientSecret,
              appearance: {
                theme: 'stripe',
              },
            }}
          >
            <BookingForm
              currentUser={currentUser}
              paymentIntent={paymentIntentData}
            />
          </Elements>
        ) : (
          <div className="text-center">
            <div className="text-lg mb-2">Preparing payment form...</div>
            <div className="text-sm text-gray-600">
              <p>Hotel: {!!hotelId}</p>
              <p>Nights: {numberOfNights}</p>
              <p>User: {!!currentUser}</p>
              <p>Payment Intent: {!!paymentIntentData}</p>
              <p>Client Secret: {!!clientSecret}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;