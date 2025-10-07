import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

console.log("Stripe Key Loaded:", STRIPE_PUB_KEY ? "Yes" : "No"); // Debug log

const AppContext = React.createContext();

const stripePromise = STRIPE_PUB_KEY ?loadStripe(STRIPE_PUB_KEY) : null;

export const AppContextProvider = ({ children }) => {
  const [toast, setToast] = useState(undefined);

  const { isError, error, isLoading, data } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Add debug logging
  console.log("AppContext Debug:", {
    isError,
    error,
    isLoading,
    data,
    isLoggedIn: !isError
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        stripePromise,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};