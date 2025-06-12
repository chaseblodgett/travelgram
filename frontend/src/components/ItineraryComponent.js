import React, { useEffect, useState } from "react";

const ItineraryComponent = ({ bucketListId }) => {
  const [itineraryList, setItineraryList] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {

      try {
        const response = await fetch(`/api/itinerary/${bucketListId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch itinerary.");
        }

        setItineraryList(data.itinerary);
      } catch (error) {
        console.error("Error fetching itinerary: ", error.message);
      }
    };

    fetchItinerary();
  }, [bucketListId]);

  const handleSave = async () => {
    
    try {
      const formData = {
        bucketListId,
        itinerary: itineraryList,
      };
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save itinerary");
      }

      setNewItem("");
    } catch (error) {
      console.error("Failed to save itinerary:", error.message);
    }
  };

  const addItineraryItem = () => {
    if (newItem.trim()) {
      setItineraryList([...itineraryList, newItem.trim()]);
      setNewItem("");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Itinerary</h2>
      
      <ul className="space-y-2 mb-6">
        {itineraryList.map((item, index) => (
          <li
            key={index}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-purple-500"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg bg-gray-700 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Add new itinerary item"
        />
        <button
          onClick={addItineraryItem}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          Add
        </button>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition"
      >
        Save Itinerary
      </button>
    </div>
  );
};

export default ItineraryComponent;
