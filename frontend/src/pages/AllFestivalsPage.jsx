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

  const [searchParams, setSearchParams] = useSearchParams();

  const genreFilter = searchParams.get("genre") || "";
  const locationFilter = searchParams.get("location") || "";
  const sortOption = searchParams.get("sort") || "";
  const limit = 15;

  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  useEffect(() => {
    const genreQuery = genreFilter ? `&genre=${genreFilter}` : "";
    const locationQuery = locationFilter ? `&location=${locationFilter}` : "";

    axios
      .get(
        `http://localhost:3000/festivals?limit=${limit}${genreQuery}${locationQuery}`
      )
      .then((response) => {
        setFestivals(response.data.data);
        setFilteredFestivals(response.data.data);

        // Uppdatera unika genrer utan att rensa tidigare värden
        const genres = [
          ...new Set(response.data.data.map((festival) => festival.genre)),
        ];

        // Se till att alla genrer finns kvar
        setUniqueGenres((prevGenres) => [...prevGenres, ...genres]);

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
  }, [genreFilter, locationFilter, limit, sortOption]);

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

        <FestivalsList festivals={filteredFestivals} />
      </StyledSection>
    </>
  );
};

export default AllFestivals;
