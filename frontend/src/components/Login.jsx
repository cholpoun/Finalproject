import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const LoginContainer = styled.div`
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

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      const { token, userId } = response.data;

      if (token && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        setMessage("Login successful!");
        navigate(`/profile/${userId}`);
      } else {
        setMessage("Incorrect login. Please check your username and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setMessage(
              "User not found. Please check your email and try again."
            );
            break;
          case 401:
            setMessage("Incorrect password. Please try again.");
            break;
          default:
            setMessage("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        setMessage(
          "No response from the server. Please check the server status."
        );
      } else {
        setMessage("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <LoginContainer>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby="emailHelp"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="passwordHelp"
          />
        </div>
        <Button type="submit" aria-label="Login to your account">
          Login
        </Button>
      </form>
      {message && <Message aria-live="polite">{message}</Message>}
    </LoginContainer>
  );
};

export default Login;
