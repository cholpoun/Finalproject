import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kontrollera om användaren fyllt i alla fält
    if (!email || !password) {
      setMessage('Alla fält är obligatoriska.');
      return;
    }

    try {
      const response = await axios.post('https://finalproject-jan30.onrender.com/users/login', { email, password });

      // Logga hela svaret för att se vad som returneras från servern
      console.log(response.data);

      const { token, userId } = response.data;

      // Kontrollera att token och userId finns i svaret
      if (token && userId) {
        // Sätt token och userId i localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Visa meddelande om inloggning lyckades
        setMessage('Inloggning lyckades!');

        // Navigera till profil sidan med användarens ID
        navigate(`/profile/${userId}`);
      } else {
        setMessage('Felaktig inloggning. Kontrollera användarnamn och lösenord.');
      }
    } catch (error) {
      // Hantera fel från servern
      console.error("Inloggningsfel:", error);
      if (error.response) {
        // Mer specifik felhantering
        switch (error.response.status) {
          case 404:
            setMessage('Användaren hittades inte. Kontrollera din e-post och försök igen.');
            break;
          case 401:
            setMessage('Felaktigt lösenord. Försök igen.');
            break;
          default:
            setMessage('Ett fel inträffade. Försök igen senare.');
        }
      } else if (error.request) {
        setMessage('Inget svar mottaget från servern. Kontrollera serverstatusen.');
      } else {
        setMessage('Ett okänt fel inträffade. Försök igen.');
      }
    }
  };

  return (
    <div>
      <h1>Logga in</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-post"
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
        <button type="submit">Logga in</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
