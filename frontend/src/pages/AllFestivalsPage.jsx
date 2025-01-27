import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar.jsx';
import Filters from "../components/Filters.jsx";
import SortOptions from "../components/SortOptions.jsx";
import FestivalsList from "../components/FestivalsList.jsx";
import styled from "styled-components";

const StyledSection = styled.section`
  padding-top: 4rem;  
  margin: 0 16px;  
`;

const AllFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [filteredFestivals, setFilteredFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/festivals")
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

        {/* Filters */}
        <Filters
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          uniqueGenres={uniqueGenres}
          uniqueLocations={uniqueLocations}
        />

        {/* Sort Options */}
        <SortOptions sortOption={sortOption} setSortOption={setSortOption} />

        {/* Festival List */}
        <FestivalsList festivals={filteredFestivals} />
      </StyledSection>
    </>
  );
};

export default AllFestivals;
