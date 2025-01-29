import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
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
        setMessage('Ingen användare är inloggad.');
        navigate('/users/authenticate');
        return;
      }

      const profileId = userId || storedUserId;

      if (!profileId) {
        setMessage('Ogiltigt användar-ID.');
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
          setMessage('Ogiltig profildata.');
          localStorage.removeItem('token');
          navigate('/users/authenticate');
        }
      } catch (error) {
        console.error('Fel vid hämtning av profil:', error);

        if (error.response && error.response.status === 401) {
          setMessage('Token är ogiltig eller har löpt ut. Vänligen logga in igen.');
          localStorage.removeItem('token');
          navigate('/users/authenticate');
        } else {
          setMessage('Något gick fel vid hämtning av profilen. Försök igen senare.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate, userId]);

  if (message) {
    return <p>{message}</p>;
  }

  if (loading) {
    return <p>Laddar profil...</p>;
  }

  if (!user) {
    return <p>Ingen profil hittades.</p>;
  }

  return (
    <>
      <Navbar />
      <div>
        <h1>Välkommen, {user.username}!</h1>
        <p>E-post: {user.email}</p>
      </div>
    </>
  );
};

export default Profile;
