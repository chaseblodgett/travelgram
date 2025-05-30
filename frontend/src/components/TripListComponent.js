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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Trips</h2>
        <button
          onClick={handleClickAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition duration-200"
        >
          <img src="/add.svg" alt="Add Trip" className="w-7 h-5" />
        </button>
      </div>
      <div className="space-y-6">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div
              key={trip._id}
              className="block bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition duration-300 w-full max-w-4xl mx-auto flex justify-between items-center"
            >
              <div onClick={() => handleTripClick(trip)} className="flex-grow cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {trip.name}
                </h3>
                <p className="text-gray-600">
                  <span className="font-small">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </span>
                </p>
              </div>

              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletePopup(trip._id === deletePopup ? null : trip._id);
                  }}
                >
                  <img src="/delete.svg" alt="Delete" className="w-6 h-6" />
                </button>

                {deletePopup === trip._id && (
                  <div
                    className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-4 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-gray-800 mb-2">Delete?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(trip._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletePopup(null)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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
          <p className="text-gray-600">
            No trips available. Click "Add Trip" to create one!
          </p>
        )}
      </div>
    </div>
  );
};

export default TripListComponent;
