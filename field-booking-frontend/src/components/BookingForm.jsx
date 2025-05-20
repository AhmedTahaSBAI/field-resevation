import React, { useState, useEffect } from 'react';

export default function BookingForm() {
  const [fields, setFields] = useState([]);
  const [fieldId, setFieldId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch fields from backend when component mounts
  useEffect(() => {
    fetch('http://localhost:3001/api/fields')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch fields');
        return res.json();
      })
      .then((data) => {
        setFields(data);
        if (data.length > 0) setFieldId(data[0].id); // default to first field
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_id: Number(fieldId),
          booking_date: date,
          booking_time: time,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Booking successful! Your booking ID is ${data.bookingId}`);
        setDate('');
        setTime('');
      } else {
        alert(`Booking failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading fields...</p>;
  if (error) return <p>Error loading fields: {error}</p>;

  return (
    <form onSubmit={handleBooking}>
      <h2>Book a Field</h2>
      <label>
        Field:
        <select value={fieldId} onChange={(e) => setFieldId(e.target.value)}>
          {fields.map(field => (
            <option key={field.id} value={field.id}>{field.name}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <br />
      <label>
        Time:
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Book</button>
    </form>
  );
}
