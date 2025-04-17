import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPassword, setUserPassword] = useState(''); // if needed

  return (
    <UserContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      username, setUsername,
      userEmail, setUserEmail,
      userRole, setUserRole,
      userPassword, setUserPassword
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
