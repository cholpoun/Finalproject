import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar.jsx';
import Filters from "../components/Filters.jsx";
import SortOptions from "../components/SortOptions.jsx";
import FestivalsList from "../components/FestivalsList.jsx";
import styled from "styled-components";

// Flex-container for filters and sort options on one row
const StyledControls = styled.div`
  display: flex;
  gap: 16px; /* Space between filters and sort options */
  margin: 16px 0;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledSection = styled.section`
  min-height: 100vh;  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 16px;  
  text-align: center;
`;

const AllFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [filteredFestivals, setFilteredFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [favoriteFestivals, setFavoriteFestivals] = useState(
    JSON.parse(localStorage.getItem("favoriteFestivals")) || []
  );

  useEffect(() => {
    axios
      .get("https://finalproject-jan30.onrender.com/festivals")
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

    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        if (sortOption === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortOption === "date") {
          return new Date(a.date) - new Date(b.date);
        } else if (sortOption === "price") {
          return a.ticketPrice - b.ticketPrice;
        }
        return 0;
      });
    }

    setFilteredFestivals(filtered);
  }, [genreFilter, locationFilter, sortOption, festivals]);

  const handleFavoriteToggle = (festivalId, isFavorite) => {
    let updatedFavorites = [...favoriteFestivals];
    if (isFavorite) {
      updatedFavorites.push(festivalId);
    } else {
      updatedFavorites = updatedFavorites.filter((id) => id !== festivalId);
    }

    setFavoriteFestivals(updatedFavorites);
    localStorage.setItem("favoriteFestivals", JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const uniqueGenres = [...new Set(festivals.map((festival) => festival.genre))];
  const uniqueLocations = [
    ...new Set(
      festivals.map((festival) =>
        festival.location.split(",")[1]?.trim() || festival.location
      )
    ),
  ];

  return (
    <>
      <Navbar />
      <StyledSection>
        <h1>All Festivals</h1>

        {/* Filters and Sort Options in one row */}
        <StyledControls>
          <Filters
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            uniqueGenres={uniqueGenres}
            uniqueLocations={uniqueLocations}
          />
          <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
        </StyledControls>

        {/* Festival List */}
        <FestivalsList
          festivals={filteredFestivals}
          favoriteFestivals={favoriteFestivals}
          onFavoriteToggle={handleFavoriteToggle} // Funktion för att toggla favoritstatus
        />
      </StyledSection>
    </>
  );
};

export default AllFestivals;
