import React from 'react';
import './SafetyDashboardPage.css';
import SOSButton from '../components/common/SOSButton';
import FakeCall from '../components/safety/FakeCall';
import QuickContact from '../components/safety/QuickContact';
import SafeSpotsMap from '../components/safety/SafeSpotsMap'; // Import the new component

const SafetyDashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="sos-section">
        <SOSButton />
      </div>
      <div className="features-grid">
        <FakeCall />
        <QuickContact />
      </div>
      <div className="map-section">
        <SafeSpotsMap /> {/* Add the map component here */}
      </div>
    </div>
  );
};

export default SafetyDashboardPage;