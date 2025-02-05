import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import FestivalDetails from "../components/FestivalDetails.jsx";
import TicketPurchase from "../components/TicketPurchase.jsx";

const FestivalDetailsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 32px 16px;
  padding-top: 60px;

  p {
    font-size: 1.2rem;
    margin: 8px 0;
  }

  .login-link {
    color: #ffd700;
    text-decoration: underline;
    font-weight: bold;
    cursor: pointer;

    &:hover,
    &:focus {
      color: #ff9900;
      outline: 2px solid #ff9900;
    }
  }

  .festival-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    align-items: center;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
    }
  }

  .festival-info,
  .ticket-purchase {
    flex: 1;
    min-width: 300px;
    text-align: center; 
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const FestivalDetailsPage = () => {
  const { id: festivalId } = useParams();
  const token = localStorage.getItem("token");

  return (
    <>
      <FestivalDetailsSection>
        <h1 id="festival-heading">Festival Details</h1>
        <div
          className="festival-content"
          role="region"
          aria-labelledby="festival-heading"
        >
          <div className="festival-info">
            <FestivalDetails festivalId={festivalId} />
          </div>
          <Wrapper>
            <div className="ticket-purchase">
              {token ? (
                <TicketPurchase festivalId={festivalId} token={token} />
              ) : (
                <p aria-live="polite">
                  You need to log in to purchase a ticket.{" "}
                  <Link to="/users/authenticate" className="login-link">
                    Log in here
                  </Link>
                  .
                </p>
              )}
            </div>{" "}
          </Wrapper>
        </div>
      </FestivalDetailsSection>
    </>
  );
};

export default FestivalDetailsPage;
