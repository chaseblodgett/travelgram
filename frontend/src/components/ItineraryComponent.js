import React, { useEffect, useState } from "react";

const ItineraryComponent = ({ bucketListId }) => {
  const [itineraryList, setItineraryList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


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
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
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
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-full md:w-9/10 lg:w-7/8 mx-auto mt-10 font-sans">
      <div className="bg-gray-800 rounded-xl p-4 text-xs space-y-1 mb-6">
        {itineraryList.map((item, index) => (
          <div key={index} className="text-left">
            - {item}
          </div>
        ))}
      </div>

      {showSuccessMessage && (
      <div className="mb-2 text-center text-sm font-medium text-green-400">
        Saved Successfully!
      </div>
)}

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new itinerary item"
          className="flex-grow px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-700 text-xs"
        />
        <button
          onClick={addItineraryItem}
          className="p-2 bg-gray-800 cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 rounded-lg transition"
        >
          <img src="/add.svg" alt="Add" className="w-4 h-4" />
        </button>
        <button
          onClick={handleSave}
          className="p-2 bg-gray-800 cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 rounded-lg transition"
        >
          <img src="/share_purple.svg" alt="Save" className="w-4 h-4" />
        </button>
      </div>
    </div>


  );
};

export default ItineraryComponent;
