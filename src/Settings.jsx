// client/src/Settings.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function Settings() {
  // State for notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // State for theme selection
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // State for privacy settings
  const [profileVisibility, setProfileVisibility] = useState('public'); // 'public', 'friends', 'private'
  const [dataSharing, setDataSharing] = useState(true); // Toggle for data sharing

  // State for displaying save message
  const [saveMessage, setSaveMessage] = useState('');

  // In a real application, you would load initial settings from a backend API
  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     // Simulate fetching settings
  //     // const response = await axios.get('/api/user/settings');
  //     // setEmailNotifications(response.data.emailNotifications);
  //     // ... etc.
  //   };
  //   fetchSettings();
  // }, []);

  const handleSaveChanges = () => {
    // In a real application, you would send these settings to a backend API
    // const settingsToSave = {
    //   emailNotifications,
    //   pushNotifications,
    //   theme,
    //   profileVisibility,
    //   dataSharing
    // };
    // try {
    //   await axios.post('/api/user/settings', settingsToSave);
    //   setSaveMessage('Settings saved successfully!');
    // } catch (error) {
    //   setSaveMessage('Failed to save settings. Please try again.');
    //   console.error('Error saving settings:', error);
    // }

    // For this example, just simulate saving and show a message
    console.log('Saving settings:', {
      emailNotifications,
      pushNotifications,
      theme,
      profileVisibility,
      dataSharing,
    });
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="App d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
      <div className="container bg-white rounded shadow-lg p-4 p-md-5 w-100" style={{ maxWidth: '700px' }}>
        <h2 className="text-center text-dark fw-bold mb-4">Application Settings</h2>
        <p className="text-center text-secondary mb-5">
          Configure your personal or application-wide preferences below.
        </p>

        {/* Notification Preferences */}
        <div className="mb-4 pb-4 border-bottom">
          <h3 className="h5 text-dark fw-semibold mb-3">Notification Preferences</h3>
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <label className="form-check-label text-secondary" htmlFor="emailNotifications">Email Notifications</label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="pushNotifications"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
            />
            <label className="form-check-label text-secondary" htmlFor="pushNotifications">Push Notifications</label>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="mb-4 pb-4 border-bottom">
          <h3 className="h5 text-dark fw-semibold mb-3">Theme Selection</h3>
          <div className="d-flex justify-content-around align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="theme"
                id="themeLight"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => setTheme(e.target.value)}
              />
              <label className="form-check-label text-secondary" htmlFor="themeLight">Light</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="theme"
                id="themeDark"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => setTheme(e.target.value)}
              />
              <label className="form-check-label text-secondary" htmlFor="themeDark">Dark</label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-4">
          <h3 className="h5 text-dark fw-semibold mb-3">Privacy Settings</h3>
          <div className="mb-3">
            <label htmlFor="profileVisibility" className="form-label text-secondary">Profile Visibility:</label>
            <select
              id="profileVisibility"
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
              className="form-select"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="dataSharing"
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
            />
            <label className="form-check-label text-secondary" htmlFor="dataSharing">Share Anonymous Data</label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleSaveChanges}
            className="btn btn-primary btn-lg px-5 shadow"
          >
            Save Changes
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="mt-3 alert alert-success text-center" role="alert">
            {saveMessage}
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