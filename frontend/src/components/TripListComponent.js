// components/TripListComponent.js
import React, { useState } from "react";

const TripListComponent = () => {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ name: "", places: [] });

  const handleAddTrip = () => {
    setTrips([...trips, newTrip]);
    setNewTrip({ name: "", places: [] });
  };

  return (
    <div>
      <h2>My Trips</h2>
      <input
        type="text"
        value={newTrip.name}
        onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
        placeholder="Trip Name"
      />
      <button onClick={handleAddTrip}>Add Trip</button>
      <ul>
        {trips.map((trip, index) => (
          <li key={index}>
            {trip.name} - {trip.places.length} places
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripListComponent;
