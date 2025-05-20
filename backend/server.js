const express = require('express');
const cors = require('cors');
const db = require('./db/config');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/fields', (req, res) => {
  db.query('SELECT * FROM fields', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('DB error');
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.post('/api/bookings', (req, res) => {
  const { field_id, booking_date, booking_time } = req.body;

  if (!field_id || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const sql = 'INSERT INTO bookings (field_id, booking_date, booking_time) VALUES (?, ?, ?)';
  const values = [field_id, booking_date, booking_time];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting booking:', err);
      return res.status(500).json({ error: 'Failed to create booking.' });
    }
    res.status(201).json({ message: 'Booking successful!', bookingId: result.insertId });
  });
});
app.get('/api/bookings', (req, res) => {
  db.query(`
    SELECT b.id, f.name AS field_name, b.booking_date, b.booking_time
    FROM bookings b
    JOIN fields f ON b.field_id = f.id
    ORDER BY b.booking_date, b.booking_time
  `, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).send('Failed to fetch bookings.');
    }
    res.json(results);
  });
});
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = req.params.id;

  db.query('DELETE FROM bookings WHERE id = ?', [bookingId], (err, result) => {
    if (err) {
      console.error('Error deleting booking:', err);
      return res.status(500).json({ error: 'Failed to delete booking.' });
    }

    res.status(200).json({ message: 'Booking deleted successfully.' });
  });
});
