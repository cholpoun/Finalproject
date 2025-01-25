import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Behåller error och visar det vid behov.

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Inloggning misslyckades");
      }

      const data = await response.json();
      console.log("Inloggad användare:", data);

      // Rensa fel om inloggningen lyckas
      setError(null);
    } catch (err) {
      setError(err.message); // Sätt error med felmeddelandet
    }
  };

  return (
    <div>
      <h2>Logga in</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Logga in</button>
      </form>
      {error && <p className="error">{error}</p>} {/* Visa felmeddelandet */}
    </div>
  );
};

export default Login;
