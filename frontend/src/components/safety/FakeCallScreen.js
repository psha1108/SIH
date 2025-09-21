import React, { useState, useEffect } from 'react';
import './FakeCallScreen.css'; // We'll create this CSS next

const FakeCallScreen = ({ onEndCall }) => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Start a timer for the call duration
    const timer = setInterval(() => {
      setCallDuration(prevDuration => prevDuration + 1);
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Format the call duration into MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  return (
    <div className="fake-call-overlay">
      <div className="call-container">
        <div className="call-info">
          <p className="call-status">INCOMING CALL</p>
          <h1 className="caller-name">Mom</h1> {/* You can customize this */}
          <p className="call-duration">{formatTime(callDuration)}</p>
        </div>
        <button className="end-call-btn" onClick={onEndCall}>
          <span className="end-call-icon">📞</span>
          <p>End Call</p>
        </button>
      </div>
    </div>
  );
};

export default FakeCallScreen;