// client/src/prof.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported (changed to min.css for consistency)

export default function Prof() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole');

    if (storedEmail) {
      setUserEmail(storedEmail);
      setUserName(storedName || 'Guest'); // Default to 'Guest' if name not found
      setUserRole(storedRole || 'User'); // Default to 'User' if role not found
    } else {
      navigate('/disc'); // Redirect if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLastName'); // Clear last name too if stored
    localStorage.removeItem('userRole'); // Clear role
    navigate('/flog');
  };

  return (
    <div className="App d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
      <div className="main-p container bg-white rounded shadow-lg p-4 p-md-5 w-100 text-center" style={{ maxWidth: '600px' }}>
        <h1 className="display-4 fw-bold text-dark mb-4">User Profile</h1>
        {/* Placeholder image - you can replace this with a dynamic image later */}
        <img
          src="https://placehold.co/128x128/aabbcc/ffffff?text=User"
          alt="User Profile"
          className="mx-auto d-block rounded-circle border border-5 border-primary shadow mb-4"
          style={{ width: '128px', height: '128px', objectFit: 'cover' }}
        />

        {userEmail ? (
          <>
            <p className="fs-5 text-secondary mb-2"><strong>Name:</strong> {userName}</p>
            <p className="fs-5 text-secondary mb-2"><strong>Role:</strong> {userRole}</p>
            <p className="fs-5 text-secondary mb-4"><strong>Email ID:</strong> {userEmail}</p>
            
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-lg fw-semibold shadow-sm me-2"
            >
              Logout
            </button>
            <Link to="/dashboard" className="btn btn-secondary btn-lg shadow-sm">
              Back to Dashboard
            </Link>
          </>
        ) : (
          <p className="fs-5 text-secondary">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
