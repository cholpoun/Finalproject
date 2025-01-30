import { useEffect, useState } from "react";
import PropTypes from 'prop-types'; // Importera PropTypes

const FestivalDetails = ({ festivalId }) => {
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFestival = async () => {
      setLoading(true);
      setError(""); // Återställ felmeddelandet

      try {
        const response = await fetch(`http://localhost:3000/festivals/${festivalId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch festival details. Status: ${response.status}`);
        }
        const data = await response.json();
        setFestival(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (festivalId) {
      fetchFestival();
    }
  }, [festivalId]);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;
  if (!festival) return <p>No festival found.</p>;

  return (
    <div>
      <h1>{festival.name}</h1>
      <p>Location: {festival.location}</p>
      <p>Genre: {festival.genre}</p>
      <p>Date: {new Date(festival.date).toLocaleDateString()}</p>
      <p>Ticket Price: {festival.ticketPrice} SEK</p>
      <p>Available Tickets: {festival.availableTickets}</p>
      <img src={festival.image} alt={festival.name} style={{ width: "300px", borderRadius: "10px" }} />
    </div>
  );
};

FestivalDetails.propTypes = {
  festivalId: PropTypes.string.isRequired
};

export default FestivalDetails;