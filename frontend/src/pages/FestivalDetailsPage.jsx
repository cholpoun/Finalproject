import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import FestivalDetails from "../components/FestivalDetails.jsx";
import TicketPurchase from "../components/TicketPurchase.jsx";

const FestivalDetailsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 32px 16px;
  padding-top: 60px;

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

  .festival-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .festival-info,
  .ticket-purchase {
    flex: 1;
    min-width: 300px;
  }
`;

const FestivalDetailsPage = () => {
  const { id: festivalId } = useParams();
  const token = localStorage.getItem("token");

  return (
    <>
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
    </>
  );
};

export default FestivalDetailsPage;
