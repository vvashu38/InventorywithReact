import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import Cookies from 'universal-cookie'; 

const cookies = new Cookies();

const Profile = () => {
  const { isLoggedIn } = useContext(AuthContext); 
  const [user, setUser] = useState(null); // Initialize with null for clarity

  useEffect(() => {
    const token = cookies.get("TOKEN");
    const baseURL = process.env.REACT_APP_BASE_URL;

    fetch(`${baseURL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send JWT token in Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user); // Set user data if available
          console.log("Fetched User Data:", data.user); // Log the user data
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  return (
    <div className="p-4">
      { !isLoggedIn && (
        <h1>Please log in to view your profile.</h1>
      )}
      { user && ( // Conditionally render user details if available
        <>
        <div className="p-4">
          <h1 className="text-3xl font-bold underline text-center">Profile Details:</h1>
          <table className="min-w-full  -gray-300 mt-4">
            
            <tbody>
              {user.name && user.name.first && (
                <tr>
                  <td className=" px-4 py-2">First Name:</td>
                  <td className=" px-4 py-2">{user.name.first.toUpperCase()}</td>
                </tr>
              )}
              {user.name && user.name.last && (
                <tr>
                  <td className=" px-4 py-2">Last Name:</td>
                  <td className=" px-4 py-2">{user.name.last.toUpperCase()}</td>
                </tr>
              )}
              {user.email && (
                <tr>
                  <td className=" px-4 py-2">Email:</td>
                  <td className=" px-4 py-2">{user.email}</td>
                </tr>
              )}
              {user.role && (
                <tr>
                  <td className=" px-4 py-2">Role:</td>
                  <td className=" px-4 py-2">{user.role}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
};

export default Profile;
