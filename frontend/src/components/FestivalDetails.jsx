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
  max-width: 500px;
  margin: auto;
`;

const FestivalImage = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  margin-top: 10px;
`;

const API_URL = import.meta.env.VITE_API_URL;

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
          `${API_URL}/festivals/${festivalId}`
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

  if (error) return <p role="alert">Error: {error}</p>;
  if (loading) return <p role="status">Loading...</p>;
  if (!festival) return <p>No festival found.</p>;

  return (
    <DetailsContainer>
      <FestivalImage
        src={festival.image}
        alt={`Image of ${festival.name}`}
        aria-describedby="festival-name"
      />
      <h1 id="festival-name">{festival.name}</h1>
      <p>
        <strong>Bio:</strong> {festival.bio}
      </p>
      <br />
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
    </DetailsContainer>
  );
};

FestivalDetails.propTypes = {
  festivalId: PropTypes.string.isRequired,
};

export default FestivalDetails;
