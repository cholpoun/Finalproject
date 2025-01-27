import { useState } from 'react';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>      
    <Navbar />
    <div>
      {isLogin ? <Login /> : <Register />}
      <button onClick={toggleForm}>
        {isLogin ? 'Don\'t have an account? Register here' : 'Already have an account? Login here'}
      </button>
    </div>
    </>
  );
};

export default AuthPage;
