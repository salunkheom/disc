// api/index.js (formerly server.js)
const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const multer = require('multer'); // NEW: Import multer for file uploads
const path = require('path');     // NEW: Import path module (was missing/commented out)
const fs = require('fs');         // NEW: Import fs for file system operations (e.g., deleting temp files)

const app = express();

// CORS Configuration: Allow your Vercel frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Set FRONTEND_URL in Vercel env vars
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Database connection
const db = mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 4000, // TiDB Cloud commonly uses port 4000
    ssl: {
        rejectUnauthorized: true // Essential for secure connections to cloud databases like TiDB
    }
});

const promiseDb = db.promise();

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to MySQL database as ID ' + db.threadId);
    }
});

// --- User Authentication Routes ---

// SIGNUP ROUTE
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
        const [users] = await promiseDb.query("SELECT COUNT(*) AS count FROM users WHERE email = ?", [email]);
        if (users[0].count > 0) {
            return res.status(409).json({ error: 'Email already registered.' });
        }
        const insertSql = 'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())';
        const values = [name, email, password];
        await promiseDb.query(insertSql, values);
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ error: 'Database error during signup.' });
    }
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const [data] = await promiseDb.query("SELECT ID, name, email, password, profile_pic_url FROM users WHERE email = ?", [email]);
        if (data.length > 0) {
            const user = data[0];
            if (user.password === password) {
                await promiseDb.query("UPDATE users SET last_login_at = NOW() WHERE ID = ?", [user.ID]);
                return res.json({
                    success: true,
                    message: "Login successful!",
                    name: user.name,
                    email: user.email,
                    role: "User",
                    id: user.ID,
                    // Send the full URL if it's an external cloud storage, or just the path if Vercel serves it
                    // For now, if profile_pic_url is stored as /tmp/path, we can't serve it directly.
                    // This will be null unless you implement cloud storage.
                    profile_pic_url: user.profile_pic_url || null // Will be null unless you use cloud storage
                });
            } else {
                return res.status(401).json({ success: false, error: "Invalid credentials." });
            }
        } else {
            return res.status(401).json({ success: false, error: "Invalid credentials." });
        }
    } catch (err) {
        console.error('Error during login query:', err);
        res.status(500).json({ error: 'Database error during login.' });
    }
});

// GET all users
app.get('/users', async (req, res) => {
    try {
        const [data] = await promiseDb.query("SELECT ID, name, email, profile_pic_url FROM users");
        const usersWithPicUrls = data.map(user => ({
            ...user,
            // profile_pic_url will be null unless you use cloud storage
            profile_pic_url: user.profile_pic_url || null
        }));
        res.json(usersWithPicUrls);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to retrieve users.' });
    }
});

