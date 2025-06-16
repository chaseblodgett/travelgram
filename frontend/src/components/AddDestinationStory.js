import React, { useState } from "react";

const AddDestinationStory = ({ destination, onSaveStory, onClose }) => {
  const [story, setStory] = useState(destination.story || "");

  const handleSave = () => {
    console.log(story);
    onSaveStory(story);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center font-sans">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold">Add a Story for {destination.name}</h2>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="w-full mt-4 p-2 border rounded-md"
          rows="6"
          placeholder="Write your story..."
        />
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDestinationStory;
