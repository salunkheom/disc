import React from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="App">
      <div className="container my-5 p-5 border shadow-lg text-center">
        <h2>Application Settings</h2>
        <p>This page allows users to configure personal or application-wide settings.</p>
        <p>Examples: Notification preferences, theme selection, privacy settings.</p>
        <Link to="/dashboard" className="btn btn-secondary mt-3">Back to Dashboard</Link>
      </div>
    </div>
  );
}