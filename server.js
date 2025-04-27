const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors({
  origin: 'https://dummy-60040263906.development.catalystserverless.in/app/index.html' // ✅ Updated: only domain, no "/app/index.html"
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'bugmcgo92jrbk9dpfewg-mysql.services.clever-cloud.com',
  user: 'umomjmz183jm4idy',
  password: 'm0NBeMzbt4SZ2BThNbPh',
  database: 'bugmcgo92jrbk9dpfewg'
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM login WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (result.length > 0) {
      const user = result[0];
      if (user.password === password) {
        if (user.is_password_changed === 0) {
          res.json({ success: true, changePassword: true });
        } else {
          res.json({ success: true, changePassword: false });
        }
      } else {
        res.json({ success: false, message: 'Incorrect password' });
      }
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  });
});

// Change Password API
app.post('/change-password', (req, res) => {
  const { email, newPassword } = req.body;

  const sql = 'UPDATE login SET password = ?, is_password_changed = 1 WHERE email = ?';
  db.query(sql, [newPassword, email], (err, result) => {
    if (err) {
      console.error('Password update error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Password updated successfully.' });
    } else {
      res.json({ success: false, message: 'Email not found.' });
    }
  });
});

// Get All Users API
app.get('/all-users', (req, res) => {
  const sql = 'SELECT email FROM login';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
    res.json(result);
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
