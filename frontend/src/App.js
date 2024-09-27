import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoutes from './components/ProtectedRoutes';
import Changerole from './components/Changerole';
import DeleteUser from './components/Deleteuser';
import Stock from './components/Stock';
import { AuthContext } from './components/AuthContext';

function App() {
  const { isLoggedIn, logout } = useContext(AuthContext); // Accessing the login state
  return (
    <Router>
      <div className="App">
        <nav className="bg-gray-800 shadow-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-white text-xl font-bold ">Stock inventory</h1> {/* Replace with your logo */}
              </div>
              <ul className="hidden items-center md:flex md:space-x-8 md:mt-0">
                <li>
                  <Link to="/" className="text-white margpy-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out" aria-current="page">Home</Link>
                </li>
                {!isLoggedIn && (
                  <li>
                    <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Login</Link>
                  </li>
                )}
                {isLoggedIn && (
                  <>
                    <li>
                      <Link to="/changerole" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Changerole</Link>
                    </li>
                    <li>
                      <Link to="/deleteuser" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Delete User</Link>
                    </li>
                    <li>
                      <Link to="/addstock" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Stock</Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="bg-blue-600 text-white py-2 px-4 size-auto rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>

     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/register" 
            element={
              <ProtectedRoutes requiredRole="admin"> 
                <Register />
              </ProtectedRoutes>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/changerole" 
            element={
              <ProtectedRoutes requiredRole="admin"> 
                <Changerole />
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/deleteuser" 
            element={
              <ProtectedRoutes requiredRole="admin"> 
                <DeleteUser />
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/addstock" 
            element={
              <ProtectedRoutes requiredRole="admin"> 
                <Stock />
              </ProtectedRoutes>
            } 
          />
        </Routes>
      
    </Router>
  );
}

export default App;
