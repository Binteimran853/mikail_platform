import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Hook for programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });

      // If login is successful, set logged-in state to true and redirect to menu page
      if (response.status === 200) {
        setIsLoggedIn(true);  // Set login state to true after successful login
        setMessage('Login successful');
        
        // Redirect to the Menu page
        navigate('/menu');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      setMessage('Error occurred during login');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="nav-button">Login</button>
      </form>

      {message && (
        <p className={message === 'Login successful' ? 'message success' : 'message error'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
