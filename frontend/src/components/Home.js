import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext); 
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold underline text-center">Welcome to the Spliteee!</h1>
      { !isLoggedIn && (
        <>
        <div className="flex justify-center">
          <h1 className="text-blue-500 mt-4">Login to Our App!</h1>
          <Link to="/login">
            <button className="mt-2 px-4 py-2 bg-sky-500 text-white rounded">Login</button>
          </Link>
        </div>
        
        </>
      )
      }
      { isLoggedIn && (
        <>
        <Link to="/split">
        <div className="flex justify-center">
          <button className="mt-2 px-4 py-2 bg-sky-500 text-white rounded">Create your Spliteee</button>
        </div>
        </Link>
        </>
      )
      }
    </div>
  );
};

export default Home;
