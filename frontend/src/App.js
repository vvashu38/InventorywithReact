import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import FreeComponent from './components/FreeComponent';
import AuthComponent from './components/AuthComponent';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/free">Free-Login</Link></li>
            <li><Link to="/auth">Auth-Login</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/free" element={<FreeComponent />} />
          <Route 
            path="/auth" 
            element={
              <ProtectedRoutes>
                <AuthComponent />
              </ProtectedRoutes>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
