import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import styled from 'styled-components';
import FestivalDetails from '../components/FestivalDetails.jsx';

const FestivalDetailsSection = styled.section`
  text-align: center;
  margin: 32px 16px;
  padding-top: 4rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 16px;
  }

  p {
    font-size: 1.2rem;
    margin: 8px 0;
  }
`;

const FestivalDetailsPage = () => {
  const { id: festivalId } = useParams(); // Hämta festivalId från URL:en

  return (
    <>
      <Navbar />
      <FestivalDetailsSection>
        <FestivalDetails festivalId={festivalId} /> {/* Skicka festivalId som prop */}
      </FestivalDetailsSection>
    </>
  );
};

export default FestivalDetailsPage;