import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Group = () => {
  const location = useLocation();
  const group = location.state?.group; // Access the passed group data
  const memberEmails = location.state?.emails;
  const groupID = group._id;
  const { userEmail } = useContext(AuthContext);
  
  
  return (
    <div>
      <h1>Group Details</h1>
      {group ? (
        <div>
          <p> Group Name: {group.name}</p>
          <p> Created By: {userEmail} </p>
          <p> Members: {memberEmails.join(', ')}</p>
        </div>
      ) : (
        <p>No group data available.</p>
      )}
    </div>
  );
};

export default Group;
