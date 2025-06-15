import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TripListComponent = ({ handleNewTrip, handleRemoveTrip, onCloseInfoWindow, showAllTrips, clearMarkers }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletePopup, setDeletePopup] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/mytrips");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const tripData = await response.json();
        setTrips(tripData);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const closeInfoWindow = () => {
    onCloseInfoWindow();
  };

  const handleTripClick = (trip) => {
    closeInfoWindow();
    handleNewTrip(trip);
  };

  const handleDelete = async (tripId) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      const deletedTripData = await response.json(); 
      
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
      setDeletePopup(null);

      handleRemoveTrip(deletedTripData.deletedTrip);
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading trips...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  const handleClickAdd = () => {
    clearMarkers();
    navigate("/addTrip"); 
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-400">My Trips</h2>
        <button
          onClick={handleClickAdd}
          className="p-1.5 bg-gray-800 cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-110 rounded-md transition"
        >
          <img src="/add_purple.svg" alt="Add Trip" className="w-5 h-5" />
        </button>
      </div>
  
      <div className="space-y-4">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-gray-800 rounded-lg shadow p-3 hover:opacity-90 hover:animate-bounce-once-grow transition duration-300 max-w-3xl mx-auto flex justify-between items-center border border-gray-700"
            >
              <div
                onClick={() => handleTripClick(trip)}
                className="flex-grow cursor-pointer"
              >
                <h3 className="text-lg font-medium text-purple-300 mb-0.5">
                  {trip.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </p>
              </div>
  
              <div className="relative ml-3">
                <button
                  className="p-1.5 hover:bg-gray-700 rounded-full transition hover:animate-shake"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletePopup(trip._id === deletePopup ? null : trip._id);
                  }}
                >
                  <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
                </button>
  
                {deletePopup === trip._id && (
                  <div
                    className="absolute top-9 right-0 bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-3 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-white mb-2 text-sm">Delete this trip?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(trip._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletePopup(null)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center text-sm">
            No trips available. Click "Add Trip" to create one!
          </p>
        )}
      </div>
    </div>
  );
  
}

export default TripListComponent;
