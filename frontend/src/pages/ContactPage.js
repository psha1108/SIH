import React, { useState } from 'react'; // 1. Import useState
import './StaticPage.css';
import '../components/feedback/FeedbackForm.css';

const ContactPage = () => {
  // 2. Add state for each form field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // 3. Make the submit function async to handle the API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        alert('Thank you for your message! It has been received.');
        // Clear the form fields
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert('Error: Could not send message. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('A network error occurred. Please check your connection.');
    }
  };

  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1>Contact Us</h1>
        <p>
          Have a question, suggestion, or a partnership inquiry? We'd love to hear from you. Reach out to us via the form below or through our contact details.
        </p>
        <div className="form-container" style={{boxShadow: 'none', padding: '20px 0'}}>
          {/* 4. Connect form inputs to the state */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows="5" placeholder="Your message..." required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;