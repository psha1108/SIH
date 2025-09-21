import React from 'react';
import './SOSButton.css';

const SOSButton = () => {
  const handleSOSClick = () => {
    // In a real app, this would trigger an alert.
    // For the demo, we'll just show a browser alert.
    alert('SOS Alert Sent! Your emergency contacts and nearest police have been notified.');
  };

  return (
    <button className="sos-button" onClick={handleSOSClick}>
      <div className="sos-text">SOS</div>
      <div className="sos-subtext">IMMEDIATE HELP</div>
    </button>
  );
};

export default SOSButton;