import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importera useNavigate för v6

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // useNavigate från v6

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Skicka data till API
      const response = await axios.post('https://finalproject-vol6.onrender.com/signup', { username, email, password });
      console.log(response.data); 
      alert('Signup successful!');
      navigate('/login');  // Omdirigera till inloggningssidan
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed!');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
