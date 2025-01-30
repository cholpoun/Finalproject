
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getUserTickets } from "../api/ticketApi";

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
        const response = await axios.get(`http://localhost:3000/users/me/profile`, {
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

  // ✅ Logout function
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to login page
    navigate("/users/authenticate");
  };

  if (message) return <p>{message}</p>;
  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No profile found.</p>;

  return (
    <>
      <Navbar />
      <div>
        <h1>Welcome, {user.username}!</h1>
        <p>Email: {user.email}</p>

        <h2>Your Tickets</h2>
        {tickets.length === 0 ? (
          <p>You have not purchased any tickets yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="p-4 border rounded-lg shadow-lg bg-white">
                <h3 className="text-lg font-semibold">{ticket.name}</h3>
                <p><strong>Quantity:</strong> {ticket.quantity}</p>
                <p><strong>Total Price:</strong> ${ticket.totalPrice}</p>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;

