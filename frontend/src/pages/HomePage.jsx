import { useEffect, useState } from 'react';
import styled from 'styled-components';
import FestivalCard from '../components/FestivalCard.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';



const FestivalSection = styled.section`
  text-align: center;
  margin: 32px 16px;

  h2 {
    font-size: 2rem;
    margin-bottom: 24px;
  }
`;

const FestivalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    gap: 24px;
  }

  @media (min-width: 1024px) {
    gap: 32px;
    grid-template-columns: repeat(3, 1fr);
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
        <FestivalGrid>
          {festivals.slice(0, 9).map((festival) => (
            <FestivalCard
            key={festival._id} 
            name={festival.name}
              image={festival.imageUrl}
            />
          ))}
        </FestivalGrid>
      </FestivalSection>

      <Footer />
    </>
  );
};

export default HomePage;
