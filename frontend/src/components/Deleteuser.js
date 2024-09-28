import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all users when component loads
  useEffect(() => {
    const token = cookies.get("TOKEN");
    const baseURL = process.env.REACT_APP_BASE_URL;
    fetch(`${baseURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users); // Set users data if available
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Function to handle role change
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = cookies.get("TOKEN");
    const baseURL = process.env.REACT_APP_BASE_URL;
    fetch(`${baseURL}/deleteuser`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
      },
      body: JSON.stringify({
        email: selectedEmail
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message); // Show success or error message
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Delete User</h1>

      {/* Display message */}
      {message && (
        <p className="text-center text-green-500 mb-4">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Select User by Email:
          </label>
          <select
            id="email"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a user
            </option>
            {users.map((user) => (
              <option key={user._id} value={user.email}>
                {user.email} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Delete User
        </button>
      </form>
    </div>
  );
};

export default DeleteUser;