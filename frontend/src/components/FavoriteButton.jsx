import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const API_BASE_URL = "http://localhost:3000";

const FavoriteButton = ({ festivalId, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Sätt till true om token finns

    if (!token) return;

    const fetchFavorites = async () => {
      try {
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
    if (!isLoggedIn) return;

    try {
      const method = isFavorite ? "DELETE" : "PUT";
      const response = await fetch(
        `${API_BASE_URL}/users/me/favorite/${festivalId}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Serverfel:", errorText);
        throw new Error(`Serverfel: ${errorText}`);
      }

      setIsFavorite(!isFavorite);
      onToggleFavorite(); // Uppdatera favoritantalet direkt
    } catch (error) {
      console.error("Fel vid hantering av favorit:", error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!isLoggedIn} // Inaktiverad om inte inloggad
      aria-label={isLoggedIn ? "Toggle favorite" : "Log in to add favorite"}
      title={isLoggedIn ? "" : "Log in to add favorite"} // Tooltip om ej inloggad
      style={{
        background: "transparent",
        border: "none",
        cursor: isLoggedIn ? "pointer" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isLoggedIn ? 1 : 0.5,
      }}
    >
      <Heart
        size={24}
        fill={isFavorite ? "red" : "none"}
        stroke={isFavorite ? "none" : "red"}
      />
    </button>
  );
};

FavoriteButton.propTypes = {
  festivalId: PropTypes.string.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default FavoriteButton;
