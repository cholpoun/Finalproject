import { Link } from 'react-router-dom';
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
  return (
    <>
      <Navbar />
      <FestivalDetailsSection>
        <Link to="/festivals" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Festivals
        </Link>
        
        <FestivalDetails /> {/* Använd komponenten här */}
        
      </FestivalDetailsSection>
    </>
  );
};

export default FestivalDetailsPage;
