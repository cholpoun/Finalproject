import React, { useState } from "react";
import { purchaseTicket } from "../api/ticketApi";

const TicketPurchase = ({ festivalId, token }) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [message, setMessage] = useState("");

  const handlePurchase = async () => {
    try {
      const response = await purchaseTicket(festivalId, quantity, paymentMethod, token);
      setMessage(response.message);
    } catch (error) {
      setMessage("Ticket purchase failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Buy Ticket</h2>
      <label>Quantity:</label>
      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
      
      <label>Payment Method:</label>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="Credit Card">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </select>

      <button onClick={handlePurchase}>Buy Now</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TicketPurchase;
