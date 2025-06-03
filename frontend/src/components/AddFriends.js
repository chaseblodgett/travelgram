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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Friends</h1>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
      {showResults && results.length === 0 ? (
        <p className="text-gray-600">No results, try searching for a different name.</p>
      ) : (<ul className="space-y-4">
        {results.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow"
          >
            <div className="flex items-center space-x-4">
                
                <img
                  src={user.picture || '/default-avatar.jpg'} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                />
                <span className="text-lg font-semibold">{user.name}</span>
              </div>
            
            <button
              onClick={() => handleAddFriend(user._id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Add
            </button>
          </li>
        ))}
      </ul>)}
    </div>
  );
};

export default AddFriends;
