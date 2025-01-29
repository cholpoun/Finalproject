import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // För navigering
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Skapa navigate hook

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginSuccess = (token, userId) => {
    // Spara token och userId i localStorage efter inloggning
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);

    // Navigera användaren till deras profil
    navigate(`/users/${userId}/profile`);
  };

  return (
    <>      
    <Navbar />
    <div>
      {isLogin ? <Login onLoginSuccess={handleLoginSuccess} /> : <Register />}
      <button onClick={toggleForm}>
        {isLogin ? 'Don\'t have an account? Register here' : 'Already have an account? Login here'}
      </button>
    </div>
    </>
  );
};

export default AuthPage;
