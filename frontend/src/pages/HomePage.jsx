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
  const [favoriteFestivals, setFavoriteFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch('https://finalproject-jan30.onrender.com/festivals');
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

  const onFavoriteToggle = (festivalId) => {
    setFavoriteFestivals((prevFavorites) => {
      if (prevFavorites.includes(festivalId)) {
        // Remove from favorites if already in the list
        return prevFavorites.filter((id) => id !== festivalId);
      } else {
        // Add to favorites if not already in the list
        return [...prevFavorites, festivalId];
      }
    });
  };

  return (
    <>
      <Navbar />
      <FestivalSection>
        <h2>Festivals</h2>
        <FestivalsList
          festivals={festivals.slice(0, 9)}
          favoriteFestivals={favoriteFestivals}
          onFavoriteToggle={onFavoriteToggle} // Passing the function here
        />
      </FestivalSection>
      <Footer />
    </>
  );
};

export default HomePage;
