// api/index.js (formerly server.js)
const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // For local testing if you run this directly via node

const app = express();

// CORS Configuration: Allow your Vercel frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Set FRONTEND_URL in Vercel env vars
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Database connection
// IMPORTANT: Ensure your Vercel project has these environment variables set!
const db = mysql2.createConnection({
    host: process.env.MYSQL_HOST, // Use PlanetScale Host
    user: process.env.MYSQL_USER, // Use PlanetScale Username
    password: process.env.MYSQL_PASSWORD, // Use PlanetScale Password
    database: process.env.MYSQL_DATABASE, // Use PlanetScale Database Name
    port: process.env.MYSQL_PORT || 3306, // PlanetScale uses 3306, but it's good to be explicit
    ssl: {
        rejectUnauthorized: true // PlanetScale requires SSL connection
    }
});

// Use promise-based connection
const promiseDb = db.promise();

// Connect to DB - this will run on function initialization (warm starts)
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        // In serverless functions, you typically don't exit the process.
        // Instead, the function will fail. Log the error.
    } else {
        console.log('Connected to MySQL database as ID ' + db.threadId);
    }
});

// --- Your Authentication and User Management Routes ---
// (Paste all your app.post, app.get, app.delete, app.put routes here)

// Example of a route (your existing ones go here):
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

// ... All your other routes (login, /users, /users/:id, /reports) ...

// IMPORTANT: Export the Express app instance as the handler
module.exports = app;