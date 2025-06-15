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
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-purple-400">My Friends</h1>
        <Link
          to="/addFriends"
          className="flex items-center bg-transparent p-1.5 rounded-full cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-110 transition transform"
        >
          <img
            src="/add_friend.svg"
            alt="Add Friends"
            className="h-5 w-5"
          />
        </Link>
      </div>
  
      {friendRequests && friendRequests.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-medium text-purple-300 mb-2">Friend Requests</h2>
          <ul className="space-y-3">
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between bg-gray-800 p-3 rounded-md shadow-sm"
              >
                <span className="text-base font-medium">{request.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request._id)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition text-sm"
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
        <p className="text-gray-400 text-sm">You have no friends yet. Start by adding some!</p>
      ) : (
        <ul className="space-y-3">
          {allFriends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between bg-gray-800 p-3 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={friend.picture || '/default-avatar.jpg'}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-base font-medium">{friend.name}</span>
              </div>
              <button
                onClick={() => handleMessage(friend)}
                className="p-1.5 rounded-full hover:scale-110 transition transform hover:opacity-100 opacity-80 hover:animate-bounce-once-grow"
              >
                <img
                  src="/chat.svg"
                  alt="Chat"
                  className="h-4 w-4"
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
