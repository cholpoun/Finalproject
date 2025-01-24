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
        const response = await fetch('https://finalproject-vol6.onrender.com/festivals');
        const data = await response.json();
        console.log('API Response:', data);
        setFestivals(Array.isArray(data.data) ? data.data : []);
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
        <FestivalsList festivals={festivals.slice(0, 9)} displayMode="default" />
      </FestivalSection>
      <Footer />
    </>
  );
};

export default HomePage;
