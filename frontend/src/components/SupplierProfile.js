import React from 'react';

import { useUser } from '../Context/UserContext';
const SupplierProfile = () => {
    const {
     
      username,
      
      userEmail,userPassword
    
    } = useUser();
    
  return (
    <div className="profile-page">
      <h2>Supplier Profile: {username}</h2>
      <p>Email: {userEmail}</p>
      <p>Email: {userEmail}</p>
      <p>Email: {userPassword}</p>
      
    </div>
  );
};

export default SupplierProfile;
