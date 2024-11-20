// components/ForumComponent.js
import React, { useState } from "react";

const ForumComponent = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newTopic, setNewTopic] = useState("");

  const handleAddTopic = () => {
    setDiscussions([...discussions, { topic: newTopic, comments: [] }]);
    setNewTopic("");
  };

  return (
    <div>
      <h2>Travel Discussion Board</h2>
      <input
        type="text"
        value={newTopic}
        onChange={(e) => setNewTopic(e.target.value)}
        placeholder="Start a new discussion"
      />
      <button onClick={handleAddTopic}>Add Topic</button>
      <ul>
        {discussions.map((discussion, index) => (
          <li key={index}>
            <h3>{discussion.topic}</h3>
            <ul>
              {discussion.comments.map((comment, idx) => (
                <li key={idx}>{comment}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumComponent;
