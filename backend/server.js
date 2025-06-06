const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db/config');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register
app.post('/api/register', async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
    [email, hashedPassword, role],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'User creation failed' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
  });
});

// Get all fields
app.get('/api/fields', (req, res) => {
  db.query('SELECT * FROM fields', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('DB error');
    }
    res.json(results);
  });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  db.query(
    `SELECT b.id, f.name AS field_name, b.booking_date, b.booking_time 
     FROM bookings b 
     JOIN fields f ON b.field_id = f.id 
     ORDER BY b.booking_date, b.booking_time`,
    (err, results) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).send('Failed to fetch bookings.');
      }
      res.json(results);
    }
  );
});

// Create a booking (requires login)
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { field_id, booking_date, booking_time } = req.body;

  if (!field_id || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Check if already booked
  const checkSql = `
    SELECT * FROM bookings WHERE field_id = ? AND booking_date = ? AND booking_time = ?
  `;

  db.query(checkSql, [field_id, booking_date, booking_time], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error checking bookings' });

    if (results.length > 0) {
      return res.status(409).json({ error: 'This slot is already booked' });
    }

    const sql = `
      INSERT INTO bookings (field_id, booking_date, booking_time) VALUES (?, ?, ?)
    `;
    const values = [field_id, booking_date, booking_time];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting booking:', err);
        return res.status(500).json({ error: 'Failed to create booking.' });
      }

      res.status(201).json({ message: 'Booking successful!', bookingId: result.insertId });
    });
  });
});

// Delete a booking (admin only)
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  const bookingId = req.params.id;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.query('DELETE FROM bookings WHERE id = ?', [bookingId], (err, result) => {
    if (err) {
      console.error('Error deleting booking:', err);
      return res.status(500).json({ error: 'Failed to delete booking.' });
    }

    res.json({ message: 'Booking deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
