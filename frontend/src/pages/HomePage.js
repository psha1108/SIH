import React from 'react';
import './HomePage.css'; // We will create this next

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Travel with Confidence, <br /> Arrive with Peace of Mind.
          </h1>
          <p className="hero-subtitle">
            Your personal safety companion for late-night travel on Mumbai's local trains. Real-time alerts, crowd analysis, and community support at your fingertips.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;