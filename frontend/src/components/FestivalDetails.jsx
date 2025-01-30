import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const DetailsContainer = styled.div`
  background: linear-gradient(135deg, #e07ba1 0%, #176b91 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #f4f4f4;
  font-family: "Quicksand", sans-serif;
  max-width: 500px;
  margin: auto;
`;

const FestivalImage = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  margin-top: 10px;
`;

const FestivalDetails = ({ festivalId }) => {
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFestival = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:3000/festivals/${festivalId}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch festival details. Status: ${response.status}`
          );
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
    <DetailsContainer>
      <h1>{festival.name}</h1>
      <p>
        <strong>Location:</strong> {festival.location}
      </p>
      <p>
        <strong>Genre:</strong> {festival.genre}
      </p>
      <p>
        <strong>Date:</strong> {new Date(festival.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Ticket Price:</strong> {festival.ticketPrice} SEK
      </p>
      <p>
        <strong>Available Tickets:</strong> {festival.availableTickets}
      </p>
      <FestivalImage src={festival.image} alt={festival.name} />
    </DetailsContainer>
  );
};

FestivalDetails.propTypes = {
  festivalId: PropTypes.string.isRequired,
};

export default FestivalDetails;
