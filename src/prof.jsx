// client/src/prof.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

export default function Prof() {
  // In a real app, you would fetch user data here, e.g., from context or local storage
  const userName = "virat kohli"; // Placeholder
  const userEmail = "viratk@gmail.com"; // Placeholder
  const userRole = "Member"; // Placeholder

  return (
    <div className="App"> {/* Keep consistent styling container */}
      <div className="main-p container my-5 p-5 border shadow-lg text-center">
        <h1>User Profile</h1>
        <h2>{userName}</h2>
        <p><strong>Role:</strong> {userRole}</p>
        <p><strong>Email ID:</strong> {userEmail}</p>
        <Link to="/dashboard" className="btn btn-secondary mt-3">Back to Dashboard</Link>
      </div>
    </div>
  );
}