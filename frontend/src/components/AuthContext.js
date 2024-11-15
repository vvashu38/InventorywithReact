import React, { createContext, useState, useEffect, useMemo } from 'react';
import Cookies from "universal-cookie";
// import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  // Wrap cookies initialization in useMemo to prevent recreating on each render
  const cookies = useMemo(() => new Cookies(), []);
  
  // const navigate = useNavigate();
  useEffect(() => {
    const token = cookies.get('TOKEN');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        // const expirationTime = new Date(decodedToken.exp * 1000); // Convert to milliseconds
        // const currentTime = expirationTime.getTime() + 5000;

        if (decodedToken.exp < currentTime) {
          cookies.remove('TOKEN', { path: '/' });
          window.location.reload(true);
          setIsLoggedIn(false);
          setUserRole('');
          
          // navigate('/login');
        }else{
          setUserRole(decodedToken.role);
          setUserEmail(decodedToken.userEmail);
          setIsLoggedIn(true);
        }
        
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
