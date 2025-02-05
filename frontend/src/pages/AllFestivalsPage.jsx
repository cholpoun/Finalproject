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

const PaginationControls = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;

  button {
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    font-size: 16px;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const API_URL = import.meta.env.VITE_API_URL;

const AllFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [filteredFestivals, setFilteredFestivals] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const genreFilter = searchParams.get("genre") || "";
  const locationFilter = searchParams.get("location") || "";
  const sortOption = searchParams.get("sort") || "";

  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const festivalsPerPage = 5; // Change this number as needed

  useEffect(() => {
    const genreQuery = genreFilter ? `&genre=${genreFilter}` : "";
    const locationQuery = locationFilter ? `&location=${locationFilter}` : "";
    const pageQuery = `?page=${currentPage}&limit=${festivalsPerPage}`;

    axios
      .get(`${API_URL}/festivals${pageQuery}${genreQuery}${locationQuery}`)
      .then((response) => {
        setFestivals(response.data.data);
        setFilteredFestivals(response.data.data);

        const genres = [
          ...new Set(response.data.data.map((festival) => festival.genre)),
        ];

        setUniqueGenres((prevGenres) =>
          Array.from(new Set([...prevGenres, ...genres]))
        );

        const allLocations = response.data.data.map(
          (festival) => festival.location
        );
        const uniqueLocationsSet = new Set();

        allLocations.forEach((locationString) => {
          if (locationString) {
            const parts = locationString.split(",");
            if (parts.length > 1) {
              const city = parts[0].trim();
              const country = parts[1].trim();
              uniqueLocationsSet.add(`${city}, ${country}`);
            } else {
              uniqueLocationsSet.add(locationString.trim());
            }
          }
        });

        setUniqueLocations(Array.from(uniqueLocationsSet));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [genreFilter, locationFilter, sortOption, currentPage]);

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
        if (sortOption === "name-asc") {
          return a.name.localeCompare(b.name);
        } else if (sortOption === "name-desc") {
          return b.name.localeCompare(a.name);
        } else if (sortOption === "genre-asc") {
          return a.genre.localeCompare(b.genre);
        } else if (sortOption === "genre-desc") {
          return b.genre.localeCompare(a.genre);
        }
        return 0;
      });
    }

    setFilteredFestivals(filtered);
  }, [genreFilter, locationFilter, sortOption, festivals]);

  const handleFilterChange = (newGenre, newLocation) => {
    setSearchParams((prevParams) => {
      return {
        ...prevParams,
        genre: newGenre || "",
        location: newLocation || "",
        sort: prevParams.get("sort") || "",
      };
    });
  };

  const handleSortChange = (newSort) => {
    setSearchParams((prevParams) => {
      return {
        ...prevParams,
        sort: newSort || "",
        genre: prevParams.get("genre") || "",
        location: prevParams.get("location") || "",
      };
    });
  };

  // Pagination handlers
  const totalPages = Math.ceil(festivals.length / festivalsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <StyledSection>
        <h1>All Festivals</h1>

        <StyledControls role="region" aria-labelledby="festival-filters">
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

        <FestivalsList festivals={filteredFestivals} aria-live="polite" />

        {/* Pagination Controls */}
        <PaginationControls>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </PaginationControls>
      </StyledSection>
    </>
  );
};

export default AllFestivals;
