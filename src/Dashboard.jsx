import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any user session data (e.g., from localStorage)
    localStorage.removeItem('userEmail'); // Example: if you stored email
    console.log('User logged out.');
    navigate('/flog'); // Redirect to login page
  };

  return (
    <div className="App">
      <div className="container my-5 p-5 border shadow-lg text-center">
        <h2>Welcome to Your Dashboard!</h2>
        <p>Explore your application features:</p>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
          <Link to="/prof" className="btn btn-primary">
            My Profile
          </Link>
          <Link to="/users" className="btn btn-primary">
            Manage Users
          </Link>
       
          <Link to="/settings" className="btn btn-primary">
            App Settings
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}