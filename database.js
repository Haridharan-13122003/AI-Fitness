const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (creates a new file if it doesn't exist)
const db = new sqlite3.Database(path.join(__dirname, 'fitness.db'), (err) => {
    if (err) {
        console.error('Error opening database ', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            age INTEGER,
            height REAL,
            weight REAL,
            gender TEXT,
            goal TEXT
        )`, (err) => {
            if (err) console.error("Error creating users table: ", err.message);
        });

        // Create Progress Table
        db.run(`CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date TEXT,
            weight REAL,
            notes TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) console.error("Error creating progress table: ", err.message);
        });
    }
});

module.exports = db;
