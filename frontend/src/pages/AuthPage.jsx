import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeroImage = styled.div`
  flex-grow: 1;
  background-image: url("/kevin-lanceplaine-Wke7rsY6JTE-unsplash.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin: 80px 8px 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 500px;
`;

const ToggleButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background: #de0f77;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #ff758c;
  }
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginSuccess = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    navigate(`/users/${userId}/profile`);
  };

  return (
    <PageContainer>
      <HeroImage>
        <FormContainer>
          {isLogin ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Register />
          )}
          <ToggleButton onClick={toggleForm}>
            {isLogin
              ? "Don't have an account? Register here!"
              : "Already have an account? Login here!"}
          </ToggleButton>
        </FormContainer>
      </HeroImage>
    </PageContainer>
  );
};

export default AuthPage;
