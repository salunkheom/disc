import React from 'react';
import { Link } from 'react-router-dom';

export default function Report() {
  return (
    <div className="App">
      <div className="container my-5 p-5 border shadow-lg text-center">
        <h2>Reports</h2>
        <p>This page could display various reports or analytics relevant to your application.</p>
        <p>Examples: User activity, data trends, system performance.</p>
        <Link to="/dashboard" className="btn btn-secondary mt-3">Back to Dashboard</Link>
      </div>
    </div>
  );
}