import { BrowserRouter, Route, Routes, Link } from "react-router-dom"; // <-- FIX: Added Link import

// Core authentication pages
import Login from "./Login";
import Signup from "./signup";
    import 'bootstrap/dist/css/bootstrap.css';
// Pages for logged-in users
import Dashboard from "./Dashboard.jsx";
import Prof from "./prof";           // This is your Profile page
import Users from "./Users";         // New: Users page
import Report from "./Report";       // New: Report page
import Settings from "./Settings";   // New: Settings page

// Styles
import "./index.css"; // Or './styles.css' based on your actual file
// import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (accessible without login) */}
        <Route path="/" element={<Login />} />
        <Route path="/flog" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (typically accessible after login) */}
        {/* You'd later add logic to protect these routes,
            e.g., by checking for an authentication token */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* <-- FIX: Changed to lowercase /dashboard */}
        <Route path="/prof" element={<Prof />} />
        <Route path="/users" element={<Users />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />

        {/* 404 Not Found Route - Always keep this as the last route */}
        <Route path="*" element={
          <div className="App">
            <div className="container my-5 p-5 border shadow-lg text-center">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <Link to="/dashboard" className="btn btn-primary mt-3">Go to Dashboard</Link>
              <br/>
              <Link to="/flog" className="btn btn-link mt-2">Login</Link>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}