// client/src/Users.jsx (No changes needed)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Don't forget to install axios if you haven't: npm install axios

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // State to hold user being edited
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/users'); // This is correct for port 3001
      setUsers(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]); // Clear users on error
      if (err.response && err.response.status === 403) {
        alert('Access Denied: You do not have permission to view users.');
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
    if (window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
      try {
        await axios.delete(`http://localhost:3001/users/${userId}`);
        alert('User deleted successfully!');
        fetchUsers(); // Refresh the list after deletion
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user: ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditFormData({ name: user.name, email: user.email });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e, userId) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/users/${userId}`, editFormData);
      alert('User updated successfully!');
      setEditingUser(null); // Exit editing mode
      fetchUsers(); // Refresh the list after update
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="App">
      <div className="container my-5 p-5 border shadow-lg">
        <h2 className="text-center mb-4">Users Management</h2>

        {loading && <p className="text-center">Loading users...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-center">No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                          className="form-control "
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUser === user.id ? (
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
                      {editingUser === user.id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={(e) => handleEditSubmit(e, user.id)}
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
                            onClick={() => handleDelete(user.id)}
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
        )}

        <div className="text-center mt-4">
          <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}