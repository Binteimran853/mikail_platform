import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = ({ username, setIsLoggedIn, userRole }) => {
  
  const navigate=useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout/', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      navigate('/login');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // alert("You have been logged out successfully.");
      username=''
      userRole=''
      setIsLoggedIn=false
     
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    }
  };
  
  return (
    <nav className="navbar">
      {/* Profile Section */}
      <div className="profile-section">
        <span className="profile-name">Welcome, {username}</span>
        {/* Dynamic Profile Link Based on Role */}
        {userRole === 'buyer' && (
          <Link to="/buyer-profile" className="profile-link">
            Buyer Profile
          </Link>
        )}
        {userRole === 'supplier' && (
          <Link to="/supplier-profile" className="profile-link">
            Supplier Profile
          </Link>
        )}
      </div>

      {/* Notification Center */}
    <div className="notification-center">
  <button className="notification-button" onClick={() => navigate('/supplier-notification')}>
    <span className="notification-icon">🔔</span>
    <span className="notification-count">3</span>
  </button>
</div>


      {/* Logout Button */}
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;