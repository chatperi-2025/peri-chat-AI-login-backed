const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve static files from 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Database connection
const db = mysql.createConnection({
  host: 'bugmcgo92jrbk9dpfewg-mysql.services.clever-cloud.com',
  user: 'umomjmz183jm4idy',
  password: 'm0NBeMzbt4SZ2BThNbPh',
  database: 'bugmcgo92jrbk9dpfewg'
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM login WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (result.length > 0) {
      const user = result[0];
      if (user.is_password_changed === 0) {
        res.json({ success: true, changePassword: true });
      } else {
        res.json({ success: true, changePassword: false });
      }
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Change password API
app.post('/change-password', (req, res) => {
  const { email, newPassword } = req.body;

  const sql = 'UPDATE login SET password = ?, is_password_changed = 1 WHERE email = ?';
  db.query(sql, [newPassword, email], (err, result) => {
    if (err) {
      console.error('Password update error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    res.json({ success: true });
  });
});

// Get all users (for testing if needed)
app.get('/all-users', (req, res) => {
  db.query('SELECT * FROM login', (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ success: false });
    } else {
      res.json(result);
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
