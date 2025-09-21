import React, { useState } from 'react';
import './FeedbackCard.css';

const FeedbackCard = ({ post, onDelete, loggedInUserId }) => {
  // State to manage the vote counts displayed on the screen
  const [votes, setVotes] = useState({ up: post.upvotes, down: post.downvotes });
  // State to track the current user's vote on this specific card
  const [userVote, setUserVote] = useState(null); // Can be 'up', 'down', or null

  const handleVote = async (voteType) => {
    if (!loggedInUserId) {
      alert('Please log in to vote.');
      return;
    }

    // A simple frontend check to prevent spamming the same vote.
    // The backend would have more robust logic for a production app.
    if (userVote === voteType) {
      console.log("You have already cast this vote.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/feedback/${post.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: voteType }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        // Update the local state to instantly reflect the new vote counts
        setVotes({ up: updatedPost.upvotes, down: updatedPost.downvotes });
        // Set the user's vote status for this card
        setUserVote(voteType);
      } else {
        alert('Failed to cast vote. Please try again.');
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('A network error occurred while casting your vote.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/feedback/${post.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onDelete(post.id); // Triggers the refresh on the parent page
        } else {
          alert('Failed to delete the post.');
        }
      } catch (error) {
        alert('Error deleting the post.');
      }
    }
  };

  return (
    <div className="feedback-card">
      {loggedInUserId === post.user_id && (
        <button className="delete-btn" onClick={handleDelete}>×</button>
      )}
      <p className="feedback-text">"{post.content}"</p>
      <div className="feedback-meta">
        <span className="feedback-author">- {post.author}</span>
        <span className="feedback-station">📍 {post.station}</span>
      </div>
      <div className="feedback-actions">
        <button onClick={() => handleVote('up')} className={`vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}>▲</button>
        <span className="vote-count upvote-count">{votes.up}</span>
        <button onClick={() => handleVote('down')} className={`vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}>▼</button>
        <span className="vote-count downvote-count">{votes.down}</span>
      </div>
    </div>
  );
};

export default FeedbackCard;