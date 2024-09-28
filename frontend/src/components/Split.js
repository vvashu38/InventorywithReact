import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Split = () => {
  const { isLoggedIn } = useContext(AuthContext); 
  return (
    <>
    <h1>Hello</h1></>
  );
};

export default Split;
