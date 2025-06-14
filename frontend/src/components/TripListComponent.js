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
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-400">My Trips</h2>
        <button
          onClick={handleClickAdd}
          className="p-2 bg-gray-800 cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 rounded-lg transition"
        >
          <img src="/add_purple.svg" alt="Add Trip" className="w-6 h-6" />
        </button>
      </div>
  
      <div className="space-y-6">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-gray-800 rounded-xl shadow-md p-4 hover:opacity-80 hover:animate-bounce-once-grow hover:scale-115 transition duration-300 w-full max-w-4xl mx-auto flex justify-between items-center border border-gray-700"
            >
              <div
                onClick={() => handleTripClick(trip)}
                className="flex-grow cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-purple-300 mb-1">
                  {trip.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </p>
              </div>
  
              <div className="relative ml-4">
                <button
                  className="p-2 hover:bg-gray-700 rounded-full transition hover:animate-shake"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletePopup(trip._id === deletePopup ? null : trip._id);
                  }}
                >
                  <img src="/delete.svg" alt="Delete" className="w-6 h-6" />
                </button>
  
                {deletePopup === trip._id && (
                  <div
                    className="absolute top-10 right-0 bg-gray-800 border border-gray-600 shadow-lg rounded-xl p-4 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-white mb-3">Delete this trip?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(trip._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletePopup(null)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg transition"
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
          <p className="text-gray-400 text-center">No trips available. Click "Add Trip" to create one!</p>
        )}
      </div>
    </div>
  );
}

export default TripListComponent;
