import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { purchaseTicket } from "../api/ticketApi";

const TicketPurchaseContainer = styled.div`
  background-color: #fff;
  color: #000;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  text-align: center;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid #000000;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
`;

const Button = styled.button`
  background-color: #1219f0;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: center;

  &:hover {
    background-color: #202124;
  }
`;

const Message = styled.p`
  margin-top: 10px;
  text-align: center;
  color: ${(props) => (props.success ? "green" : "red")};
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  width: 100%;
`;

const QuantityButton = styled.button`
  background-color: #fff;
  border: 1px solid #000;
  padding: 8px 12px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 40px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const QuantityInput = styled(Input)`
  width: 60px;
  text-align: center;
`;

const PriceDisplay = styled.p`
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
  font-weight: bold;
  width: 100%;
`;

const TicketPurchase = ({ festivalId, token }) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [festival, setFestival] = useState(null);

  // Fetch festival details when the component mounts
  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/festivals/${festivalId}`
        );
        const data = await response.json();
        setFestival(data);
      } catch (error) {
        console.error("Failed to fetch festival:", error);
        setMessage("Failed to fetch festival details.");
      }
    };

    fetchFestival();
  }, [festivalId]);

  const handlePurchase = async () => {
    if (!token) {
      setMessage("You must be logged in to buy tickets.");
      return;
    }

    if (!festival) {
      setMessage("Festival details are not available.");
      return;
    }

    try {
      const response = await purchaseTicket(
        festivalId,
        quantity,
        paymentMethod,
        token
      );
      setMessage(response.message);
      setSuccess(true);
    } catch (error) {
      console.error("Ticket purchase failed:", error);
      setMessage("Ticket purchase failed. Please try again.");
      setSuccess(false);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Calculate total price if festival is available
  const totalPrice = festival ? quantity * festival.ticketPrice : 0;

  return (
    <TicketPurchaseContainer>
      <Title>Tickets</Title>
      <QuantityControl>
        <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
        <QuantityInput type="number" value={quantity} readOnly />
        <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
      </QuantityControl>

      <Label>Payment Method:</Label>
      <Select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="Credit Card">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </Select>

      <Button onClick={handlePurchase}>Buy Now</Button>

      {festival && <PriceDisplay>Total: {totalPrice} SEK</PriceDisplay>}
      {message && <Message success={success}>{message}</Message>}
    </TicketPurchaseContainer>
  );
};

TicketPurchase.propTypes = {
  festivalId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default TicketPurchase;
