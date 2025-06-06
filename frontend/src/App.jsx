import React, { useEffect, useState } from 'react';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import './App.css';

function App() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="container">
      <h1>Field Booking System</h1>
      <BookingForm onBookingCreated={fetchBookings} />
      <BookingList bookings={bookings} onBookingDeleted={fetchBookings} />
    </div>
  );
}

export default App;
