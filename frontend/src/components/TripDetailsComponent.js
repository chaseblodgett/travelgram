// components/TripDetailsComponent.js
import React from "react";

const TripDetailsComponent = ({ trip }) => {
  return (
    <div>
      <h2>{trip.name}</h2>
      <p>Dates: {trip.startDate} - {trip.endDate}</p>
      <div>
        <h3>Places Visited</h3>
        <ul>
          {trip.places.map((place, index) => (
            <li key={index}>{place.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TripDetailsComponent;
