import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './LoginPage.css';

// 2. Accept a new prop to handle successful login
const LoginPage = ({ onLogin }) => { 
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate(); // 3. Initialize the navigate function

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhar, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('safarguardia_user', JSON.stringify(data.user));
        onLogin(data.user);
        // We no longer navigate from here. App.js will handle it.
      } else {
        setMessageType('error');
        setMessage(data.error || 'An unknown error occurred.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error. Is the backend server running?');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src="/logo.png" alt="SafarGuardia Logo" className="auth-logo" />
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your SafarGuardia account</p>

        <form onSubmit={handleLogin}>
          {/* ... form inputs remain the same ... */}
          <div className="input-group">
            <label htmlFor="aadhar">Aadhar Number</label>
            <input
              type="text"
              id="aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              placeholder="Enter 12-digit Aadhar number"
              maxLength="12"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-btn">Sign In Securely</button>
        </form>

        <p className="link-text">
          Don't have an account? <Link to="/signup" className="auth-link">Create Account</Link>
        </p>

        {message && <p className={`message ${messageType}`}>{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;