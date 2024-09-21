import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get("TOKEN");
    const baseURL = process.env.REACT_APP_BASE_URL;
    const fetchData = async () => {
      const endpoint = `${baseURL}/auth-endpoint`; // Construct the endpoint
      
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        const result = await response.json();
        if (response.ok) {
          setMessage(result.message);
          setIsLoggedIn(true);
        } else {
          setMessage(result.message || 'Failed to fetch message');
        }
      } catch (error) {
        setMessage('Error during fetching data');
        console.error(error);
      }
    };

    if (token) {
      fetchData();
    } else {
      setMessage("You need to log in to access this content.");
    }

  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { email, password };
    const baseURL = process.env.REACT_APP_BASE_URL;

    try {
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        cookies.set("TOKEN", result.token, { path: "/" });
        navigate("/auth");
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Error during login: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoggedIn} // Disable input if logged in
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 ${isLoggedIn ? 'bg-gray-200' : ''}`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoggedIn} // Disable input if logged in
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 ${isLoggedIn ? 'bg-gray-200' : ''}`}
            />
          </div>
          {!isLoggedIn && (
            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Login
            </button>
          )}
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
    
  );
};

export default Login;
