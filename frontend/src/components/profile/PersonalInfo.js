import React, { useState, useEffect } from 'react';
import './PersonalInfo.css';

const PersonalInfo = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: ''
  });

  // When the user prop updates, populate the form data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        phone_number: user.phone_number
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5001/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        // Optionally, you could refetch the user data here to be perfectly in sync
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      alert('Error updating profile.');
    }
  };

  if (!user) {
    return <p>Loading information...</p>;
  }

  return (
    <div>
      {isEditing ? (
        // --- EDITING VIEW ---
        <form onSubmit={handleSave} className="info-grid">
          <div className="info-item">
            <label>Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
          </div>
          <div className="info-item">
            <label>Phone Number</label>
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </div>
          <div className="info-item full-width">
            <label>Aadhar Number</label>
            <span className="uneditable">{'**** **** ' + user.aadhar_number?.slice(-4)}</span>
          </div>
          <div className="edit-buttons">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
          </div>
        </form>
      ) : (
        // --- DISPLAY VIEW ---
        <div className="info-grid">
          <div className="info-item">
            <label>Full Name</label>
            <span>{formData.full_name}</span>
          </div>
          <div className="info-item">
            <label>Phone Number</label>
            <span>{formData.phone_number}</span>
          </div>
          <div className="info-item full-width">
            <label>Aadhar Number</label>
            <span className="uneditable">{'**** **** ' + user.aadhar_number?.slice(-4)}</span>
          </div>
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;