import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getUserTickets } from "../api/ticketApi";
import styled from "styled-components";
import QRCode from "react-qr-code";

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  background: linear-gradient(135deg, #d85a94 0%, #145a7a 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #f4f4f4;
  font-family: "Quicksand", sans-serif;
`;

const TicketCard = styled.div`
  background: #fff;
  color: #333;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  text-align: center;
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
  padding: 10px 15px;
  background: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  &:hover {
    background: linear-gradient(135deg, #ff5c8a 0%, #ff3d6e 100%);
  }
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
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
        const response = await axios.get("http://localhost:3000/users/me/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted && response.data) {
          setUser(response.data.user || response.data);
          setMessage("");
        } else if (isMounted) {
          setMessage("Invalid profile data.");
          localStorage.removeItem("token");
          navigate("/users/authenticate");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Something went wrong while fetching the profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await getUserTickets(token);
        if (isMounted) setTickets(data.tickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchUserProfile();
    fetchUserTickets();

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
    <>
      <Navbar />
      <ProfileContainer>
        <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
        <h1>Welcome, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!</h1>
        <p><strong>Email:</strong> {user.email}</p>

        <h2>Your Tickets</h2>
        {tickets.length === 0 ? (
          <p>You have not purchased any tickets yet.</p>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket._id}>
              <h3>{ticket.name}</h3>
              <p><strong>Quantity:</strong> {ticket.quantity}</p>
              <p><strong>Total Price:</strong> ${ticket.totalPrice}</p>
              <QRCodeContainer>
                <QRCode value={ticket._id ? String(ticket._id) : 'invalid-ticket'} size={100} />
              </QRCodeContainer>
            </TicketCard>
          ))
        )}
      </ProfileContainer>
    </>
  );
};

export default Profile;
