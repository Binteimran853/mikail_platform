import React from 'react';


const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Top Image Row */}
      <div className="image-row">
        <img src="/images/gallery1.png" alt="Gallery 1" />
        <img src="/images/gallery2.png" alt="Gallery 2" />
        <img src="/images/gallery4.png" alt="Gallery 4" />
      </div>

      {/* Center Text and Buttons */}
      <div className="center-section">
        <h1>Welcome to Your Very Own Platform 'Mikail'</h1>
        <p>Please log in or register to continue.</p>
        <div className="auth-buttons">
          <a href="/login" className="button login-button">Login</a>
          <a href="/register" className="button register-button">Register</a>
        </div>
      </div>

      {/* Bottom Image Row */}
      <div className="image-row">
        <img src="/images/gallery4.png" alt="Gallery 4" />
        <img src="/images/gallery5.png" alt="Gallery 5" />
        <img src="/images/gallery6.png" alt="Gallery 6" />
      </div>
    </div>
  );
};

export default LandingPage;
