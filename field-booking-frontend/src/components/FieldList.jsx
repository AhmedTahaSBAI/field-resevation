import React, { useEffect, useState } from 'react';

export default function FieldList() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/fields')
      .then(response => response.json())
      .then(data => setFields(data))
      .catch(error => console.error('Error fetching fields:', error));
  }, []);

  return (
    <div>
      <h2>Available Fields</h2>
      {fields.length === 0 ? (
        <p>Loading fields...</p>
      ) : (
        <ul>
          {fields.map(field => (
            <li key={field.id}>
              {field.name} - {field.available ? 'Available' : 'Not Available'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}