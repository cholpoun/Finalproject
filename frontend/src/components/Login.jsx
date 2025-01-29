import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    console.log('Submit button clicked');
  
    if (!email || !password) {
      setMessage('All fields are required.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      const { token } = response.data;
  
      // Save the JWT token in localStorage
      localStorage.setItem('token', token);
  
      // Display success message and navigate to profile
      setMessage('Login successful!');
      navigate('/users/profile');
    } catch (err) { // Rättade från 'error' till 'err'
      console.error('Error details:', err); // Log complete error object
  
      if (err.response) {
        if (err.response.status === 404) {
          setMessage('User not found. Please check your email and try again.');
        } else if (err.response.status === 401) {
          setMessage('Incorrect password. Please try again.');
        } else {
          setMessage('An error occurred. Please try again later.');
        }
      } else if (err.request) {
        // Axios request was made but no response was received
        setMessage('No response received from the server. Please check the server status.');
      } else {
        // Something else went wrong
        setMessage('An unknown error occurred. Please try again.');
      }
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
    </div>
  );
};

export default Login;
