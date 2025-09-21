import React, { useState } from 'react';
import './CompartmentAnalysis.css';

const CompartmentAnalysis = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = () => {
    setIsLoading(true);
    setResult(null);

    // Simulate an API call to the second ML model
    setTimeout(() => {
      setResult({
        peopleCount: 3,
        density: 'Under-Crowded',
        recommendation: 'Alert sent to RPF. A constable will patrol the coach shortly.',
        status: 'unsafe'
      });
      setIsLoading(false);
    }, 2000); // 2-second delay to simulate processing
  };

  return (
    <div className="analysis-card">
      <h3>Compartment Crowd Analysis</h3>
      <p>Upload a photo of your compartment to check crowd density and request assistance if needed.</p>
      <button className="upload-btn" onClick={handleImageUpload} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Upload Compartment Photo'}
      </button>

      {result && (
        <div className={`result-box result-${result.status}`}>
          <h4>Analysis Complete</h4>
          <p><strong>People Detected:</strong> {result.peopleCount}</p>
          <p><strong>Density Level:</strong> {result.density}</p>
          <p className="recommendation">{result.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default CompartmentAnalysis;