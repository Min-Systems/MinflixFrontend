import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import ProfilePicker from './ProfilePicker';
import ProfileCreator from './ProfileCreator';
import ProfileHome from './ProfileHome';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          
          {/* Profile routes */}
          <Route path="/profiles" element={<ProfilePicker />} />
          <Route path="/create-profile" element={<ProfileCreator />} />
          
          {/* Main app routes */}
          <Route path="/home" element={<ProfileHome />} />
          
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;