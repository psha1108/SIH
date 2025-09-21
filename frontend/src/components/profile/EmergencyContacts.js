import React, { useState, useEffect } from 'react';
import './EmergencyContacts.css';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // --- Fetch existing contacts from the backend ---
  const fetchContacts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []); // The empty array means this runs once on component load

  // --- Handle adding a new contact ---
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!name || !phoneNumber) return;

    try {
      const response = await fetch('http://127.0.0.1:5001/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber }),
      });
      const newContact = await response.json();
      if (response.ok) {
        setContacts([...contacts, newContact]); // Add new contact to the list
        setName('');
        setPhoneNumber('');
      }
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  // --- Handle deleting a contact ---
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/contacts/${contactId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== contactId)); // Remove from list
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  return (
    <div className="contacts-container">
      {/* List of existing contacts */}
      <ul className="contacts-list">
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <li key={contact.id} className="contact-item">
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-phone">{contact.phone_number}</span>
              </div>
              <button onClick={() => handleDeleteContact(contact.id)} className="delete-contact-btn">×</button>
            </li>
          ))
        ) : (
          <p>You haven't added any emergency contacts yet.</p>
        )}
      </ul>

      {/* Form to add a new contact */}
      <form onSubmit={handleAddContact} className="add-contact-form">
        <h4>Add New Contact</h4>
        <div className="form-inputs">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (e.g., Mom)"
            required
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="10-digit Phone Number"
            maxLength="10"
            required
          />
          <button type="submit" className="add-btn">+</button>
        </div>
      </form>
    </div>
  );
};

export default EmergencyContacts;