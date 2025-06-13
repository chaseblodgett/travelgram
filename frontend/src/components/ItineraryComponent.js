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
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl max-w-xl mx-auto mt-10 border border-gray-800">
      <ul className="space-y-3 mb-6">
        {itineraryList.map((item, index) => (
          <li
            key={index}
            className="bg-gray-800 px-4 py-3 rounded-xl border border-purple-600 text-sm sm:text-base shadow-sm"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new itinerary item"
          className="flex-grow px-4 py-2.5 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-700"
        />
        <button
          onClick={addItineraryItem}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
        >
          Add
        </button>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 rounded-xl transition shadow-md"
      >
        Save Itinerary
      </button>
    </div>

  );
};

export default ItineraryComponent;
