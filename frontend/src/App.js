import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import all components and pages
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import SafetyDashboardPage from './pages/SafetyDashboardPage';
import FeedbackPage from './pages/FeedbackPage';
import AnalysisPage from './pages/AnalysisPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  const getInitialUser = () => {
    const user = localStorage.getItem('safarguardia_user');
    return user ? JSON.parse(user) : null;
  };

  // --- CHANGE THIS LINE ---
  const [currentUser, setCurrentUser] = useState(getInitialUser());
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setCurrentUser(user);
    navigate('/'); // Redirect to homepage after state is set
  };

  const handleLogout = () => {
    localStorage.removeItem('safarguardia_user');
    setCurrentUser(null); 
    navigate('/login'); // Redirect to login after logout
  };

  const isLoggedIn = currentUser !== null;

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        {isLoggedIn ? (
          <>
            {/* --- Routes for LOGGED-IN users --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/safety" element={<SafetyDashboardPage />} />
            <Route 
              path="/feedback" 
              element={<FeedbackPage currentUser={currentUser} />} 
            />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route 
              path="/profile" 
              element={<UserProfilePage currentUser={currentUser} onLogout={handleLogout} />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* --- Routes for LOGGED-OUT users --- */}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/feedback" 
              element={<FeedbackPage currentUser={currentUser} />} 
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;