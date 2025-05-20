import React, { useEffect, useState } from 'react';

export default function BookingList() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    fetch('http://localhost:3001/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error('Error fetching bookings:', err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        fetchBookings(); // refresh list
      })
      .catch(err => console.error('Delete error:', err));
  };

  return (
    <div>
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.field_name}</td>
                <td>{booking.booking_date}</td>
                <td>{booking.booking_time}</td>
                <td>
                  <button onClick={() => handleDelete(booking.id)} style={{ backgroundColor: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
