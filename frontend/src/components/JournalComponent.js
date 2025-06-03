import React, { useState } from "react";

const JournalComponent = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      setJournalEntries((prevEntries) => [...prevEntries, newEntry]);
      setNewEntry("");
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
        {journalEntries.length !== 0 &&
          (journalEntries.map((entry, index) => (
            <div
              key={index}
              style={{
                background: "#f9f9f9",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalComponent;
