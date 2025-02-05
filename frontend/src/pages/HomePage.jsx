import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importera Link
import styled from "styled-components";
import FestivalsList from "../components/FestivalsList.jsx";

const FestivalSection = styled.section`
  text-align: center;
  margin: 32px 16px;
  padding-top: 4rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 24px;
  }
`;

const Button = styled.button`
  background-color: #176b91;
  color: white;
  border: none;
  padding: 12px 24px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e07ba1;
  }
`;

const HomePage = () => {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch("http://localhost:3000/festivals");
        const data = await response.json();
        console.log("API Response:", data);
        setFestivals(data.data);
      } catch (error) {
        console.error("Error fetching festival data:", error);
        setFestivals([]);
      }
    };

    fetchFestivals();
  }, []);

  return (
    <>
      <FestivalSection>
        <h2>New Festivals</h2>
        <FestivalsList festivals={festivals.slice(0, 8)} />

        {/* Lägger till en knapp som länkar till /festivals */}
        <Link to="/festivals">
          <Button>See All Festivals</Button>
        </Link>
      </FestivalSection>
    </>
  );
};

export default HomePage;
