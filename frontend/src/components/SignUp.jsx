import { useState } from "react";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Behåller error och visar det vid behov.

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registrering misslyckades");
      }

      const data = await response.json();
      console.log("Registrerad användare:", data);

      // Rensa fel om registreringen lyckas
      setError(null);
    } catch (err) {
      setError(err.message); // Sätt error med felmeddelandet
    }
  };

  return (
    <div>
      <h2>Registrera dig</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Användarnamn:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Lösenord:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Registrera</button>
      </form>
      {error && <p className="error">{error}</p>} {/* Visa felmeddelandet */}
    </div>
  );
};

export default SignUp;
