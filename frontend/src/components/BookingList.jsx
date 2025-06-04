import React from 'react';

export default function BookingList({ bookings, onBookingDeleted }) {
  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: 'DELETE',
    }).then(() => {
      onBookingDeleted(); // trigger refetch
    });
  };

  return (
    <div>
      <h2>Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            {booking.field_name} - {booking.booking_date} at {booking.booking_time}
            <button onClick={() => handleDelete(booking.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
