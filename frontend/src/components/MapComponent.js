// components/MapComponent.js
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ places }) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={{ lat: 0, lng: 0 }} zoom={2}>
        {places.map((place, index) => (
          <Marker key={index} position={{ lat: place.lat, lng: place.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
