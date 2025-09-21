import React, { useState } from 'react';
import './SafetyCard.css';
import FakeCallScreen from './FakeCallScreen'; // Import the new screen

const FakeCall = () => {
  const [isCalling, setIsCalling] = useState(false);

  const handleActivateCall = () => {
    setIsCalling(true);
  };

  const handleEndCall = () => {
    setIsCalling(false);
  };

  return (
    <>
      <div className="safety-card">
        <h3>Fake Call</h3>
        <p>Simulate an incoming call to deter threats.</p>
        <button className="card-btn" onClick={handleActivateCall}>Activate</button>
      </div>
      {isCalling && <FakeCallScreen onEndCall={handleEndCall} />}
    </>
  );
};

export default FakeCall;