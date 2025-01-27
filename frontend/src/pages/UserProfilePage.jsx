import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('Ingen token funnen. Du måste logga in först.');
        navigate('/users/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        setMessage('Misslyckades med att hämta profilen.');
        localStorage.removeItem('token'); // Rensar token vid fel
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (message) return <p>{message}</p>;

  return (
    <>      
    <Navbar />
    <div>
      {user ? (
        <>
          <h1>Välkommen, {user.username}!</h1>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Laddar profil...</p>
      )}
    </div>
    </>
  );
};

export default Profile;
