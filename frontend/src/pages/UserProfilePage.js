import React, { useState, useEffect } from 'react';
import './UserProfilePage.css';
import EmergencyContacts from '../components/profile/EmergencyContacts';
import PersonalInfo from '../components/profile/PersonalInfo';
import SafetyPreferences from '../components/profile/SafetyPreferences';

const UserProfilePage = ({ currentUser, onLogout }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => { /* ... */ };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>Hello, {profileData?.full_name || 'User'}!</h1>
        <p>Manage your account settings and safety preferences.</p>
      </div>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <PersonalInfo user={profileData} />
        </div>
        <div className="profile-section">
          <h2>Emergency Contacts</h2>
          <EmergencyContacts />
        </div>
        <div className="profile-section">
          <h2>Safety Preferences</h2>
          <SafetyPreferences initialPrefs={profileData} />
        </div>
        <button onClick={onLogout} className="logout-btn">
      Log Out
    </button>
      </div>
    </div>
  );
};

export default UserProfilePage;