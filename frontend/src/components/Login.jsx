import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for v6

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setMessage('All fields are required.');
      return;
    }
  
    try {
      const response = await axios.post('https://finalproject-vol6.onrender.com/users/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);  // Save token in localStorage
      setToken(token);
      setMessage('Login successful!');
      navigate('/profile');  // Redirect to user profile page
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to log in.');
    }
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      {message && <p>{message}</p>}
      {token && <p>Your JWT token: {token}</p>}
    </div>
  );
};

export default Login;
