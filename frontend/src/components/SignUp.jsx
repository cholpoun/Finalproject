import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage('Alla fält är obligatoriska.');
      return;
    }

    try {
      const response = await axios.post('/signup', { username, email, password });
      setMessage(response.data.message); // Visa meddelande från servern, t.ex. "Registrering lyckades!"
    } catch (error) {
      setMessage(error.response?.data?.error || 'Kunde inte registrera användaren.');
    }
  };

  return (
    <div>
      <h2>Registrera dig</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">Registrera</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;
