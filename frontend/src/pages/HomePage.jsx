import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar.jsx';
import FestivalsList from '../components/FestivalsList.jsx';
import Footer from '../components/Footer.jsx';

const FestivalSection = styled.section`
  text-align: center;
  margin: 32px 16px;
  padding-top: 4rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 24px;
  }
`;

const HomePage = () => {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch('http://localhost:3000/festivals');
        const data = await response.json();
        console.log('API Response:', data);
        setFestivals(data.data); // Correctly set data to state
      } catch (error) {
        console.error('Error fetching festival data:', error);
        setFestivals([]);
      }
    };

    fetchFestivals();
  }, []);

  return (
    <>
      <Navbar />
      <FestivalSection>
        <h2>Festivals</h2>
        <FestivalsList festivals={festivals.slice(0, 9)} />
      </FestivalSection>
      <Footer />
    </>
  );
};

export default HomePage;
