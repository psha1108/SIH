import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Shared CSS

const SignupPage = () => {
  // Use a single state object for the form data
  const [formData, setFormData] = useState({
    fullName: '',
    aadhar: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    // --- Frontend Validation ---
    if (formData.password !== formData.confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setMessageType('error');
      setMessage('You must agree to the Terms & Conditions.');
      return;
    }

    // --- Send Data to Backend API ---
    try {
      const response = await fetch('http://127.0.0.1:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Get the JSON response from the server

      if (response.ok) {
        setMessageType('success');
        setMessage(data.message + ' You will be redirected shortly.');
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        // Display error message from the backend
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
        <h2>Join SafarGuardia</h2>
        <p className="subtitle">Create your account for safer train journeys</p>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text" id="fullName" value={formData.fullName}
              onChange={handleChange} placeholder="Enter your full name" required
            />
          </div>
          <div className="input-group">
            <label htmlFor="aadhar">Aadhar Number</label>
            <input
              type="text" id="aadhar" value={formData.aadhar}
              onChange={handleChange} placeholder="Enter 12-digit Aadhar number"
              maxLength="12" required
            />
          </div>
          <div className="input-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text" id="phoneNumber" value={formData.phoneNumber}
              onChange={handleChange} placeholder="Enter 10-digit phone number"
              maxLength="10" required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password" id="password" value={formData.password}
              onChange={handleChange} placeholder="Create a secure password" required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password" id="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} placeholder="Confirm your password" required
            />
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox" id="agreeTerms" checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)} required
            />
            <label htmlFor="agreeTerms">I agree to the Terms & Conditions</label>
          </div>
          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        <p className="link-text">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </p>

        {message && <p className={`message ${messageType}`}>{message}</p>}
      </div>
    </div>
  );
};

export default SignupPage;