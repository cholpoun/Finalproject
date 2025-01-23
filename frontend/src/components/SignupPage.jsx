//Komponent för registrering av användare.

import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://finalproject-vol6.onrender.com/signup', { email, password });
      console.log(response.data); 
      alert('Signup successful!');
      history.push('/login'); // Redirect to login page
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
