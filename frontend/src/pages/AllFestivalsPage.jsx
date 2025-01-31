import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Filters from "../components/Filters.jsx";
import SortOptions from "../components/SortOptions.jsx";
import FestivalsList from "../components/FestivalsList.jsx";
import styled from "styled-components";

const StyledControls = styled.div`
  display: flex;
  gap: 16px;
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
  const [favoriteFestivals, setFavoriteFestivals] = useState(
    JSON.parse(localStorage.getItem("favoriteFestivals")) || []
  );

  const [searchParams, setSearchParams] = useSearchParams();

  // Hämta parametrar från URL
  const genreFilter = searchParams.get("genre") || "";
  const locationFilter = searchParams.get("location") || "";
  const sortOption = searchParams.get("sort") || "";
  const limit = 15; // Visar endast 15 festivaler

  useEffect(() => {
    setLoading(true);

    // Om genre är definierad, hämta festivaler baserat på genre
    const genreQuery = genreFilter ? `&genre=${genreFilter}` : "";
    const locationQuery = locationFilter ? `&location=${locationFilter}` : "";

    axios
      .get(
        `http://localhost:3000/festivals?limit=${limit}${genreQuery}${locationQuery}`
      ) // Fokuserar på genre och location
      .then((response) => {
        setFestivals(response.data.data);
        setFilteredFestivals(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, [genreFilter, locationFilter, limit]); // Lägg till genreFilter och locationFilter som beroende

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

  const handleFilterChange = (newGenre, newLocation) => {
    setSearchParams({
      genre: newGenre || "",
      location: newLocation || "",
      sort: sortOption || "",
    });
  };

  const handleSortChange = (newSort) => {
    setSearchParams({
      genre: genreFilter || "",
      location: locationFilter || "",
      sort: newSort || "",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const uniqueGenres = [
    ...new Set(festivals.map((festival) => festival.genre)),
  ];
  const uniqueLocations = [
    ...new Set(
      festivals.map(
        (festival) =>
          festival.location.split(",")[1]?.trim() || festival.location
      )
    ),
  ];

  return (
    <>
      <StyledSection>
        <h1>All Festivals</h1>

        <StyledControls>
          <Filters
            genreFilter={genreFilter}
            setGenreFilter={handleFilterChange}
            locationFilter={locationFilter}
            setLocationFilter={handleFilterChange}
            uniqueGenres={uniqueGenres}
            uniqueLocations={uniqueLocations}
          />
          <SortOptions
            sortOption={sortOption}
            setSortOption={handleSortChange}
          />
        </StyledControls>

        <FestivalsList
          festivals={filteredFestivals}
          favoriteFestivals={favoriteFestivals}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </StyledSection>
    </>
  );
};

export default AllFestivals;
