import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = ({ setIsLoggedIn, setUsername, setUserRole, setUserEmail, setUserPassword }) => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer', // Default role is "buyer"
  });

  // State for error messages
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the form
    if (validateForm()) {

      // Simulate registration logic (e.g., API call)
      try {
        const response = await axios.post('http://localhost:8000/api/register/', formData,

        )
        // Update login state, username, and role
        setIsLoggedIn(true);
        setUsername(formData.username);
        setUserRole(formData.role); // Pass the selected role to the parent component
        setUserEmail(formData.email)
        setUserPassword(formData.password)

      }
      catch (error) {
        console.log(error)
      }
      // Redirect to the menu page
      navigate('/login');
    }
  };

  return (
    <div className="registration-container">
      {/* Title */}
      <h2 className="registration-title">Registration Page</h2>

      {/* Registration Form Container */}
      <div className="register-page">
        {/* Add the title above the form, aligned to the left */}
        <h3 className="form-title">Create Your Account</h3>

        <form onSubmit={handleRegister}>
          {/* Username Field */}
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              aria-label="Username"
              required
              style={{
                borderColor: errors.username ? 'red' : '#ccc',
              }}
            />
            {errors.username && <p className="error-message">{errors.username}</p>}
          </div>
          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your emaile"
              value={formData.email}
              onChange={handleInputChange}
              aria-label="Email"
              required
              style={{
                borderColor: errors.email ? 'red' : '#ccc',
              }}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              aria-label="Password"
              required
              style={{
                borderColor: errors.password ? 'red' : '#ccc',
              }}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          {/* Role Selection */}
          <div className="input-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          {/* Register Button */}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        {/* Back to Login Link */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link to="/login" className="back-to-login-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;