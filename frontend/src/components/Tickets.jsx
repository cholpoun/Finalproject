import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";

const API_URL = import.meta.env.VITE_API_URL;

const stripePromise = loadStripe("your-publishable-key-here");

const FestivalTickets = ({ festivalId, userToken }) => {
  const [festival, setFestival] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await fetch(`${API_URL}/festivals/${festivalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch festival information");
        }
        const data = await response.json();
        setFestival(data);
      } catch (err) {
        console.error("Error fetching festival data:", err.message);
        setMessage(`Error: ${err.message}`);
      }
    };

    fetchFestival();
  }, [festivalId]);

  const handleBuyTickets = async () => {
    if (!userToken) {
      setMessage("You must be logged in to buy tickets.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ festivalId, quantity }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.id,
        });

        if (error) {
          console.error("Stripe Checkout error:", error);
          setMessage("There was an issue redirecting to Stripe Checkout.");
        }
      } else {
        setMessage(result.error || "Failed to create checkout session.");
      }
    } catch (err) {
      console.error("An error occurred:", err.message);
      setMessage("An error occurred while purchasing tickets.");
    }
  };

  return (
    <div>
      {festival ? (
        <>
          <h1>{festival.name}</h1>
          <p>Price per ticket: {festival.ticketPrice} SEK</p>
          <p>Date: {new Date(festival.date).toLocaleDateString()}</p>
          <p>Tickets available: {festival.availableTickets}</p>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              max={Math.min(festival.availableTickets, 10)}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
          <button onClick={handleBuyTickets}>Buy Tickets</button>
          {message && <p>{message}</p>}
        </>
      ) : (
        <p>Loading festival information...</p>
      )}
    </div>
  );
};

FestivalTickets.propTypes = {
  festivalId: PropTypes.string.isRequired,
  userToken: PropTypes.string.isRequired,
};

export default FestivalTickets;
