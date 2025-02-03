import { useEffect, useState } from "react";

const FavoriteFestivals = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        // Hämta användarens ID från token eller använd en egen logik för att få ID:t
        const userId = "här_sätts_användarens_id"; // Förmodligen från token eller context

        const response = await fetch(`/api/users/${userId}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites);
        } else {
          console.error("Failed to fetch favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>My Favorite Festivals</h2>
      <ul>
        {favorites.length > 0 ? (
          favorites.map((festival) => (
            <li key={festival._id}>
              {festival.name} - {festival.location} ({festival.date})
            </li>
          ))
        ) : (
          <p>No favorite festivals yet.</p>
        )}
      </ul>
    </div>
  );
};

export default FavoriteFestivals;
