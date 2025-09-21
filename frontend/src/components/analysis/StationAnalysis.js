import React from 'react';
import './StationAnalysis.css';

// Mock data simulating the output of your first ML model
const mockStationData = [
  { name: 'CSMT', crowd: 'Low', safetyIndex: 9.2, safety: 'Safe' },
  { name: 'Masjid', crowd: 'Low', safetyIndex: 8.5, safety: 'Safe' },
  { name: 'Byculla', crowd: 'Medium', safetyIndex: 7.1, safety: 'Moderate' },
  { name: 'Dadar', crowd: 'High', safetyIndex: 6.5, safety: 'Moderate' },
  { name: 'Kurla', crowd: 'High', safetyIndex: 4.8, safety: 'Use Caution' },
  { name: 'Ghatkopar', crowd: 'Medium', safetyIndex: 6.9, safety: 'Moderate' },
  { name: 'Thane', crowd: 'Low', safetyIndex: 8.8, safety: 'Safe' },
];

const StationAnalysis = () => {
  // In a real app, form inputs would trigger an API call.
  // For the demo, we'll just display the mock data directly.
  return (
    <div className="analysis-card">
      <h3>Station Crowd & Safety Index</h3>
      <p>Predicted safety levels for stations on the Central Line (towards Thane) after 10 PM.</p>
      <ul className="station-list">
        {mockStationData.map(station => (
          <li key={station.name} className={`station-item safety-${station.safety.toLowerCase().replace(' ', '-')}`}>
            <span className="station-name">{station.name}</span>
            <span className="station-crowd">Crowd: {station.crowd}</span>
            <span className="station-safety">Safety Index: {station.safetyIndex}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StationAnalysis;