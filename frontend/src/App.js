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
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3"> {/* Reduced padding here */}
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-2 md:p-0 mt-2 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-4 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"> {/* Reduced padding here */}
              <li>
                <Link to="/" className="block py-1 px-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</Link> {/* Reduced padding here */}
              </li>
              <li>
                <Link to="/register" className="block py-1 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</Link> {/* Reduced padding here */}
              </li>
              <li>
                <Link to="/login" className="block py-1 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Free-Login</Link> {/* Reduced padding here */}
              </li>
              <li>
                <Link to="/auth" className="block py-1 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Auth-Login</Link> {/* Reduced padding here */}
              </li>
              <li>
                <Link to="/changerole" className="block py-1 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Changerole</Link> {/* Reduced padding here */}
              </li>
            </ul>
          </div>
        </div>
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
