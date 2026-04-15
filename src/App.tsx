import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BusinessDashboard from "./Pages/Dashboard";
import BusinessDashboard2 from "./Pages/Dashboard2";
// Page Imports
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import BusinessList from "./Pages/Businesses";
import BusinessDetailsPage from "./components/BusinessDetails";
import SettingsPage from "./Pages/Settings";
import Investments from "./Pages/Investments";
import MerchantsPage from "./Pages/Merchants";
import ServicesPage from "./Pages/Services";
import BookingsPage from "./Pages/Bookings";

// Admin Portal Pages
import AdminDashboard from "./Pages/AdminDashboard";
import UserManagement from "./Pages/UserManagement";
import BusinessApprovals from "./Pages/BusinessApprovals";
import AdminBusinessManagement from "./Pages/AdminBusinessManagement";
import AdminTransactions from "./Pages/AdminTransactions";
import AdminOrderManagement from "./Pages/AdminOrderManagement";
import BusinessOrderManagement from "./Pages/BusinessOrderManagement";
import AdminMapManagement from "./Pages/AdminMapManagement";
import AdminCommunication from "./Pages/AdminCommunication";
import AdminContentManagement from "./Pages/AdminContentManagement";
import AdminCategories from "./Pages/AdminCategories";
import AdminAnalytics from "./Pages/AdminAnalytics";
import AdminSecurity from "./Pages/AdminSecurity";
import AdminSettings from "./Pages/AdminSettings";

import BusinessOnboarding from "./Pages/BusinessOnboarding";
import MerchantVerifiedBusinesses from "./Pages/MerchantVerifiedBusinesses";

import SplashScreen from "./components/SplashScreen";

const client = new QueryClient();
function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800); // Wait slightly longer than the fade animation in SplashScreen
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <QueryClientProvider client={client}>
        <div className="App">
          {showSplash && <SplashScreen />}
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
            <Route path="/merchants" element={<MerchantsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/orders" element={<BusinessOrderManagement />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/businesses/:id" element={<BusinessDetailsPage />} />

            {/* Business Onboarding */}
            <Route path="/business-onboarding" element={<BusinessOnboarding />} />
            <Route path="/merchant-businesses" element={<MerchantVerifiedBusinesses />} />

            {/* Admin Portal Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/businesses/approvals" element={<BusinessApprovals />} />
            <Route path="/admin/businesses" element={<AdminBusinessManagement />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/orders" element={<AdminOrderManagement />} />
            <Route path="/admin/map" element={<AdminMapManagement />} />
            <Route path="/admin/communication" element={<AdminCommunication />} />
            <Route path="/admin/content" element={<AdminContentManagement />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/security" element={<AdminSecurity />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
          {/* <Toaster /> removed because it does not exist. If you want to use ToastProvider/ToastViewport, add them here. */}
        </div>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
