import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #008cba;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #034f69;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #008cba;
  }
`;

const Message = styled.p`
  color: #d9534f;
  font-size: 16px;
  margin-top: 20px;
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users/register", {
        username,
        email,
        password,
      });
      setMessage("Registration successful!");
      navigate("/users/authenticate");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to register user.");
    }
  };

  return (
    <RegisterContainer>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Register</Button>
      </form>
      {message && <Message>{message}</Message>}
    </RegisterContainer>
  );
};

export default Register;
