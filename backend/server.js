const express = require('express');
const cors = require('cors');
const db = require('./db/config');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all fields
app.get('/api/fields', (req, res) => {
  db.query('SELECT * FROM fields', (err, results) => {
    if (err) return res.status(500).send('DB error');
    res.json(results);
  });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  db.query(`
    SELECT b.id, b.field_id, f.name AS field_name, b.booking_date, b.booking_time
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

// Add a booking
app.post('/api/bookings', (req, res) => {
  const { field_id, booking_date, booking_time } = req.body;

  if (!field_id || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Check for existing booking for the same field, date, and time
  db.query(
    'SELECT * FROM bookings WHERE field_id = ? AND booking_date = ? AND booking_time = ?',
    [field_id, booking_date, booking_time],
    (err, results) => {
      if (err) {
        console.error('Error checking booking:', err);
        return res.status(500).json({ error: 'DB error.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: 'This slot is already booked.' });
      }

      // Insert booking
      db.query(
        'INSERT INTO bookings (field_id, booking_date, booking_time) VALUES (?, ?, ?)',
        [field_id, booking_date, booking_time],
        (err, result) => {
          if (err) {
            console.error('Error inserting booking:', err);
            return res.status(500).json({ error: 'Failed to create booking.' });
          }
          res.status(201).json({ message: 'Booking successful', bookingId: result.insertId });
        }
      );
    }
  );
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM bookings WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete booking.' });
    res.status(200).json({ message: 'Booking deleted.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
