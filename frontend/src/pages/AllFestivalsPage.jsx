import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Filters from "../components/Filters.jsx";
import SortOptions from "../components/SortOptions.jsx";
import FestivalsList from "../components/FestivalsList.jsx";
import Pagination from "../components/Pagination.jsx";
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
  const currentPage = Number(searchParams.get("page")) || 1;
  const genreFilter = searchParams.get("genre") || "";
  const locationFilter = searchParams.get("location") || "";
  const sortOption = searchParams.get("sort") || "";
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/festivals?page=${currentPage}&limit=${limit}`)
      .then((response) => {
        setFestivals(response.data.data);
        setFilteredFestivals(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, [currentPage]);

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
      page: currentPage,
      genre: newGenre || "",
      location: newLocation || "",
      sort: sortOption || "",
    });
  };

  const handleSortChange = (newSort) => {
    setSearchParams({
      page: currentPage,
      genre: genreFilter || "",
      location: locationFilter || "",
      sort: newSort || "",
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage,
      genre: genreFilter || "",
      location: locationFilter || "",
      sort: sortOption || "",
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
      <Navbar />
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

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          setCurrentPage={handlePageChange}
        />
      </StyledSection>
    </>
  );
};

export default AllFestivals;
