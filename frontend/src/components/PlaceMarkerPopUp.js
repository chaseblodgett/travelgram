// components/PlaceMarkerPopup.js
import React from "react";

const PlaceMarkerPopup = ({ place }) => {
  return (
    <div>
      <h3>{place.name}</h3>
      <p>{place.journal}</p>
      <div>
        {place.photos.map((photo, index) => (
          <img key={index} src={photo.url} alt="Travel" width="100" />
        ))}
      </div>
    </div>
  );
};

export default PlaceMarkerPopup;
