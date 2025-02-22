import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BusinessDashboard from './Pages/Dashboard';
import BusinessDashboard2 from './Pages/Dashboard2';
// Page Imports
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import BusinessList from './Pages/Businesses';
import BusinessDetailsPage from './components/BusinessDetails';
import SettingsPage from './Pages/Settings';
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
          <Route path="/home2" element={<BusinessDashboard2 />} />
          <Route path="/business" element={<BusinessList />} />
          <Route path="/settings" element={<SettingsPage />} />
             <Route path="/businesses/:id" element={<BusinessDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
