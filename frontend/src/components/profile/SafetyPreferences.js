import React, { useState, useEffect } from 'react';
import './SafetyPreferences.css';

const SafetyPreferences = ({ initialPrefs }) => {
  const [prefs, setPrefs] = useState(initialPrefs);

  useEffect(() => {
    setPrefs(initialPrefs);
  }, [initialPrefs]);

  const handleToggle = async (prefName) => {
    const newPrefs = { ...prefs, [prefName]: !prefs[prefName] };
    setPrefs(newPrefs);

    // --- Ask for location permission if Location Sharing is turned on ---
    if (prefName === 'share_location' && newPrefs[prefName]) {
        navigator.geolocation.getCurrentPosition(
            () => { alert("Location access granted!"); },
            () => { alert("Location access denied."); }
        );
    }

    // --- Save the new preferences to the backend ---
    try {
      await fetch('http://127.0.0.1:5001/api/profile/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs),
      });
      // Optionally show a success message
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  if (!prefs) return <p>Loading preferences...</p>;

  return (
    <div className="prefs-list">
      <div className="pref-item">
        <div className="pref-text">
          <h4>Location Sharing</h4>
          <p>Share your live location with emergency contacts during travel.</p>
        </div>
        <label className="switch">
          <input type="checkbox" checked={!!prefs.share_location} onChange={() => handleToggle('share_location')} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="pref-item">
        <div className="pref-text">
          <h4>Guardian Alerts</h4>
          <p>Automatically notify contacts if a trip timer expires.</p>
        </div>
        <label className="switch">
          <input type="checkbox" checked={!!prefs.guardian_alerts} onChange={() => handleToggle('guardian_alerts')} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="pref-item">
        <div className="pref-text">
          <h4>Crowd Alerts</h4>
          <p>Get notified about unsafe or empty compartments nearby.</p>
        </div>
        <label className="switch">
          <input type="checkbox" checked={!!prefs.crowd_alerts} onChange={() => handleToggle('crowd_alerts')} />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default SafetyPreferences;