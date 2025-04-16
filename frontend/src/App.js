import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import BuyerProfile from './components/BuyerProfile';
import SupplierProfile from './components/SupplierProfile';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'; // Import the LandingPage component
import SupplierNotifications from './components/SupplierNotifications';
import BuyerNotification from './components/BuyerNotification';
import './styles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState(''); // Track user role (buyer or supplier)
  const [userEmail, setUserEmail] = useState(''); // Track user role (buyer or supplier)
  const [userPassword, setUserPassword] = useState(''); // Track user role (buyer or supplier)

  return (
    <BrowserRouter>
      <div className="App">
        {/* Conditionally Render Navbar if Logged In */}
        {isLoggedIn && (
          <Navbar
            username={username}
            setIsLoggedIn={setIsLoggedIn}
            userRole={userRole} // Pass userRole to Navbar
          />
        )}

        <Routes>
          {/* Default Route (Landing Page) */}
          <Route path="/" element={<LandingPage />} />

          {/* Route for the Login Page */}
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setUserEmail={setUserEmail} setUserRole={setUserRole}/>}
          />

          {/* Route for the Registration Page */}
          <Route
            path="/register"
            element={
              <RegisterPage
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setUserRole={setUserRole} // Pass setUserRole to RegisterPage
                setUserEmail={setUserEmail}
                setUserPassword={setUserPassword}
              />
            }
          />

          {/* Route for the Menu Page */}
          <Route
            path="/menu"
            element={
              isLoggedIn ? (
                <MenuPage setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route for Buyer Profile */}
          <Route
            path="/buyer-profile"
            element={
              isLoggedIn && userRole === 'buyer' ? (
                <BuyerProfile  username={username} userRole={userRole} userEmail={userEmail} userPassword={userPassword}/>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route for Supplier Profile */}
          <Route
            path="/supplier-profile"
            element={
              isLoggedIn && userRole === 'supplier' ? (
                <SupplierProfile username={username} userEmail={userEmail} userPassword={userPassword} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/supplier-notification" element={<SupplierNotifications  userRole={userRole}  />} />
          <Route path="/Buyer-notification" element={<BuyerNotification userRole={userRole}  />} />

          {/* Redirect to Landing Page if no path matches */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;