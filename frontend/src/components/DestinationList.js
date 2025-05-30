import React, { useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DestinationList = ({
  destinations,
  setDestinations,
  formatDate,
  newDestination,
  setNewDestination,
  tripDateRange,
  addMarker,
}) => {
  const [showDestinationCalendar, setShowDestinationCalendar] = useState(false);
  const [error, setError] = useState(null);
  const [editingStoryIndex, setEditingStoryIndex] = useState(null); // Track active editable story
  const autocompleteRef = useRef(null);

  const handlePlaceSelect = () => {
    const autocomplete = autocompleteRef.current;
    const place = autocomplete.getPlace();

    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setError(null);

      setNewDestination({
        ...newDestination,
        name: place.name,
        latitude: lat,
        longitude: lng,
      });
    } else {
      setError("Please select a valid destination.");
    }
  };

  const handleAddDestination = () => {
    if (
      newDestination.name &&
      newDestination.latitude &&
      newDestination.longitude
    ) {
      setDestinations([
        ...destinations,
        { ...newDestination, photos: [], story: "" },
      ]);
      setNewDestination({
        name: "",
        startDate: new Date(),
        endDate: new Date(),
        latitude: null,
        longitude: null,
        photos: [],
        story: "",
      });
      setError(null);
      addMarker(newDestination);
    } else {
      setError("Please select a valid destination.");
    }
  };

  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    const updatedDestinations = [...destinations];

    updatedDestinations[index].photos = [
      ...updatedDestinations[index].photos,
      ...files,
    ];
    setDestinations(updatedDestinations);
  };

  const handleStoryChange = (e, index) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[index].story = e.target.value;
    setDestinations(updatedDestinations);
  };

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
      >
        <input
          type="text"
          value={newDestination.name}
          onChange={(e) =>
            setNewDestination({ ...newDestination, name: e.target.value })
          }
          placeholder="Search for a destination"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </Autocomplete>

      <button
        type="button"
        onClick={handleAddDestination}
        className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-500 transition duration-200 mt-2"
      >
        Add Destination
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2 mt-4">
        {destinations.map((destination, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded-md shadow">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-gray-800">{destination.name}</strong>
                <br />
                <span className="text-gray-600">
                  {formatDate(destination.startDate)} -{" "}
                  {formatDate(destination.endDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-auto">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e, index)}
                  className="hidden"
                  id={`photo-upload-${index}`}
                />
                <label
                  htmlFor={`photo-upload-${index}`}
                  className="cursor-pointer text-blue-600 flex items-center"
                >
                  <img
                    src="/add_photo.svg"
                    alt="Add Photos"
                    className="w-5 h-5 mr-2"
                  />
                </label>
              </div>
            </div>

            {/* Story - Toggle between paragraph and textarea */}
            {editingStoryIndex === index ? (
              <textarea
                className="w-full mt-2 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-50 shadow-sm text-gray-800 resize-none placeholder-gray-400 hover:border-gray-400 transition duration-200"
                placeholder="Add a story..."
                value={destination.story}
                onChange={(e) => handleStoryChange(e, index)}
                onBlur={() => setEditingStoryIndex(null)} // Switch back to paragraph when blurred
                autoFocus // Automatically focus when toggling to edit mode
              ></textarea>
            ) : (
              <p
                className={`w-full mt-2 text-gray-700 ${
                  destination.story ? "cursor-pointer" : "text-gray-400"
                }`}
                onClick={() => setEditingStoryIndex(index)} // Switch to textarea when clicked
              >
                {destination.story
                  ? `${destination.story.substring(0, 100)}${destination.story.length > 100 ? "..." : ""}`
                  : "Share a story..."}
              </p>
            )}

            {/* Display Photo Previews */}
            <div className="mt-3 flex space-x-2">
              {destination.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(photo)}
                  alt={`destination-photo-${idx}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DestinationList;
