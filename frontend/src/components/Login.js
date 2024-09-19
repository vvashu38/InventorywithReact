import React, { useState } from 'react';
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom'; // Make sure this is imported

const cookies = new Cookies();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

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
        cookies.set("TOKEN", result.token, {
          path: "/",
        });
        navigate("/auth"); // Use navigate instead of window.location
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Error during login: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
