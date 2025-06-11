import React, { useState, useEffect } from "react";
// import { Destination } from "../../../backend/server";

const JournalComponent = ({destination, isFriendJournal, profilePicture, profileName}) => {
  const [journalEntry, setJournalEntry] = useState("");
  const [journalTimestamp, setJournalTimestamp] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isCurrent = true; 

    const fetchJournal = async () => {
      try {
        console.log(destination)
    
        const response = await fetch(`/api/journal/${destination}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Failed to get journal.");
        }
  
        if (isCurrent) {
          setJournalEntry(data.content);
          setJournalTimestamp(data.timestamp);
        }
      } catch (error) {
        if (isCurrent) {
          console.error("Error fetching journal:", error.message);
        }
      }
    };
  
    if (destination) {
      fetchJournal();
    }
  
    return () => {
      isCurrent = false;
    };
  }, [destination]);

  const handleEditClick = () =>{
    setEditValue(journalEntry);
    setIsEditing(true);
  }
  
  const handleSave = async () => {

    try{
      
      const formData = {
        destinationId: destination.destination,
        content : editValue,
        date: new Date()
      }
      
      const response = await fetch("/api/journal" ,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save journal");

      setJournalEntry(editValue);
      setIsEditing(false);
    }
    catch{
      throw new Error("Failed to save journal.")
    }
    
  };

  const handleBlur = () => {
    
    setIsEditing(false);
    setEditValue(journalEntry);
  };

  return (
    <div className="w-full text-center mt-8">
      <h3 className="text-2xl font-semibold text-white mb-4">Journal</h3>
  
      {/* Journal box */}
      <div className="w-11/12 md:w-3/4 mx-auto border border-gray-700 bg-gray-900 rounded-xl p-4 min-h-[120px] text-left shadow-lg">
  
      {/* Top row: profile + name + edit button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img
            src={profilePicture}
            alt="Friend"
            className="w-10 h-10 rounded-full border border-gray-700 shadow-md"
          />
          <span className="text-sm font-medium text-gray-300">{profileName}</span>
        </div>

        {/* Edit/Share icon if not a friend's journal */}
        {!isFriendJournal && (
          <img
            src={isEditing ? "/share_purple.svg" : "/edit_purple.svg"}
            alt={isEditing ? "Save" : "Edit"}
            onClick={isEditing ? handleSave : handleEditClick}
            className="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition transform hover:scale-110 hover:animate-bounce"
          />
        )}
      </div>

      {/* Journal entry or textarea */}
      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          rows={4}
          className="w-full border border-gray-700 rounded-lg p-3 bg-gray-800 text-white resize-vertical text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      ) : (
        <p className="whitespace-pre-wrap text-gray-200 text-sm">
          {journalEntry || (
            <span className="text-gray-500 italic">No journal entry yet.</span>
          )}
        </p>
      )}
    </div>

    </div>
  );
  
};

export default JournalComponent;
