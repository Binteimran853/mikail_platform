import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ setIsLoggedIn, setUsername, setUserRole }) => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'buyer', // Default role is "buyer" (only for registration)
  });

  // State for error messages
  const [errors, setErrors] = useState({
    username: '',
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

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (formData.password.length < 6 && !isLogin) {
      newErrors.password = 'Password must be at least 6 characters long.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the form
    if (validateForm()) {
      // Simulate login logic (e.g., API call)
      console.log('Logged in with:', formData);

      // Update login state and username
      setIsLoggedIn(true);
      setUsername(formData.username);
      navigate('/menu'); // Redirect to menu page
    }
  };

  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the form
    if (validateForm()) {
      // Simulate registration logic (e.g., API call)
      console.log('Registered with:', formData);

      // Update login state, username, and role
      setIsLoggedIn(true);
      setUsername(formData.username);
      setUserRole(formData.role);

      navigate('/menu'); // Redirect to menu page
    }
  };

  return (
    <div className="auth-page">
      {/* Title */}
      <h1>{isLogin ? 'Login' : 'Register'}</h1>

      {/* Toggle Between Login and Register */}
      <div className="auth-toggle">
        <button
          className={`toggle-button ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`toggle-button ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
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

        {/* Role Selection (Only for Registration) */}
        {!isLogin && (
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
        )}

        {/* Submit Button */}
        <button type="submit" className="auth-button">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;