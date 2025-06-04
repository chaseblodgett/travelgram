import React, { useState, useEffect } from "react";
// import { Destination } from "../../../backend/server";

const JournalComponent = (destinationId) => {
  const [journalEntry, setJournalEntry] = useState("");
  const [journalTimestamp, setJournalTimestamp] = useState(null);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    let isCurrent = true; 
  
    const fetchJournal = async () => {
      try {
        const response = await fetch(`/api/journal?destinationId=${destinationId}`, {
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
  
    if (destinationId) {
      fetchJournal();
    }
  
    return () => {
      isCurrent = false;
    };
  }, [destinationId]);
  

  const handleAddEntry = async () => {

    try{
      console.log(newEntry);
      const formData = {
        destinationId: destinationId,
        content : newEntry,
        date: new Date()
      }
      
      console.log(formData);
      const response = await fetch("/api/journal" ,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save journal.");
      }
      else{
        setJournalEntry(newEntry);
        setNewEntry("");
      }
    }
    catch{
      throw new Error("Failed to save journal.")
    }
    
  };

  return (
    <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
      <h3>Journal</h3>

      <textarea
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        placeholder="Share a story..."
        rows={4}
        style={{
          width: "90%",
          borderRadius: "8px",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button
        onClick={handleAddEntry}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Add Entry
      </button>

      <div
        style={{
          marginTop: "20px",
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {journalEntry ? (
          <div
            style={{
              background: "#f9f9f9",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            {journalEntry}
          </div>
        ) : (
          <p style={{ color: "#888" }}>No journal entry yet.</p>
        )}
      </div>
    </div>
  );
};

export default JournalComponent;
