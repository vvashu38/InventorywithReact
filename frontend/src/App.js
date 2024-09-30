import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Changerole from './components/Changerole';
import DeleteUser from './components/Deleteuser';
import Profile from './components/Profile';
import { AuthContext } from './components/AuthContext';
import CreateGroup from './components/CreateGroup';
import Group from './components/Group';
import Groups from './components/Groups';

function App() {
  const { isLoggedIn, logout, userRole } = useContext(AuthContext); // Accessing the login state
  return (
    <Router>
      <div className="App">
        <nav className="bg-gray-800 shadow-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-white text-xl font-bold ">Spliteee</h1> {/* Replace with your logo */}
              </div>
              <ul className="hidden items-center md:flex md:space-x-8 md:mt-0">
                <li>
                  <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out" aria-current="page">Home</Link>
                </li>
                {!isLoggedIn && (
                  <>
                  <li>
                  <Link to="/register" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Register</Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Login</Link>
                  </li>
                </>
                  
                )}
                {isLoggedIn &&
                <>
                <li>
                <Link to="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Profile</Link>
                </li>
                <li>
                <Link to="/groups" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Spliteees</Link>
                </li>
                </>
                }
                {isLoggedIn && userRole === "admin" && (
                  <>
                    <li>
                      <Link to="/changerole" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Changerole</Link>
                    </li>
                    <li>
                      <Link to="/deleteuser" className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 px-4 rounded transition duration-300 ease-in-out">Delete User</Link>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <li>
                      <button onClick={logout} className="bg-blue-600 text-white py-2 px-4 size-auto rounded-full hover:bg-blue-700 transition duration-300 ease-in-out">
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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/changerole" element={<Changerole />}/>
          <Route path="/deleteuser" element={<DeleteUser />}/>
          <Route path="/creategroup" element={<CreateGroup />}/>
          <Route path="/group" element={<Group />}/>
          <Route path="/groups" element={<Groups />}/>

        </Routes>
      
    </Router>
  );
}

export default App;
