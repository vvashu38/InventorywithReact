import React from 'react';
import { Link } from 'react-router-dom';
import '../css/output.css'; // Adjust the path as needed

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold underline">Welcome to Our App!</h1>
      <Link to="/register">
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Register</button>
      </Link>
      <h1 className="text-blue-500 mt-4">Login to Our App!</h1>
      <Link to="/login">
        <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Login</button>
      </Link>
    </div>
  );
};

export default Home;