// GET user by email (needed for fetching profile picture URL in Prof.jsx)
app.get('/users/email/:email', async (req, res) => {
    const userEmail = req.params.email;
    try {
        const [data] = await promiseDb.query("SELECT ID, name, email, profile_pic_url FROM users WHERE email = ?", [userEmail]);
        if (data.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const user = data[0];
        // profile_pic_url will be null unless you use cloud storage
        user.profile_pic_url = user.profile_pic_url || null;
        res.json(user);
    } catch (err) {
        console.error('Error fetching user by email:', err);
        res.status(500).json({ error: 'Failed to retrieve user data.' });
    }
});


// DELETE a user
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [result] = await promiseDb.query("DELETE FROM users WHERE ID = ?", [userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});

// UPDATE a user
app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required for update.' });
    }
    try {
        const [result] = await promiseDb.query("UPDATE users SET name = ?, email = ? WHERE ID = ?", [name, email, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or no changes made.' });
        }
        res.json({ success: true, message: 'User updated successfully.' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

// --- NEW Report Data Endpoint ---
app.get('/reports', async (req, res) => {
    try {
        const [userActivityRows] = await promiseDb.query(
            "SELECT ID, name, created_at, last_login_at FROM users ORDER BY created_at DESC LIMIT 10"
        );
        const userActivity = userActivityRows.map(user => ({
            id: user.ID,
            user: user.name,
            action: user.last_login_at ? `Logged in (${new Date(user.last_login_at).toLocaleString()})` : 'Registered',
            timestamp: new Date(user.created_at).toLocaleString()
        }));

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        const [recentRegistrations] = await promiseDb.query(
            "SELECT COUNT(*) AS count FROM users WHERE created_at >= ?",
            [sevenDaysAgo]
        );
        const registrationsLast7Days = recentRegistrations[0].count;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayStartISO = todayStart.toISOString().slice(0, 19).replace('T', ' ');

        const [activeUsersResult] = await promiseDb.query(
            "SELECT COUNT(*) AS count FROM users WHERE last_login_at >= ?",
            [todayStartISO]
        );
        const activeUsersToday = activeUsersResult[0].count;

        const [totalUsersResult] = await promiseDb.query("SELECT COUNT(*) AS count FROM users");
        const totalUsers = totalUsersResult[0].count;

        const newItemsCreatedToday = 0;

        const systemPerformance = {
            cpuUsage: '18%',
            memoryUsage: '65%',
            diskSpace: '78% Used',
            uptime: '16 days, 2 hours',
        };

        res.json({
            userActivity,
            dataTrends: {
                registrationsLast7Days,
                activeUsersToday,
                totalUsers,
                newItemsCreatedToday,
            },
            systemPerformance,
        });

    } catch (err) {
        console.error('Error fetching report data:', err);
        res.status(500).json({ error: 'Failed to retrieve report data from the database.' });
    }
});

// NEW UPLOAD PROFILE PICTURE ROUTE
// Multer storage for Vercel Serverless functions (uses /tmp/ for ephemeral storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/'); // Vercel serverless functions can only write to /tmp/
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }
  const filePath = req.file.path; // This is a path like /tmp/profilePic-12345.jpg
  const userEmail = req.body.email;

  if (!userEmail) {
    fs.unlinkSync(filePath); // Use fs.unlinkSync to delete the temporary file
    return res.status(400).json({ success: false, error: 'User email not provided.' });
  }

  try {
    // IMPORTANT: For production, you MUST upload this file to a cloud storage service (e.g., AWS S3, Cloudinary).
    // Storing /tmp/ paths in the DB is only for demonstration as they are ephemeral.
    // The frontend will NOT be able to access files directly from /tmp/ on a Vercel function.
    const updateSql = "UPDATE users SET profile_pic_url = ? WHERE email = ?";
    const [result] = await promiseDb.query(updateSql, [filePath, userEmail]); // Storing ephemeral path

    if (result.affectedRows === 0) {
        fs.unlinkSync(filePath);
        return res.status(404).json({ success: false, error: 'User not found for profile picture update.' });
    }
    // Return a message, but the profilePicUrl here is not directly usable by the frontend
    // unless you implement a separate static file serving mechanism or cloud storage.
    res.json({ success: true, message: 'Profile picture uploaded and updated!', profilePicUrl: filePath });
  } catch (err) {
    console.error('Error updating profile picture URL in DB:', err);
    fs.unlinkSync(filePath);
    res.status(500).json({ success: false, error: 'Database error updating profile picture.' });
  } finally {
      // Ensure the temporary file is deleted after processing
      if (fs.existsSync(filePath)) { // Check if file exists before trying to delete
          fs.unlinkSync(filePath);
      }
  }
});

// IMPORTANT: Do NOT use app.use(express.static(...)) directly in Vercel Serverless Functions
// for serving user-uploaded content. This is for traditional Express servers.
// For static assets, Vercel serves them directly from your 'public' folder or build output.
// For user-uploaded content, use cloud storage.

// IMPORTANT: Export the Express app instance as the handler
module.exports = app;