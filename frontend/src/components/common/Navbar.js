import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => { setIsOpen(!isOpen); };


  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* 2. Change <a> to <Link> and href to to */}
        <Link to="/" className="nav-logo-link">
          <img src="/logo.png" alt="SafarGuardia Logo" className="nav-logo-img" />
          SafarGuardia
        </Link>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {isLoggedIn ? (
            <>
              {/* --- Links for LOGGED-IN users --- */}
              <Link to="/" className="nav-item">Home</Link>
              <Link to="/safety" className="nav-item">Safety</Link>
              <Link to="/feedback" className="nav-item">Feedback</Link>
              <Link to="/analysis" className="nav-item">Analysis</Link>
              <Link to="/profile" className="nav-item">Profile</Link>
              {/* The onLogout function is called when the button is clicked */}
              <button onClick={onLogout} className="nav-btn-logout">Logout</button>
            </>
          ) : (
            <>
              {/* --- Links for LOGGED-OUT users --- */}
              <Link to="/feedback" className="nav-item">View Feedback</Link>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/signup" className="nav-btn-signup">Sign Up</Link>
            </>
          )}
        </div>

        <div className="nav-toggler" onClick={toggleMenu}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;