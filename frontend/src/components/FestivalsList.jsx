import { useEffect, useState } from "react";
import axios from "axios";

const FestivalsList = () => {
  const [festivals, setFestivals] = useState([]);
  const [filteredFestivals, setFilteredFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://finalproject-vol6.onrender.com/festivals")
      .then((response) => {
        setFestivals(response.data.data);
        setFilteredFestivals(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = festivals;

    if (genreFilter) {
      filtered = filtered.filter((festival) =>
        festival.genre.toLowerCase().includes(genreFilter.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((festival) =>
        festival.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredFestivals(filtered);
  }, [genreFilter, locationFilter, festivals]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const uniqueGenres = [...new Set(festivals.map(festival => festival.genre))];
  const uniqueLocations = [
    ...new Set(festivals.map(festival => festival.location.split(",")[1].trim()))
  ];

  return (
    <div>
      <h1>Festivals</h1>

      {/* Filter Form */}
      <div>
        {/* Genre Filter Dropdown */}
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* Location Filter Dropdown */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Festival List */}
      <div>
        {filteredFestivals.length === 0 ? (
          <p>No festivals found</p>
        ) : (
          filteredFestivals.map((festival) => (
            <div key={festival._id}>
              <h2>{festival.name}</h2>
              <p>{festival.location}</p>
              <p>{festival.genre}</p>
              <p>Date: {new Date(festival.date).toLocaleDateString()}</p>
              <p>Price: {festival.ticketPrice} SEK</p>
              <p>Available Tickets: {festival.availableTickets}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FestivalsList;
