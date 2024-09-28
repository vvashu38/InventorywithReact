import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [first, setfirstName] = useState('');
  const [last, setlastName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType , setmessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setmessageType('');
    // Password validation check
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setmessageType('error');
      return; // Prevent form submission if validation fails
    }

    const formData = { email, password , name: {first, last}};
    const baseURL = process.env.REACT_APP_BASE_URL;

    console.log(baseURL);
    try {
      const response = await fetch(`${baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Registration successful!');
      } else {
        setMessage(result.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Error during registration');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">Register</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              id="fname"
              value={first}
              onChange={(e) => setfirstName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              id="name"
              value={last}
              onChange={(e) => setlastName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        {message && (<p className={`text-sm mt-4 text-center ${messageType === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
        {/* {message && <p className="mt-4 text-center text-green-600">{message}</p>} */}
      </div>
    </div>
  );
};

export default Register;
