import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import styled from 'styled-components';
import FestivalDetails from '../components/FestivalDetails.jsx';  
import FestivalTickets from '../components/Tickets.jsx';

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
  const { id: festivalId } = useParams();  // Get the festival ID from the route params

  return (
    <>
      <Navbar />
      <FestivalDetailsSection>
        <Link to="/festivals" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Festivals
        </Link>
        <FestivalDetails /> 
      </FestivalDetailsSection>
      <div>
        <FestivalTickets festivalId={festivalId} userToken="YOUR_USER_TOKEN" /> {/* Pass festivalId */}
      </div>
    </>
  );
};

export default FestivalDetailsPage;
