import Signup from "../components/SignUp";
import Login from "../components/Login";

const AuthPage = () => {
  return (
    <div style={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      <Signup />
      <Login />
    </div>
  );
};

export default AuthPage;
