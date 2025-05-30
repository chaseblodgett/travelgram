import React, { useState } from "react";

const AddFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(`/api/search-users?query=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
      const data = await response.json();
      setResults(data.users);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await fetch(`/api/add-friend/${userId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to add friend");
      }
      alert("Friend added successfully!");
      setResults(results.filter((user) => user.id !== userId)); 
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Friends</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-2"
        >
          Search
        </button>
      </div>
      <ul className="space-y-4">
        {results.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow"
          >
            <span className="text-lg font-semibold">{user.name}</span>
            <button
              onClick={() => handleAddFriend(user._id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFriends;
