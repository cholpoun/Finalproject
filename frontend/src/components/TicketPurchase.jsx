import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "./Stripe/StripeCheckout";

const TicketPurchaseContainer = styled.div`
  background-color: #000;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 320px;
  margin: 20px auto;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 15px;
  color: #ff9800;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

const QuantityButton = styled.button`
  background-color: #fff;
  color: #000;
  border: 1px solid #ff9800;
  padding: 8px 12px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #ff9800;
    color: #fff;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  border: 1px solid #ff9800;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  background-color: #000;
`;

const TotalPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #ff9800;
  margin-top: 10px;
`;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function TicketPurchase({ festivalId }) {
  const [quantity, setQuantity] = useState(1);
  const [festival, setFestival] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch Festival Details
  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await fetch(`http://localhost:3000/festivals/${festivalId}`);
        if (!response.ok) throw new Error("Failed to fetch festival details.");
        const data = await response.json();
        setFestival(data);
      } catch (error) {
        console.error("❌ Error fetching festival:", error.message);
        setError(error.message);
      }
    };

    fetchFestival();
  }, [festivalId]);

  // Fetch Client Secret for Stripe Payment
  useEffect(() => {
    if (!festival || quantity < 1) return;

    const fetchClientSecret = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to purchase tickets.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/tickets/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ festivalId, quantity }),
        });

        if (!response.ok) throw new Error("Failed to fetch client secret.");
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("❌ Error fetching client secret:", error.message);
        setError("Error processing payment. Please try again.");
      }
    };

    fetchClientSecret();
  }, [festival, quantity, festivalId]);

  // Function to Confirm Ticket Purchase After Payment
  const confirmTicketPurchase = async (paymentIntent) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to complete the purchase.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/tickets/${festivalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity,
          paymentIntentId: paymentIntent.id, // Send the Stripe Payment ID
        }),
      });

      if (!response.ok) throw new Error("Failed to save ticket purchase.");

      console.log("✅ Ticket purchase confirmed.");
      setPaymentSuccess(true);
    } catch (error) {
      console.error("❌ Error confirming ticket purchase:", error.message);
      setError("Payment successful, but ticket purchase failed.");
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const totalPrice = festival ? quantity * festival.ticketPrice : 0;

  return (
    <TicketPurchaseContainer>
      <Title>Ticket Checkout</Title>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {festival ? (
        <>
          <QuantityControl>
            <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
            <QuantityInput type="number" value={quantity} readOnly />
            <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
          </QuantityControl>

          <TotalPrice>Total Price: {totalPrice} SEK</TotalPrice>

          {paymentSuccess ? (
            <p>✅ Payment Successful! Your tickets are confirmed.</p>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeCheckout
                clientSecret={clientSecret}
                onPaymentSuccess={confirmTicketPurchase} // Call `confirmTicketPurchase` on success
              />
            </Elements>
          ) : (
            <p>Loading payment details...</p>
          )}
        </>
      ) : (
        <p>Loading festival details...</p>
      )}
    </TicketPurchaseContainer>
  );
}

TicketPurchase.propTypes = {
  festivalId: PropTypes.string.isRequired,
};
