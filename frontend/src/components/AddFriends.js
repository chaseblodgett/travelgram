import React, { useState, useEffect } from "react";

const AddFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [currUserId, setCurrUserId] = useState(null);
  const [currFriends, setCurrFriends] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/getUserFriends', {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error('Failed to get user ID');
        }
  
        const data = await response.json(); 
        setCurrUserId(data.userId); 
        setCurrFriends(data.friends);
      } catch (error) {
        console.error('Error getting current user ID:', error);
      }
    };
  
    fetchUserInfo();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(`/api/search-users?query=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
      const data = await response.json();
      setResults(data.users.filter((elem) =>{
        let inFriends = false;
        for(let i = 0; i < currFriends.length; i++){
          if (currFriends[i].id === elem._id){
            inFriends = true;
          }
        }
        return elem._id !== currUserId && !inFriends;
      }));
      setShowResults(true);
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
    <div className="p-4 bg-gray-900 text-white min-h-screen font-sans">
      <h1 className="text-xl font-semibold mb-3 text-purple-400">Add Friends</h1>
  
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-sm text-white px-2 py-1.5 rounded-md flex-grow focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 text-sm text-white px-3 py-1.5 rounded-md hover:bg-purple-500 transition"
        >
          Search
        </button>
      </div>
  
      {showResults && results.length === 0 ? (
        <p className="text-gray-400 text-sm">No results, try searching for a different name.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.picture || '/default-avatar.jpg'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
  
              <button
                onClick={() => handleAddFriend(user._id)}
                className="bg-green-600 text-sm text-white px-3 py-1.5 rounded-md hover:bg-green-500 transition"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default AddFriends;
