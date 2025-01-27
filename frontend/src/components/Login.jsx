import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked')

    if (!email || !password) {
      setMessage('Alla fält är obligatoriska.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      const { token } = response.data;
console.log(response.data);
      // Spara JWT-token i localStorage
      localStorage.setItem('token', token);

      // Visa ett meddelande och navigera användaren till /profile
      setMessage('Inloggning lyckades!');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'Inloggningen misslyckades.');
    }
  };

  return (
    <div>
      <h1>Logga In</h1>
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
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Logga In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
