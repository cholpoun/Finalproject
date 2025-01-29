// src/components/authContext.js
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // PropTypes för att validera props

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validering för children prop
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Exportera useAuth för att använda contexten i andra komponenter
export const useAuth = () => useContext(AuthContext);
