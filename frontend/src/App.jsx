import React, { useEffect, useState } from 'react';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import './App.css';

function App() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    fetch('http://localhost:3001/api/bookings')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setBookings(data)});
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
