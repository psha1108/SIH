import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeedbackCard from '../components/feedback/FeedbackCard';
import FeedbackForm from '../components/feedback/FeedbackForm';
import './FeedbackPage.css';

const FeedbackPage = ({ currentUser }) => {
  const [feedbackList, setFeedbackList] = useState([]);

  // Function to add a newly submitted post to the top of the list
  const handleNewFeedback = (newPost) => {
    setFeedbackList([newPost, ...feedbackList]);
  };

  // Function to remove a deleted post from the list
  const handlePostDelete = (deletedPostId) => {
    setFeedbackList(currentList => 
      currentList.filter(post => post.id !== deletedPostId)
    );
  };

  // This runs once when the page loads to get all feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/feedback');
        if (response.ok) {
          const data = await response.json();
          setFeedbackList(data);
        } else {
          console.error("Failed to fetch feedback from server.");
        }
      } catch (error) {
        console.error("Network error while fetching feedback:", error);
      }
    };
    fetchFeedback();
  }, []); // The empty array ensures this runs only once on mount

  return (
    <div className="feedback-page-container">
      <div className="feedback-header">
        <h2>Community Safety Wall</h2>
        <p>Recent feedback submitted by women travellers.</p>
      </div>
      <div className="feedback-content">
        {currentUser ? (
          // If user is logged in, show the form and pass the handler function
          <FeedbackForm onFeedbackSubmit={handleNewFeedback} />
        ) : (
          // If user is not logged in, show a prompt to log in
          <div className="login-prompt">
            <p>Please <Link to="/login">log in</Link> to submit your feedback.</p>
          </div>
        )}
        <div className="feedback-list">
          {feedbackList.map(post => (
            <FeedbackCard 
              key={post.id} 
              post={post}
              onDelete={handlePostDelete}
              loggedInUserId={currentUser?.id} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;