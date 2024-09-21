import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import FreeComponent from './components/FreeComponent';
import AuthComponent from './components/AuthComponent';
import ProtectedRoutes from './components/ProtectedRoutes';
import Changerole from './components/Changerole';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="bg-white-800 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-black hover:text-blue-400">Home</Link>
            </li>
            <li>
              <Link to="/register" className="text-black hover:text-blue-400">Register</Link>
            </li>
            <li>
              <Link to="/login" className="text-black hover:text-blue-400">Login</Link>
            </li>
            <li>
              <Link to="/free" className="text-black hover:text-blue-400">Free-Login</Link>
            </li>
            <li>
              <Link to="/auth" className="text-black hover:text-blue-400">Auth-Login</Link>
            </li>
            <li>
              <Link to="/changerole" className="text-black hover:text-blue-400">Changerole</Link>
            </li>
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
          <Route 
            path="/changerole" 
            element={
              <ProtectedRoutes requiredRole="admin"> {/* Require admin role */}
                <Changerole />
              </ProtectedRoutes>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
