import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import QRCode from "react-qr-code";
import FavoriteList from "../components/FavoriteList";

const ProfileContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 80px auto 40px auto;
  background: linear-gradient(135deg, #d85a94 0%, #145a7a 100%);
  border-radius: 12px;
  padding: 40px 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #f4f4f4;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SectionContainer = styled.div`
  flex: 1 1 100%;
  padding: 20px;
  background: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex: 1 1 48%;
  }

  @media (min-width: 1024px) {
    flex: 1 1 30%;
  }
`;

const TicketsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const TicketCard = styled.div`
  background: #fff;
  color: #333;
  padding: 10px;
  border-radius: 8px;
  border: 0.5px solid #004aad;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding-bottom: 20px;
`;

const QRCodeContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 8px;
  display: inline-block;
`;

const SignOutButton = styled.button`
  margin-bottom: 20px;
  padding: 12px 18px;
  background: #004aad;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  &:hover {
    background: #002f6c;
  }
  &:focus {
    outline: 3px solid #ffcc00;
  }
`;

const Message = styled.span`
  margin-top: 100px;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  font-size: 20px;
  color: #333;
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("No user is logged in.");
        navigate("/users/authenticate");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/users/me/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (isMounted && response.data) {
          setUser(response.data);
          setMessage("");
        } else if (isMounted) {
          setMessage("Invalid profile data.");
          localStorage.removeItem("token");
          navigate("/users/authenticate");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage(
          <Message>
            It seems like you need to log in again due to session expiration.
            Please <Link to="/users/authenticate">log in again</Link> to
            continue.
          </Message>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/users/authenticate");
  };

  if (message) return <p>{message}</p>;
  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No profile found.</p>;

  return (
    <ProfileContainer>
      <InfoContainer>
        <SectionContainer>
          <h1>
            Welcome,{" "}
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!
          </h1>
          <p>
            Here you&apos;ll find lists of your
            <a href="#favorite-festivals"> favorite festivals</a> and
            <a href="#your-tickets"> tickets</a>.
          </p>
        </SectionContainer>
        <SectionContainer>
          <h2>Your Info</h2>
          <p>
            <strong>Username:</strong> {user.username}
            <br />
            <strong>Email:</strong> {user.email}
          </p>
          <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
        </SectionContainer>
      </InfoContainer>

      <SectionContainer id="favorite-festivals">
        <h2>Your Favorite Festivals</h2>
        <FavoriteList />
      </SectionContainer>

      <SectionContainer id="your-tickets">
        <h2>Your Tickets</h2>
        {user.purchasedTickets.length === 0 ? (
          <p>You have not purchased any tickets yet.</p>
        ) : (
          <TicketsGrid>
            {user.purchasedTickets.map((ticket, index) => (
              <TicketCard key={index}>
                <h3>{ticket.festivalName}</h3>
                <p>
                  <strong>Quantity:</strong> {ticket.quantity}
                </p>
                <p>
                  <strong>Total Price:</strong> {ticket.totalPrice} SEK
                </p>
                <QRCodeContainer>
                  <QRCode
                    value={`${ticket.festivalName} ${ticket.quantity}`}
                    size={100}
                  />
                </QRCodeContainer>
              </TicketCard>
            ))}
          </TicketsGrid>
        )}
      </SectionContainer>
    </ProfileContainer>
  );
};

export default Profile;
