// components/BucketListComponent.js
import React, { useState } from "react";

const BucketListComponent = () => {
  const [bucketList, setBucketList] = useState([]);
  const [newPlace, setNewPlace] = useState("");

  const handleAddPlace = () => {
    setBucketList([...bucketList, { name: newPlace }]);
    setNewPlace("");
  };

  return (
    <div>
      <h2>My Bucket List</h2>
      <input
        type="text"
        value={newPlace}
        onChange={(e) => setNewPlace(e.target.value)}
        placeholder="Enter a place"
      />
      <button onClick={handleAddPlace}>Add</button>
      <ul>
        {bucketList.map((place, index) => (
          <li key={index}>{place.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default BucketListComponent;
