import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { io } from "socket.io-client";

const Messages = ({ userId, setAllFriendMarkers }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { friend } = location.state || {};
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    if (!friend) return;

    const newSocket = io("http://localhost:8080"); 
    setSocket(newSocket); 

    const roomId = [friend.id, userId].sort().join("_");
    newSocket.emit("join", roomId);

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/conversation/${roomId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data.conversation.messages);
        setConversation(data.conversation);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchMessages();

    const handleMessageReceive = (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: message.from,
          content: message.text,
          timestamp: message.timestamp,
        },
      ]);
    };

    newSocket.on("receive_message", handleMessageReceive);

    return () => {
      newSocket.emit("leave", roomId); 
      newSocket.off("receive_message", handleMessageReceive); 
      newSocket.disconnect(); 
    };
  }, [friend, userId]);


  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const message = {
      content: newMessage,
      conversation: conversation._id,
      sender: {
        _id: userId,
        name: "YourNameHere",
        email: "YourEmailHere",
      },
      timestamp: new Date().toISOString(),
    };

    const socketMessage = {
      to: friend.id,
      from: userId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const roomId = [friend.id, userId].sort().join("_");
    socket.emit("send_message", socketMessage);

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");
  };

  const handleBack = () => {
    if (socket) {
      socket.disconnect(); 
    }
    setAllFriendMarkers();
    navigate(-1); 
  };

  if (!friend) {
    return <div>No friend selected to message.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mr-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold">Chat with {friend.name}</h1>
      </div>

      {/* Message history */}
      <div className="bg-gray-100 p-4 rounded-md h-96 overflow-y-auto mb-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.sender._id === userId ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-md ${
                  message.sender._id === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
