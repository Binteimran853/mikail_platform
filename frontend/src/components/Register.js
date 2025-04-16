import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the data being sent to the backend
    const data = { username, password, role };
    console.log('Sending data:', data);  // This will log the data to the console
    
    try {
      // Send the POST request
      const response = await axios.post('http://localhost:8000/api/register/', data);
      
      // Show the success message from the response
      setMessage(response.data.message);  
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Registration error:', error.response || error);
      
      // Show an error message to the user
      setMessage('Error during registration'); // Display a generic error message
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
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

        <div className="input-group">
          <label>Role:</label>
          <select onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
