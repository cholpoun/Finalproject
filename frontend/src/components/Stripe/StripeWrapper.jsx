import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";

StripeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  clientSecret: PropTypes.string.isRequired,
};


const stripePromise = loadStripe("your-stripe-public-key-here");

export default function StripeWrapper({ children, clientSecret }) {
  if (!clientSecret) return null; // Ensure clientSecret is present

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
