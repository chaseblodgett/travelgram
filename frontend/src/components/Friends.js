import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Friends = ({ allFriends, friendRequests, onAcceptRequest, onDeclineRequest, setFriendMarkers }) => {
  const navigate = useNavigate();

  const handleMessage = (friend) => {
    setFriendMarkers(friend);
    navigate(`/messages/${friend.id}`, { state: { friend } });
  };

  const handleAcceptRequest = (requestId) => {
    onAcceptRequest(requestId);
  };

  const handleDeclineRequest = (requestId) => {
    onDeclineRequest(requestId);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-400">My Friends</h1>
        <Link
          to="/addFriends"
          className="flex items-center bg-transparent p-2 rounded-full cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 transition transform"
        >
          <img
            src="/add_friend.svg"
            alt="Add Friends"
            className="h-6 w-6 mr-2"
          />
        </Link>
      </div>
  
      {friendRequests && friendRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-300 mb-2">Friend Requests</h2>
          <ul className="space-y-4">
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between bg-gray-800 p-4 rounded-md shadow"
              >
                <span className="text-lg font-semibold">{request.name}</span>
                <div>
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
  
      {allFriends.length === 0 ? (
        <p className="text-gray-400">You have no friends yet. Start by adding some!</p>
      ) : (
        <ul className="space-y-4 rounded-lg" >
          {allFriends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={friend.picture || '/default-avatar.jpg'} 
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-lg font-semibold">{friend.name}</span>
              </div>
              <button
                onClick={() => handleMessage(friend)}
                className="flex items-center justify-center bg-gray-800 text-white p-2 rounded-full cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 transition transform"
              >
                <img
                  src="/chat.svg"
                  alt="Chat"
                  className="h-5 w-5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default Friends;
