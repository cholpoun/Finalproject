import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "./Stripe/StripeCheckout";
import { Plus, Minus } from "lucide-react";

const PaymentContainer = styled.div`
  background: linear-gradient(#0e72a4 0%, #fadae4 100%);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #f9f9f9;
  max-width: 450px;
  position: relative;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const QuantityButton = styled.button`
  background-color: #ffffff;
  color: #000000;
  width: 40px;
  height: 40px;
  border: 1px solid;
  padding: 0;
  margin: 0 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f7b97a;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid #000000;
  border-radius: 8px;
  font-size: 16px;
  color: #000000;
  background-color: #ffffff;
`;

const TotalPrice = styled.p`
  color: #000000;
`;

const InfoBox = styled.div`
  background-color: #ffffff;
  color: #000000;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  text-align: left;
  margin: 8px auto;
  width: 80%;
`;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function TicketPurchase({ festivalId }) {
  const [quantity, setQuantity] = useState(1);
  const [festival, setFestival] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/festivals/${festivalId}`
        );
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

  useEffect(() => {
    if (!festival || quantity < 1) return;

    const fetchClientSecret = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to purchase tickets.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/tickets/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ festivalId, quantity }),
          }
        );

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

  const confirmTicketPurchase = async (paymentIntent) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to complete the purchase.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/tickets/${festivalId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
            paymentIntentId: paymentIntent.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save ticket purchase.");

      console.log("✅ Ticket purchase confirmed.");
      setPaymentSuccess(true);
    } catch (error) {
      console.error("❌ Error confirming ticket purchase:", error.message);
      setError("Payment successful, but ticket purchase failed.");
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const totalPrice = festival ? quantity * festival.ticketPrice : 0;

  return (
    <PaymentContainer>
      <Title>Complete Your Payment</Title>

      {error && <p style={{ color: "#ff0000" }}>{error}</p>}

      {festival ? (
        <>
          <p>
            <strong>{festival.name}</strong>
          </p>
          <p>
            <strong>Location:</strong> {festival.location}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(festival.date).toLocaleDateString()}
          </p>
          <QuantityControl>
            <QuantityButton onClick={decreaseQuantity}>
              <Minus size={20} />
            </QuantityButton>
            <QuantityInput type="number" value={quantity} readOnly />
            <QuantityButton onClick={increaseQuantity}>
              <Plus size={20} />
            </QuantityButton>
          </QuantityControl>

          <TotalPrice>Total Price: {totalPrice} SEK</TotalPrice>

          <InfoBox>
            Stripe test payment
            <br />
            Kortnummer: 4242424242424242 <br /> CVC-kod: Any 3 digits <br />{" "}
            Sista giltighetsdag: Any future date
          </InfoBox>

          {paymentSuccess ? (
            <p>
              ✅ Payment Successful! Your tickets are confirmed and saved to
              your profile!
            </p>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeCheckout
                clientSecret={clientSecret}
                onPaymentSuccess={confirmTicketPurchase}
              />
            </Elements>
          ) : (
            <p>Loading payment details...</p>
          )}
        </>
      ) : (
        <p>Loading festival details...</p>
      )}
    </PaymentContainer>
  );
}

TicketPurchase.propTypes = {
  festivalId: PropTypes.string.isRequired,
};
