// src/components/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { login, logout } from './authActions';  // Importera login/logout logik

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId ? { token, userId } : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    login(userData);  // Hämta login funktion från authUtils
  };

  const handleLogout = () => {
    setUser(null);
    logout();  // Hämta logout funktion från authUtils
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
