import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo = "/users/authenticate" }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to={redirectTo} replace />;
};

// Validera att children är en React-node
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
