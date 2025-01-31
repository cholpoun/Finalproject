// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import styled from "styled-components";
// import { purchaseTicket } from "../api/ticketApi";

// const TicketPurchaseContainer = styled.div`
//   background-color: #fff;
//   color: #000;
//   padding: 20px;
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   width: 300px;
//   margin: 20px auto;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   text-align: center;
// `;

// const Title = styled.h2`
//   text-align: center;
//   margin-bottom: 15px;
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 5px;
//   text-align: center;
//   width: 100%;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 14px;
//   border: 1px solid #000000;
//   border-radius: 4px;
//   box-sizing: border-box;
//   text-align: center;
//   font-size: 16px;
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   margin-bottom: 10px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   box-sizing: border-box;
//   text-align: center;
// `;

// const Button = styled.button`
//   background-color: #1219f0;
//   color: #fff;
//   padding: 10px 15px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
//   width: 100%;
//   text-align: center;

//   &:hover {
//     background-color: #202124;
//   }
// `;

// const Message = styled.p`
//   margin-top: 10px;
//   text-align: center;
//   color: ${(props) => (props.success ? "green" : "red")};
// `;

// const QuantityControl = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 10px;
//   width: 100%;
// `;

// const QuantityButton = styled.button`
//   background-color: #fff;
//   border: 1px solid #000;
//   padding: 8px 12px;
//   margin: 0 5px;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 16px;
//   width: 40px;

//   &:hover {
//     background-color: #f0f0f0;
//   }
// `;

// const QuantityInput = styled(Input)`
//   width: 60px;
//   text-align: center;
// `;

// const PriceDisplay = styled.p`
//   text-align: center;
//   font-size: 18px;
//   margin-top: 20px;
//   font-weight: bold;
//   width: 100%;
// `;

// const TicketPurchase = ({ festivalId, token }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState("Credit Card");
//   const [message, setMessage] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [festival, setFestival] = useState(null);

//   // Fetch festival details when the component mounts
//   useEffect(() => {
//     const fetchFestival = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/festivals/${festivalId}`
//         );
//         const data = await response.json();
//         setFestival(data);
//       } catch (error) {
//         console.error("Failed to fetch festival:", error);
//         setMessage("Failed to fetch festival details.");
//       }
//     };

//     fetchFestival();
//   }, [festivalId]);

//   const handlePurchase = async () => {
//     if (!token) {
//       setMessage("You must be logged in to buy tickets.");
//       return;
//     }

//     if (!festival) {
//       setMessage("Festival details are not available.");
//       return;
//     }

//     try {
//       const response = await purchaseTicket(
//         festivalId,
//         quantity,
//         paymentMethod,
//         token
//       );
//       setMessage(response.message);
//       setSuccess(true);
//     } catch (error) {
//       console.error("Ticket purchase failed:", error);
//       setMessage("Ticket purchase failed. Please try again.");
//       setSuccess(false);
//     }
//   };

//   const increaseQuantity = () => setQuantity((prev) => prev + 1);
//   const decreaseQuantity = () =>
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   // Calculate total price if festival is available
//   const totalPrice = festival ? quantity * festival.ticketPrice : 0;

//   return (
//     <TicketPurchaseContainer>
//       <Title>Tickets</Title>
//       <QuantityControl>
//         <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
//         <QuantityInput type="number" value={quantity} readOnly />
//         <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
//       </QuantityControl>

//       <Label>Payment Method:</Label>
//       <Select
//         value={paymentMethod}
//         onChange={(e) => setPaymentMethod(e.target.value)}
//       >
//         <option value="Credit Card">Credit Card</option>
//         <option value="PayPal">PayPal</option>
//       </Select>

//       <Button onClick={handlePurchase}>Buy Now</Button>

//       {festival && <PriceDisplay>Total: {totalPrice} SEK</PriceDisplay>}
//       {message && <Message success={success}>{message}</Message>}
//     </TicketPurchaseContainer>
//   );
// };

// TicketPurchase.propTypes = {
//   festivalId: PropTypes.string.isRequired,
//   token: PropTypes.string.isRequired,
// };

// export default TiacketPurchase;

// import { useEffect, useState } from "react";
// import StripeWrapper from "./Stripe/StripeWrapper";
// import StripeCheckout from "./Stripe/StripeCheckout";
// import PropTypes from "prop-types";

// export default function TicketPurchase({ festivalId, quantity }) {
//   const [clientSecret, setClientSecret] = useState(null);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   useEffect(() => {
//     console.log("🎯 Sending data to API:", { festivalId, quantity }); // Log the payload

//     fetch("http://localhost:3000/api/tickets/create-payment-intent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is valid
//       },
//       body: JSON.stringify({ festivalId, quantity }), // Ensure quantity is included
//     })
//       .then((res) => {
//         console.log("🛠 API Response:", res); // Log the response
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("✅ Received clientSecret:", data.clientSecret); // Log the clientSecret
//         setClientSecret(data.clientSecret); // Set the clientSecret in state
//       })
//       .catch((err) => {
//         console.error("❌ Error fetching clientSecret:", err.message);
//       });
//   }, [festivalId, quantity]);

//   return (
//     <div>
//       <h2>Ticket Checkout</h2>
//       {paymentSuccess ? (
//         <p>✅ Payment Successful! Your tickets are confirmed.</p>
//       ) : clientSecret ? (
//         <StripeWrapper clientSecret={clientSecret}>
//           <StripeCheckout onPaymentSuccess={() => setPaymentSuccess(true)} />
//         </StripeWrapper>
//       ) : (
//         <p>Loading payment details...</p>
//       )}
//     </div>
//   );
// }

// TicketPurchase.propTypes = {
//   festivalId: PropTypes.string.isRequired,
//   quantity: PropTypes.number.isRequired,
// };

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "./Stripe/StripeCheckout";

const TicketPurchaseContainer = styled.div`
  background-color: #000;
  color: #fff; /* Ensure text is visible on a dark background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 320px;
  margin: 20px auto;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 15px;
  color: #ff9800; /* Added color for title */
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
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch Festival Details
  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/festivals/${festivalId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch festival details.");
        }
        const data = await response.json();
        setFestival(data);
      } catch (error) {
        console.error("Error fetching festival:", error.message);
      }
    };

    fetchFestival();
  }, [festivalId]);

  // Fetch Client Secret for Stripe Payment
  useEffect(() => {
    if (!festival || quantity < 1) return;

    const fetchClientSecret = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tickets/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ festivalId, quantity }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch client secret.");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error.message);
      }
    };

    fetchClientSecret();
  }, [festival, quantity, festivalId]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const totalPrice = festival ? quantity * festival.ticketPrice : 0;

  return (
    <TicketPurchaseContainer>
      <Title>Ticket Checkout</Title>

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
                onPaymentSuccess={() => setPaymentSuccess(true)}
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
