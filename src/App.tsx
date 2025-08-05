import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import BusinessDashboard from "./Pages/Dashboard";
import BusinessDashboard2 from "./Pages/Dashboard2";
// Page Imports
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import BusinessList from "./Pages/Businesses";
import BusinessDetailsPage from "./components/BusinessDetails";
import SettingsPage from "./Pages/Settings";
import Investments from "./Pages/Investments";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();
function App() {
  return (
    <Router>
      <QueryClientProvider client={client}>
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
            <Route path="/investments" element={<Investments />} />
            <Route path="/businesses/:id" element={<BusinessDetailsPage />} />
          </Routes>
          {/* <Toaster /> removed because it does not exist. If you want to use ToastProvider/ToastViewport, add them here. */}
        </div>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
