import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Alla fält är obligatoriska.');
      return;
    }

    try {
      const response = await axios.post('/login', { email, password });
      setToken(response.data.token);
      setMessage('Inloggning lyckades!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Kunde inte logga in användaren.');
    }
  };

  return (
    <div>
      <h2>Logga in</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Logga in</button>
      </form>
      {message && <p>{message}</p>}
      {token && <p>Din JWT-token: {token}</p>}
    </div>
  );
};

export default Login;
