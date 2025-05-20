import React from 'react';
import './App.css'; // Make sure this is imported
import BookingForm from './components/BookingForm';
import FieldList from './components/FieldList';
import BookingList from './components/BookingList';

export default function App() {
  return (
    <div className="container">
      <h1>INPT Field Reservation</h1>
      <FieldList />
      <BookingForm />
      <hr />
      <BookingList />
    </div>
  );
}
