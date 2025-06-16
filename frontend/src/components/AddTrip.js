import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import DestinationList from "./DestinationList";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";

const AddTrip = ({ onSave, addNewMarker, clearMarkers }) => {
  const navigate = useNavigate(); 
  const [tripName, setTripName] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showTripCalendar, setShowTripCalendar] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState({
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    latitude: null,
    longitude: null,
    photos: [],
    story: ""
  });
  const [success, setSuccess] = useState(false);
  const [hasClearedMarkers, setHasClearedMarkers] = useState(false); // Track if markers have been cleared

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleSubmit = () => {
    const tripData = {
      tripName,
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
      destinations,
    };
    onSave(tripData);
    setSuccess(true);
  };

  const addMarker = (destination) => {
    addNewMarker(destination);
  };

  const onCancel = () =>{
    navigate("/trips"); 
  };

  useEffect(() => {

    if (!hasClearedMarkers) {
      clearMarkers(); 
      setHasClearedMarkers(true);
    }
  }, [clearMarkers, hasClearedMarkers]); 

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md max-w-3xl mx-auto text-sm font-sans">
      <h2 className="text-xl font-semibold text-purple-400 mb-4">Add a New Trip</h2>
      <form className="space-y-4">
        {/* Trip Name */}
        <div>
          <label className="block text-purple-300 font-medium mb-1">Trip Name:</label>
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="Enter trip name"
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400"
          />
        </div>
  
        {/* Trip Dates */}
        <div className="relative">
          <label className="block text-purple-300 font-medium mb-1">Trip Dates:</label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowTripCalendar(!showTripCalendar)}
              className="flex items-center justify-center w-8 h-8 border border-gray-600 bg-gray-800 rounded-md hover:bg-gray-700"
            >
              <img src="/date_range.svg" alt="Select Trip Dates" className="w-4 h-4 invert" />
            </button>
            <div className="flex space-x-2">
              <span className="border border-gray-600 px-3 py-1 rounded-md bg-gray-800 text-white">
                {formatDate(dateRange[0].startDate)}
              </span>
              <span className="border border-gray-600 px-3 py-1 rounded-md bg-gray-800 text-white">
                {formatDate(dateRange[0].endDate)}
              </span>
            </div>
          </div>
          {showTripCalendar && (
            <div
              className="absolute z-10 bg-gray-900 text-white rounded-lg shadow-md p-2 mt-2 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                rangeColors={["#8b5cf6"]}
                className="rounded-md text-xs"
              />
              {/* Button to close calendar */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowTripCalendar(false)}
                  className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md shadow hover:bg-purple-500 transition duration-200"
                >
                  <img src="/checkmark.svg" alt="Close Calendar" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
  
        {/* Destinations */}
        <DestinationList
          destinations={destinations}
          setDestinations={setDestinations}
          formatDate={formatDate}
          newDestination={newDestination}
          setNewDestination={setNewDestination}
          tripDateRange={dateRange}
          addMarker={addMarker}
        />
  
        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-3 py-1 rounded-md shadow hover:bg-gray-500 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-3 py-1 rounded-md shadow hover:bg-purple-500 transition duration-200"
          >
            Save Trip
          </button>
        </div>
  
        {success && <p className="text-purple-300 mt-4">Uploading...</p>}
      </form>
    </div>
  );
  
};

export default AddTrip;
