import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BusinessDashboard from './Pages/Dashboard';
// Page Imports
import Login from './Auth/Login';
import Signup from './Auth/Signup';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* General Routes */}
          <Route path="/home" element={<BusinessDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
