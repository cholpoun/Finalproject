import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e07ba1 0%, #176b91 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  width: 100%;
  height: 100%;
  padding: 6px 0;
  display: flex;
  justify-content: space-between;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 8px;
  text-align: center;
  color: #f4f4f4;
  flex-grow: 1;
`;

const FestivalDetails = styled.p`
  color: #f4f4f4;
  margin: 4px 0;
  word-wrap: break-word;
`;

const FestivalLink = styled(Link)`
  text-decoration: none;
  display: inline-block;

  h2 {
    color: #f4f4f4;
    transition: color 0.3s ease, text-decoration 0.3s ease;
    font-size: 16px;
    word-wrap: break-word;
  }

  &:hover h2 {
    color: #eeffaf;
    text-decoration: underline;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const API_URL = import.meta.env.VITE_API_URL;

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found.");
          return;
        }

        const response = await fetch(`${API_URL}/users/me/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Could not fetch favorites:", response.statusText);
          return;
        }

        const data = await response.json();
        setFavorites(data.favorites);
      } catch (error) {
        console.error("Error fetching favorite festivals:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = () => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/users/me/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error("Error fetching favorite festivals:", error);
      }
    };

    fetchFavorites();
  };

  if (favorites.length === 0) {
    return <p>You have no favorites saved.</p>;
  }

  return (
    <GridContainer>
      {favorites.map((festival) => (
        <Card key={festival._id}>
          <CardContent>
            <FestivalLink to={`/festivals/${festival._id}`}>
              <h2>{festival.name}</h2>
            </FestivalLink>
            <FestivalDetails>
              <strong>Location:</strong> {festival.location}
            </FestivalDetails>
            <FestivalDetails>
              <strong>Date:</strong>{" "}
              {new Date(festival.date).toLocaleDateString()}
            </FestivalDetails>
          </CardContent>
          <FavoriteButton
            festivalId={festival._id}
            onToggleFavorite={handleToggleFavorite}
          />
        </Card>
      ))}
    </GridContainer>
  );
};

export default FavoriteList;
