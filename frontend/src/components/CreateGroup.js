import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Group = () => {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users
  const [selectedEmails, setSelectedEmails] = useState([]); // State to store selected emails
  const [newEmails, setNewEmails] = useState([]); // State to store multiple new emails
  const [newEmail, setNewEmail] = useState(""); // State for individual new email input
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const navigate = useNavigate();
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
          setFilteredUsers(data.users); // Initialize filtered users
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Filter users based on the search term
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered); // Update filtered users
  }, [searchTerm, users]);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = cookies.get("TOKEN");
    const baseURL = process.env.REACT_APP_BASE_URL;
    
    // Combine selected emails and new email input
    const emailsToUpdate = [...new Set([...selectedEmails, ...newEmails])];
    fetch(`${baseURL}/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
      },
      body: JSON.stringify({
        groupName,
        emails: emailsToUpdate, // Send combined emails
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message); // Show success or error message
        navigate('/group', { state: { group: data.group , emails: emailsToUpdate} });
        // Clear inputs after submission
        setNewEmail(""); 
        setNewEmails([]); 
        setSelectedEmails([]); 
        setSearchTerm(""); // Clear search term
      })
      .catch((error) => {
        console.error("Error updating role:", error);
      });
  };

  // Function to handle selection of multiple users
  const handleSelectChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedEmails(selected); // Update selected emails
  };

  // Function to handle adding new email
  const handleAddEmail = () => {
    // Email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (newEmail && emailPattern.test(newEmail)) {
      // Proceed to add the email
      setNewEmails((prev) => [...prev, newEmail]);
      setNewEmail(""); // Clear the input field
    } else {
      // Optionally, set an error message or alert
      setMessage("Please enter a valid email address.");
    }
  };

  // Function to remove an email from the new emails list
  const handleRemoveEmail = (email) => {
    setNewEmails(newEmails.filter((e) => e !== email)); // Remove email from the array
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Create spliteee group!!!</h1>

      {/* Display message */}
      {message && (
        <p className="text-center text-green-500 mb-4">{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Splitwise Group Name:</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500`}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Users:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            placeholder="Search by email"
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-2">Select Users (Use command + click to select multiple users):</label>
          <select
            id="emails"
            multiple // Enable multiple selection
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleSelectChange} // Handle selection change
            required
          >
            {filteredUsers.map((user) => ( // Use filtered users for display
              <option key={user._id} value={user.email}>
                {user.email} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">Add users by their Emails:</label>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)} // Update new email input
              placeholder="Enter new email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Display added emails */}
        {newEmails.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Added Emails:</h3>
            <ul className="list-disc pl-5">
              {newEmails.map((email) => (
                <li key={email} className="flex justify-between items-center">
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create group
        </button>
      </form>
    </div>
  );
};

export default Group;
