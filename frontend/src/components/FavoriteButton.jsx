import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000"; // Ersätt med din backend-URL

const FavoriteButton = ({ festivalId, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Ingen token hittades.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users/me/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Kunde inte hämta favoriter:", response.statusText);
          return;
        }

        const data = await response.json();
        const isFav = data.favorites.some(
          (festival) => festival._id === festivalId
        );
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Fel vid hämtning av favoritfestivaler:", error);
      }
    };

    fetchFavorites();
  }, [festivalId]);

  const handleToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Ingen token hittades. Omdirigerar till inloggning...");
      navigate("/users/authenticate");
      return;
    }

    try {
      const method = isFavorite ? "DELETE" : "PUT";
      const response = await fetch(
        `${API_BASE_URL}/users/me/favorite/${festivalId}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Serverfel:", errorText);
        throw new Error(`Serverfel: ${errorText}`);
      }

      const data = await response.json();
      console.log("Favoriter uppdaterade:", data);

      setIsFavorite(!isFavorite);
      onToggleFavorite();
    } catch (error) {
      console.error("Fel vid hantering av favorit:", error);
    }
  };

  return (
    <button onClick={handleToggle} aria-label="Toggle favorite">
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
};

FavoriteButton.propTypes = {
  festivalId: PropTypes.string.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default FavoriteButton;
