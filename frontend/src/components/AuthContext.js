import React, { createContext, useState, useEffect, useMemo } from 'react';
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  // Wrap cookies initialization in useMemo to prevent recreating on each render
  const cookies = useMemo(() => new Cookies(), []);

  useEffect(() => {
    const token = cookies.get('TOKEN');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setUserEmail(decodedToken.userEmail);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error decoding token', error);
        setIsLoggedIn(false);
        setUserRole('');
      }
    }
  }, [cookies]);  // cookies is now constant and won't change on every render

  const login = (token) => {
    cookies.set('TOKEN', token, { path: '/' });
    const decodedToken = jwtDecode(token);
    setUserRole(decodedToken.role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    cookies.remove('TOKEN', { path: '/' });
    window.location.reload(true);
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
