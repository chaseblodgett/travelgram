import React, { useState, useEffect, useRef } from "react";
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
  const [visibleCount, setVisibleCount] = useState(10);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);


  useEffect(() => {
    if (!friend) return;

    const newSocket = io("http://localhost:8080"); 
    setSocket(newSocket); 

    const roomId = [friend.id, userId].sort().join("_");
    newSocket.emit("join", roomId);

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

    // if (!loading && messages.length > 0) {
    //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }

    return () => {
      newSocket.emit("leave", roomId); 
      newSocket.off("receive_message", handleMessageReceive); 
      newSocket.disconnect(); 
    };
  }, [friend, userId, messages]);

  const handleLoadMore = () => {
    const container = containerRef.current;
    const previousScrollHeight = container.scrollHeight;
  
    setVisibleCount((prev) => prev + 20);
  
    // setTimeout(() => {
    //   const newScrollHeight = container.scrollHeight;
    //   container.scrollTop = newScrollHeight - previousScrollHeight;
    // }, 0);
  };  


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
    <div className="p-4 bg-gray-900 text-white overflow-y-auto min-h-screen font-sans">
      <div className="flex items-center mb-3">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mr-3 pl-3 p-2 bg-gray-800 cursor-pointer opacity-70 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 rounded-lg transition text-sm"
        >
          <img src="/arrow_back.svg" alt="Add" className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-purple-400">Chat with {friend.name}</h1>
      </div>
  
      {/* Message history */}
      <div
        className="bg-gray-800 p-3 rounded-md max-h-[500px] overflow-y-auto mb-3 border border-gray-800"
        ref={containerRef}
      >
        {!loading && messages.length > visibleCount && (
          <div className="text-center mb-2">
            <button
              onClick={handleLoadMore}
              className="text-xs text-purple-400 underline hover:text-purple-300"
            >
              Load more messages
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full px-4">
          {loading ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            messages.slice(-visibleCount).map((message, index) => {
              const isOwnMessage = message.sender._id === userId;
              return (
                <div
                  key={index}
                  className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg text-sm max-w-[70%] break-words ${
                      isOwnMessage
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-gray-700 text-gray-100 rounded-bl-none"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })
          )}
        </div>


        <div ref={messagesEndRef}/>
      </div>

  
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-2 pt-2 py-2 bg-gray-800 cursor-pointer opacity-80 hover:opacity-100 hover:animate-bounce-once-grow hover:scale-115 rounded-lg transition text-sm"
        >
          <img src="/share_purple.svg" alt="Add" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
  
};

export default Messages;
