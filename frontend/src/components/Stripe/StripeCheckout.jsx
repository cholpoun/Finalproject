import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function StripeCheckout({ clientSecret, onPaymentSuccess }) {
  const stripe = useStripe(); // Stripe instance
  const elements = useElements(); // Stripe elements
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message
  const [isReady, setIsReady] = useState(false); // Check if Stripe is ready

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not been initialized yet.");
      setLoading(false);
      return;
    }

    try {
      console.log("🟢 Initiating Payment...");
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin, // Redirect URL after successful payment
        },
        redirect: "if_required", // Prevent automatic redirection
      });

      if (error) {
        console.error("❌ Stripe Payment Error:", error);
        setErrorMessage(error.message);
      } else {
        console.log("✅ Payment Successful:", paymentIntent);
        onPaymentSuccess(paymentIntent); // Notify parent component
      }
    } catch (error) {
      console.error("❌ Payment processing error:", error.message);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret) {
    return <p style={{ color: "red" }}>⚠️ Client secret missing. Payment cannot proceed.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Stripe Payment Form */}
      <PaymentElement />

      {/* Display error messages, if any */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Submit button with loading state */}
      <button type="submit" disabled={!stripe || !isReady || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

// ✅ Define Prop Types for Validation
StripeCheckout.propTypes = {
  clientSecret: PropTypes.string.isRequired, // Ensure clientSecret is passed
  onPaymentSuccess: PropTypes.func.isRequired,
};
