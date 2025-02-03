import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000"; // Ersätt med din backend-URL

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);

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
        setFavorites(data.favorites);
      } catch (error) {
        console.error("Fel vid hämtning av favoritfestivaler:", error);
      }
    };

    fetchFavorites();
  }, []);

  if (favorites.length === 0) {
    return <p>Du har inga favoriter sparade.</p>;
  }

  return (
    <div>
      <h2>Dina favoriter</h2>
      <ul>
        {favorites.map((festival) => (
          <li key={festival._id}>
            <Link to={`/festival/${festival._id}`}>{festival.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteList;
