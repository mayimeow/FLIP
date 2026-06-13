import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all components
import LandingPage from './pages/LandingPage'; // <-- New import
import Home from './pages/Home'; // This is your existing Login/Signup component
import Dashboard from './pages/Dashboard';
import LearningHub from './pages/LearningHub';
import Profile from './pages/Profile';
import QuizArena from './pages/QuizArena';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import ForgotPassword from './pages/ForgotPassword';

// Admin Routes
import AdminUpload from './components/AdminUpload';
import AdminUsers from './components/AdminUsers';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* New Landing Page is the default entry point */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Your existing Home.jsx (Login/Signup) is now mapped to /auth */}
          <Route path="/auth" element={<Home />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning-hub" element={<LearningHub />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/arena" element={<QuizArena />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin-upload" element={<AdminUpload />} />
          <Route path="/admin-users" element={<AdminUsers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;