import React, { useEffect, useState } from "react";

export default function FreeComponent() {
  const [message, setMessage] = useState("");
  const baseURL = process.env.REACT_APP_BASE_URL; // Get base URL from environment variables

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = `${baseURL}/free-endpoint`; // Use baseURL for the endpoint
      
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
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

    fetchData();
  }, [baseURL]); // Dependency array includes baseURL

  return (
    <div>
      <h1 className="text-center">Free Component</h1>
      <h3 className="text-center text-danger">{message}</h3>
    </div>
  );
}
