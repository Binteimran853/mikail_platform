import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const Navbar = () => {
  const {
    isLoggedIn, setIsLoggedIn,
    username, setUsername,
    userRole, setUserRole,
    userEmail, setUserEmail
  } = useUser();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout/', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUsername('');
      setUserRole('');
      setUserEmail('');
      setIsLoggedIn(false);
      alert("You have been logged out successfully.");
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    }
  };

  return (
    <nav className="navbar">
      {/* Profile Section */}
      <div className="profile-section">
        <span className="profile-name">Welcome, {username}</span>
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
        <button
          className="notification-button"
          onClick={() => {
            if (userRole === 'buyer') {
              navigate('/buyer-notification');
            } else if (userRole === 'supplier') {
              navigate('/supplier-notification');
            }
          }}
        >
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
