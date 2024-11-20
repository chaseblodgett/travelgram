// components/JournalComponent.js
import React, { useState } from "react";

const JournalComponent = ({ place }) => {
  const [journalText, setJournalText] = useState("");
  const [image, setImage] = useState(null);

  const handleJournalSubmit = () => {
    // Handle saving the journal entry, e.g., send to backend
  };

  return (
    <div>
      <h2>Write a Journal Entry for {place.name}</h2>
      <textarea
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="Write your journal here"
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleJournalSubmit}>Save Journal</button>
    </div>
  );
};

export default JournalComponent;
