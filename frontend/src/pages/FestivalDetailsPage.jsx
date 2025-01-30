import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import styled from "styled-components";
import FestivalDetails from "../components/FestivalDetails.jsx";
import TicketPurchase from "../components/TicketPurchase.jsx";

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
  const { id: festivalId } = useParams(); // Get festivalId from URL
  const token = localStorage.getItem("token"); // Get stored user token

  return (
    <>
      <Navbar />
      <FestivalDetailsSection>
        <FestivalDetails festivalId={festivalId} /> {/* Show festival details */}
        
        {/* Add Ticket Purchase Component */}
        {token ? (
          <TicketPurchase festivalId={festivalId} token={token} />
        ) : (
          <p>You need to log in to purchase a ticket.</p>
        )}
      </FestivalDetailsSection>
    </>
  );
};

export default FestivalDetailsPage;
