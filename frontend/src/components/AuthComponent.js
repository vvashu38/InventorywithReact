import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function AuthComponent() {
  const [message, setMessage] = useState("");
  const token = cookies.get("TOKEN"); // Get the token from cookies
  const baseURL = process.env.REACT_APP_BASE_URL; // Get base URL from environment variables

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = `${baseURL}/auth-endpoint`; // Construct the endpoint
      
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        const result = await response.json();
        if (response.ok) {
          setMessage(result.message);
        } else {
          setMessage(result.message || 'Failed to fetch message');
        }
      } catch (error) {
        setMessage('Error during fetching data');
        console.error(error);
      }
    };

    if (token) {
      fetchData();
    } else {
      setMessage("You need to log in to access this content.");
    }
  }, [baseURL, token]); // Dependency array includes baseURL and token

  return (
    <div>
      <h1 className="text-center">Auth Component</h1>
      <h3 className="text-center text-danger">{message}</h3>
    </div>
  );
}
