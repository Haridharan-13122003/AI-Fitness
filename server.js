const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// -- API ROUTES --

// Register a new user
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    // Hash the password for security
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sql, [username, hash], function(err) {
        if (err) {
            return res.status(400).json({ error: "Username already exists or database error" });
        }
        res.status(201).json({ message: "Registration successful", userId: this.lastID });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

        // Simple auth returning user ID. For production, JWT is recommended.
        res.json({ message: "Login successful", userId: user.id, username: user.username });
    });
});

// Get User Profile
app.get('/api/user/:id', (req, res) => {
    db.get(`SELECT id, username, age, height, weight, gender, goal FROM users WHERE id = ?`, [req.params.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    });
});

// Update User Profile (e.g. from Dashboard or BMI calc)
app.put('/api/user/:id', (req, res) => {
    const { age, height, weight, gender, goal } = req.body;
    const sql = `UPDATE users SET age = ?, height = ?, weight = ?, gender = ?, goal = ? WHERE id = ?`;
    db.run(sql, [age, height, weight, gender, goal, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Could not update user" });
        res.json({ message: "User profile updated successfully" });
    });
});

// Add Progress Entry
app.post('/api/progress', (req, res) => {
    const { user_id, date, weight, notes } = req.body;
    db.run(`INSERT INTO progress (user_id, date, weight, notes) VALUES (?, ?, ?, ?)`, 
    [user_id, date, weight, notes], function(err) {
        if (err) return res.status(500).json({ error: "Failed to add progress" });
        res.status(201).json({ message: "Progress added", progressId: this.lastID });
    });
});

// Get Progress Entries for a user
app.get('/api/progress/:userId', (req, res) => {
    db.all(`SELECT * FROM progress WHERE user_id = ? ORDER BY date DESC`, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to fetch progress" });
        res.json(rows);
    });
});

// Simple Chatbot API Mock
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const msgLower = message.toLowerCase();
    
    let reply = "I'm your AI fitness assistant. Can you specify if you want advice on workouts, diet, or rest?";
    if (msgLower.includes("weight loss") || msgLower.includes("fat")) {
        reply = "For weight loss, focus on a caloric deficit and mix cardio with strength training!";
    } else if (msgLower.includes("muscle") || msgLower.includes("gain")) {
        reply = "To gain muscle, ensure you eat in a caloric surplus with enough protein (1.6-2g per kg of body weight) and lift heavy!";
    } else if (msgLower.includes("stamina") || msgLower.includes("running")) {
        reply = "Stamina improves with consistent aerobic exercise like running, cycling, or swimming. Start slow and gradually increase distance!";
    } else if (msgLower.includes("hi") || msgLower.includes("hello")) {
        reply = "Hello! Ready to crush your fitness goals? What can I help you with today?";
    }

    // Simulate thinking delay
    setTimeout(() => {
        res.json({ reply });
    }, 800);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
