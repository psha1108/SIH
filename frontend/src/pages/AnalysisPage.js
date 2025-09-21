import React from 'react';
import StationAnalysis from '../components/analysis/StationAnalysis';
import CompartmentAnalysis from '../components/analysis/CompartmentAnalysis';
import './AnalysisPage.css';

const AnalysisPage = () => {
  return (
    <div className="analysis-page-container">
      <div className="analysis-header">
        <h2>Safety Analysis & Prediction</h2>
        <p>Make informed travel decisions with real-time data.</p>
      </div>
      <div className="analysis-content">
        <StationAnalysis />
        <CompartmentAnalysis />
      </div>
    </div>
  );
};

export default AnalysisPage;