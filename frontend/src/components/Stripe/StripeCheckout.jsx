import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import PropTypes from "prop-types";

export default function StripeCheckout({ onPaymentSuccess }) {
  const stripe = useStripe(); // To interact with Stripe
  const elements = useElements(); // For Stripe form elements
  const [loading, setLoading] = useState(false); // To manage loading state
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when the payment starts

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not been initialized yet.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements, // The PaymentElement rendered in the form
        confirmParams: {
          return_url: window.location.origin, // Redirect URL after successful payment
        },
        redirect: "if_required", // Prevent automatic redirection for testing
      });

      if (error) {
        // Handle payment errors
        setErrorMessage(error.message);
      } else {
        // Call the success callback with paymentIntent details
        onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
      console.error("Payment error:", error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render the Stripe Payment Element */}
      <PaymentElement />

      {/* Display error messages, if any */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Submit button with a loading state */}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

// Define the prop types for validation
StripeCheckout.propTypes = {
  onPaymentSuccess: PropTypes.func.isRequired,
};
