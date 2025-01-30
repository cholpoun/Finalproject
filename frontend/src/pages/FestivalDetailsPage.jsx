import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import styled from "styled-components";
import FestivalDetails from "../components/FestivalDetails.jsx";
import TicketPurchase from "../components/TicketPurchase.jsx";
import Footer from "../components/Footer.jsx";

const FestivalDetailsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center all items horizontally */
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

  .login-link {
    color: white;
    text-decoration: underline;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      color: darkblue;
    }
  }

  /* Layout adjustments */
  .festival-content {
    display: flex;
    flex-direction: column; /* Stack content on mobile */
    gap: 2rem; /* Gap between elements */
    align-items: center; /* Center content horizontally */
    width: 100%;
    max-width: 1000px; /* Limit max width for larger screens */

    @media (min-width: 768px) {
      flex-direction: row; /* Place content side by side from tablet size */
      justify-content: space-between; /* Space them out */
    }
  }

  /* Adjustments for individual components */
  .festival-info,
  .ticket-purchase {
    flex: 1;
    min-width: 300px; /* Ensure each section has enough space */
  }
`;

const FestivalDetailsPage = () => {
  const { id: festivalId } = useParams(); // Get festivalId from URL
  const token = localStorage.getItem("token"); // Get stored user token

  return (
    <>
      <Navbar />
      <FestivalDetailsSection>
        <div className="festival-content">
          <div className="festival-info">
            <FestivalDetails festivalId={festivalId} />{" "}
            {/* Show festival details */}
          </div>
          <div className="ticket-purchase">
            {token ? (
              <TicketPurchase festivalId={festivalId} token={token} />
            ) : (
              <p>
                You need to log in to purchase a ticket.{" "}
                <Link to="/users/authenticate" className="login-link">
                  Log in here
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </FestivalDetailsSection>
      <Footer />
    </>
  );
};

export default FestivalDetailsPage;
