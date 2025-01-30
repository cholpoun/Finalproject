// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../components/Navbar';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const { userId } = useParams();

//   useEffect(() => {
//     let isMounted = true;

//     const fetchUserProfile = async () => {
//       setLoading(true);

//       const token = localStorage.getItem('token');
//       const storedUserId = localStorage.getItem('userId');

//       if (!token) {
//         setMessage('Ingen användare är inloggad.');
//         navigate('/users/authenticate');
//         return;
//       }

//       const profileId = userId || storedUserId;

//       if (!profileId) {
//         setMessage('Ogiltigt användar-ID.');
//         navigate('/users/authenticate');
//         return;
//       }

//       try {
//         const response = await axios.get(`http://localhost:3000/users/${profileId}/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (isMounted && response.data && response.data.user) {
//           setUser(response.data.user);
//           setMessage('');
//         } else if (isMounted) {
//           setMessage('Ogiltig profildata.');
//           localStorage.removeItem('token');
//           navigate('/users/authenticate');
//         }
//       } catch (error) {
//         console.error('Fel vid hämtning av profil:', error);

//         if (error.response && error.response.status === 401) {
//           setMessage('Token är ogiltig eller har löpt ut. Vänligen logga in igen.');
//           localStorage.removeItem('token');
//           navigate('/users/authenticate');
//         } else {
//           setMessage('Något gick fel vid hämtning av profilen. Försök igen senare.');
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchUserProfile();

//     return () => {
//       isMounted = false;
//     };
//   }, [navigate, userId]);

//   if (message) {
//     return <p>{message}</p>;
//   }

//   if (loading) {
//     return <p>Laddar profil...</p>;
//   }

//   if (!user) {
//     return <p>Ingen profil hittades.</p>;
//   }

//   return (
//     <>
//       <Navbar />
//       <div>
//         <h1>Välkommen, {user.username}!</h1>
//         <p>E-post: {user.email}</p>
//       </div>
//     </>
//   );
// };

// export default Profile;


// NEW CODE 

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      setLoading(true);

      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');

      if (!token) {
        setMessage('No user is logged in.');
        navigate('/users/authenticate');
        return;
      }

      const profileId = userId || storedUserId;

      if (!profileId) {
        setMessage('Invalid user ID.');
        navigate('/users/authenticate');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/users/${profileId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted && response.data && response.data.user) {
          setUser(response.data.user);
          setMessage('');
        } else if (isMounted) {
          setMessage('Invalid profile data.');
          localStorage.removeItem('token');
          navigate('/users/authenticate');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);

        if (error.response && error.response.status === 401) {
          setMessage('Token is invalid or has expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/users/authenticate');
        } else {
          setMessage('Something went wrong while fetching the profile. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const fetchUserTickets = async () => {
      const token = localStorage.getItem('token');
      const profileId = userId || localStorage.getItem('userId');

      if (!profileId || !token) return;

      try {
        const response = await axios.get(`http://localhost:3000/users/${profileId}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted && response.data) {
          setTickets(response.data.tickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchUserProfile();
    fetchUserTickets();

    return () => {
      isMounted = false;
    };
  }, [navigate, userId]);

  if (message) {
    return <p>{message}</p>;
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>No profile found.</p>;
  }

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
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <strong>{ticket.eventName}</strong> - {ticket.date} ({ticket.seat})
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Profile;

