// client/src/Report.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

export default function Report() {
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState(null);

  // Function to simulate fetching report data
  const fetchReportData = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setReportsData({
        userActivity: [
          { id: 1, user: 'Alice', action: 'Logged in', timestamp: '2025-07-07 10:00 AM' },
          { id: 2, user: 'Bob', action: 'Updated profile', timestamp: '2025-07-07 10:15 AM' },
          { id: 3, user: 'Charlie', action: 'Created new item', timestamp: '2025-07-07 10:30 AM' },
          { id: 4, user: 'Alice', action: 'Logged out', timestamp: '2025-07-07 11:05 AM' },
          { id: 5, user: 'Bob', action: 'Viewed report', timestamp: '2025-07-07 11:20 AM' },
        ],
        dataTrends: {
          registrationsLast7Days: 125,
          activeUsersToday: 80,
          newItemsCreatedToday: 45,
        },
        systemPerformance: {
          cpuUsage: '15%',
          memoryUsage: '60%',
          diskSpace: '75% Used',
          uptime: '15 days, 8 hours',
        },
      });
      setLoading(false);
    }, 1500); // 1.5 seconds delay
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="App d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
      <div className="container bg-white rounded shadow-lg p-4 p-md-5 w-100" style={{ maxWidth: '900px' }}>
        <h2 className="text-center text-dark fw-bold mb-4">Application Reports & Analytics</h2>
        <p className="text-center text-secondary mb-5 mt-5">
          This page displays various reports and key metrics relevant to your application.
        </p>

        <div className="text-center mb-4">
          <button className="btn btn-info px-4" onClick={fetchReportData} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              'Refresh Data'
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading reports...</span>
            </div>
            <p className="mt-2 text-secondary">Loading reports data, please wait...</p>
          </div>
        ) : (
          <div className="row g-4">
            {/* User Activity Report */}
            <div className="col-md-12">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white h5 fw-bold">User Activity</div>
                <div className="card-body">
                  <p className="card-text text-secondary mb-3">Recent user actions within the application.</p>
                  <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className="table table-striped table-hover table-sm">
                      <thead className="table-dark sticky-top" style={{ top: 0 }}>
                        <tr>
                          <th>ID</th>
                          <th>User</th>
                          <th>Action</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportsData.userActivity.map((activity) => (
                          <tr key={activity.id}>
                            <td>{activity.id}</td>
                            <td>{activity.user}</td>
                            <td>{activity.action}</td>
                            <td>{activity.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Trends Report */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-success text-white h5 fw-bold">Data Trends</div>
                <div className="card-body">
                  <p className="card-text text-secondary mb-3">Key trends and summaries of application data.</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Registrations (Last 7 Days)
                      <span className="badge bg-primary rounded-pill">{reportsData.dataTrends.registrationsLast7Days}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Active Users (Today)
                      <span className="badge bg-success rounded-pill">{reportsData.dataTrends.activeUsersToday}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      New Items Created (Today)
                      <span className="badge bg-info rounded-pill">{reportsData.dataTrends.newItemsCreatedToday}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* System Performance Report */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-danger text-white h5 fw-bold">System Performance</div>
                <div className="card-body">
                  <p className="card-text text-secondary mb-3">Real-time metrics about the system's health.</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      CPU Usage
                      <span className="badge bg-secondary rounded-pill">{reportsData.systemPerformance.cpuUsage}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Memory Usage
                      <span className="badge bg-secondary rounded-pill">{reportsData.systemPerformance.memoryUsage}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Disk Space
                      <span className="badge bg-secondary rounded-pill">{reportsData.systemPerformance.diskSpace}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Uptime
                      <span className="badge bg-secondary rounded-pill">{reportsData.systemPerformance.uptime}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Dashboard Link */}
        <div className="text-center mt-5">
          <Link to="/dashboard" className="btn btn-secondary">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}