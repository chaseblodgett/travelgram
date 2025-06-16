import React, { useState, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";

const BucketListComponent = ( {isLoaded, handleChange}) => {
  const [bucketList, setBucketList] = useState([]);
  const [newPlace, setNewPlace] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [newlyAddedItem, setNewlyAddedItem] = useState(null);

  
  useEffect(() => {
    axios
      .get("/api/bucketlist")
      .then((response) => {
        const unvisitedItems = response.data.filter((item) => !item.isVisited);
        setBucketList(unvisitedItems);
      })
      .catch((error) => {
        console.error("Error fetching bucket list", error);
      });
  }, []);

  const handlePlaceChange = () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      setNewPlace(place.formatted_address);
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  const handleAddPlace = async () => {
    if (!newPlace || !latitude || !longitude) {
      alert("Please select a valid place.");
      return;
    }
  
    try {
     
      const response = await axios.post("/api/bucketlist", {
        place: newPlace,
        latitude,
        longitude,
        isVisited: false,
      });
      
      
      setBucketList((prevList) => [
        ...prevList, 
        response.data.data, 
      ]);
      handleChange(response.data.data);
      setNewlyAddedItem(response.data.data._id);
  
      setTimeout(() => {
        setNewlyAddedItem(null);
      }, 1000);
  
      setNewPlace("");
      setLatitude(null);
      setLongitude(null);
  
    } catch (error) {
      console.error("Error adding bucket list item", error);
    }
  };
  
  
  const markAsVisited = async (id) => {
    setRemovingItem(id);
    
    setTimeout(() => {
      setBucketList((prevList) => prevList.filter((item) => item._id !== id));
    }, 900);

    const item = bucketList.find((item) => item._id === id);
    if (item) {
      handleChange(item);
    } else {
      console.warn("Item not found");
    }
  
    try {
      
      const response = await fetch(`/api/bucketlist/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error deleting bucket list item");
      }

      console.log("Item successfully deleted:", data);
  
    } catch (error) {
      console.error("Error deleting bucket list item", error);
  
      setBucketList((prevList) => [...prevList, { _id: id, place: "Unknown" }]);
    }
  };
  
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="container mx-auto p-3 bg-gray-900 min-h-screen text-white font-sans">
      <h2 className="text-2xl font-semibold text-left mb-3 px-2 text-purple-400">My Bucket List</h2>
  
      {/* Autocomplete and Button */}
      <div className="flex items-center mb-5 space-x-3">
        <div className="flex-1">
          <Autocomplete
            onLoad={(ref) => setAutocomplete(ref)}
            onPlaceChanged={handlePlaceChange}
          >
            <input
              type="text"
              placeholder="Search for a place"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              className="w-full p-1.5 bg-gray-800 text-white border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            />
          </Autocomplete>
        </div>
  
        <button onClick={handleAddPlace} className="p-2 transition duration-200 hover:scale-105">
          <img
            src="/add_box_light.svg"
            alt="Add to Bucket List"
            className="w-5 h-5"
          />
        </button>
      </div>
  
      {bucketList.length > 0 && (
        <div className="mt-6">
          <ul className="space-y-3">
            {bucketList.map((item) => (
              <li
                key={item._id}
                className={`flex items-center justify-between p-3 border border-gray-700 bg-gray-800 rounded-md shadow-sm ${
                  removingItem === item._id
                    ? "animate-squeeze-slide-out-right"
                    : newlyAddedItem === item._id
                    ? "animate-fade-in-grow"
                    : ""
                }`}
                style={{
                  transition: "transform 0.5s ease, opacity 0.5s ease",
                  opacity: removingItem === item._id ? 0 : 1,
                  transform:
                    removingItem === item._id ? "translateX(100%)" : "translateX(0)",
                }}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-base text-purple-300">{item.place}</h3>
                  <p className="text-xs text-gray-400">{item.description || ""}</p>
                </div>
  
                <button
                  onClick={() => markAsVisited(item._id)}
                  className="transition-transform duration-500 transform hover:scale-105 ml-3"
                >
                  <img
                    src={
                      removingItem === item._id
                        ? "/checkbox_green.svg"
                        : "/checkbox.svg"
                    }
                    alt="Checkbox"
                    className={`w-5 h-5 ${
                      removingItem === item._id ? "rotate-360" : ""
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
  
      {/* If the bucket list is empty */}
      {bucketList.length === 0 && (
        <p className="text-center text-gray-400 mt-4 text-sm">
          Your bucket list is empty. Start adding places!
        </p>
      )}
    </div>
  );
  
}  

export default BucketListComponent;
