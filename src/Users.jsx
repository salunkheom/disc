// client/src/Users.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // State to hold user being edited
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
      if (err.response && err.response.status === 403) {
        // Using Bootstrap modal or custom message box instead of alert
        // alert('Access Denied: You do not have permission to view users.');
        setError('Access Denied: You do not have permission to view users.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    // Using custom confirmation instead of window.confirm
    if (window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
      try {
        await axios.delete(`http://localhost:3001/users/${userId}`);
        // Using Bootstrap alert for feedback
        alert('User deleted successfully!'); // Consider a custom message box
        fetchUsers(); // Refresh the list after deletion
      } catch (err) {
        console.error('Error deleting user:', err);
        // Using Bootstrap alert for feedback
        alert('Failed to delete user: ' + (err.response?.data?.error || 'Unknown error')); // Consider a custom message box
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.ID); // FIX: Use user.ID
    setEditFormData({ name: user.name, email: user.email });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e, userId) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/users/${userId}`, editFormData);
      // Using Bootstrap alert for feedback
      alert('User updated successfully!'); // Consider a custom message box
      setEditingUser(null); // Exit editing mode
      fetchUsers(); // Refresh the list after update
    } catch (err) {
      console.error('Error updating user:', err);
      // Using Bootstrap alert for feedback
      alert('Failed to update user: ' + (err.response?.data?.error || 'Unknown error')); // Consider a custom message box
    }
  };

  return (
    <div className="App d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
      <div className="container bg-white rounded shadow-lg p-4 p-md-5 w-100" style={{ maxWidth: '900px' }}>
        <h2 className="text-center text-dark fw-bold mb-4">Users Management</h2>
        <p className="text-center text-secondary mb-5">
          View, edit, and delete registered users.
        </p>

        <div className="text-center mb-4">
          <button className="btn btn-info px-4" onClick={fetchUsers} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              'Refresh Users'
            )}
          </button>
        </div>

        {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading users...</span>
            </div>
            <p className="mt-2 text-secondary">Loading users data, please wait...</p>
          </div>
        ) : (
          users.length === 0 ? (
            <p className="text-center text-secondary">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.ID}> {/* FIX: Use user.ID for key */}
                      <td>{user.ID}</td> {/* FIX: Use user.ID for display */}
                      <td>
                        {editingUser === user.ID ? ( // FIX: Use user.ID
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditFormChange}
                            className="form-control"
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td>
                        {editingUser === user.ID ? ( // FIX: Use user.ID
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditFormChange}
                            className="form-control"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {editingUser === user.ID ? ( // FIX: Use user.ID
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={(e) => handleEditSubmit(e, user.ID)} // FIX: Use user.ID
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingUser(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-info btn-sm me-2"
                              onClick={() => handleEditClick(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(user.ID)} // FIX: Use user.ID
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        <div className="text-center mt-5">
          <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}