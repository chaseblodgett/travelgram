import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 

const TripDetailsComponent = ( {handleAllTrips, onClickBack, onClickDestination}) => {
  const { id } = useParams(); 
  const [trip, setTrip] = useState(null);
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`/api/trips/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip details");
        }
        const tripData = await response.json();
        setTrip(tripData);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (!trip) {
    return <div>Loading...</div>;
  }

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleClickBack = () => {
    handleAllTrips();
    onClickBack();
  };

  const handleNewWindow = (destination) => {
    console.log(destination);
    onClickDestination(destination);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white font-sans">
      <button
        onClick={handleClickBack}
        className="text-purple-400 hover:underline mb-3 flex items-center text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Trips
      </button>
  
      <h2 className="text-2xl font-semibold text-purple-300 mb-1">{trip.name}</h2>
      <p className="text-sm text-gray-400">
        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
      </p>
  
      <div className="mt-5">
        <div className="space-y-3">
          {trip.destinations.map((destination, index) => (
            <div
              key={index}
              className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md shadow-sm cursor-pointer border border-gray-700"
              onClick={() => handleNewWindow(destination)}
            >
              <h4 className="text-base font-medium text-white">{destination.name}</h4>
              <p className="text-sm text-gray-400">
                {formatDate(destination.startDate)} – {formatDate(destination.endDate)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  
};

export default TripDetailsComponent;
