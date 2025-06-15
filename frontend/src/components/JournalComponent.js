import React, { useState, useEffect, useRef } from "react";
// import { Destination } from "../../../backend/server";

const JournalComponent = ({destination, isFriendJournal, profilePicture, profileName}) => {
  const [journalEntry, setJournalEntry] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const saveClickedRef = useRef(false);


  useEffect(() => {
    let isCurrent = true; 

    const fetchJournal = async () => {
      try {
        
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
    console.log("Setting val to true");
    setEditValue(journalEntry);
    setIsEditing(true);
  }
  
  const handleSave = async () => {
    console.log("Saving journal with content:", editValue);
    saveClickedRef.current = true;
  
    try {
      const formData = {
        destinationId: destination,
        content: editValue,
        date: new Date(),
      };
  
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("API error response:", data);
        throw new Error(data.message || "Failed to save journal");
      }
  
      setJournalEntry(editValue);
      setIsEditing(false);
      console.log("set editing to false 1");
    } catch (error) {
      console.error("Failed to save journal:", error.message);
    }
    finally {
      setTimeout(() => {
        saveClickedRef.current = false;
      }, 150);
    }
  };
  

  const handleBlur = () => {
    setTimeout(() => {
      if (saveClickedRef.current) return;
      setIsEditing(false);
      setEditValue(journalEntry);
    }, 300); 
  };
  

  return (
    <div className="w-full text-center mt-8">
      {/* <h3 className="text-2xl font-semibold text-white mb-4">Journal</h3> */}
  
      {/* Journal box */}
      <div className="w-full md:w-12/13 lg:w-9/10 mx-auto border border-gray-700 bg-gray-900 rounded-xl p-4 min-h-[120px] text-left shadow-lg">
  
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-700 shadow-md"
          />
          <span className="text-sm font-medium text-gray-300">{profileName}</span>
        </div>

        {!isFriendJournal && (
          <img
            src={isEditing ? "/share_purple.svg" : "/edit_purple.svg"}
            alt={isEditing ? "Save" : "Edit"}
            onClick={isEditing ? handleSave : handleEditClick}
            className="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 transition transform"
          />
        )}
      </div>

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
            <span className="text-gray-500 italic">No story shared yet.</span>
          )}
        </p>
      )}
    </div>

    </div>
  );
  
};

export default JournalComponent;
