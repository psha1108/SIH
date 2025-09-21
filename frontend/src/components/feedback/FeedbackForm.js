import React, { useState } from 'react';
import './FeedbackForm.css';

// The component now accepts a function to refresh the feedback list
const FeedbackForm = ({ onFeedbackSubmit }) => {
  const [station, setStation] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!station || !feedback) return;

    try {
      const response = await fetch('http://127.0.0.1:5001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station: station, content: feedback }),
      });

      if (response.ok) {
        const newPost = await response.json(); // Get the new post from the response
        alert('Feedback submitted!');
        setStation('');
        setFeedback('');
        onFeedbackSubmit(newPost); // Pass the new post data up to the parent
    }  else {
        alert('Failed to submit feedback.');
      }
    } catch (error) {
      alert('Error submitting feedback.');
    }
  };

  // The rest of the JSX form remains the same
  return (
    <div className="form-container">
        <h3>Share Your Experience</h3>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="station">Station Name</label>
                <input
                    type="text" id="station" value={station}
                    onChange={(e) => setStation(e.target.value)}
                    placeholder="e.g., Dadar, Thane" required
                />
            </div>
            <div className="form-group">
                <label htmlFor="feedback">Your Feedback</label>
                <textarea
                    id="feedback" value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="4" placeholder="Describe your experience..." required
                ></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit Feedback</button>
        </form>
    </div>
  );
};

export default FeedbackForm;