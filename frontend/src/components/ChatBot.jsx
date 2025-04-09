import React, { useState } from "react";
import "./ChatBot.css"; // ✅ Ensure styling for floating chat
import ReactMarkdown from 'react-markdown';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // ✅ Update chat history with user message
    const newChat = [...chatHistory, { sender: "user", text: message }];
    setChatHistory(newChat);
    
    // Send to backend (FastAPI)
    const res = await fetch("http://localhost:8000/chatbot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ message }),
    });

    const data = await res.json();
    setResponse(data.response);
    
    // ✅ Add bot response to chat
    setChatHistory([...newChat, { sender: "bot", text: data.response }]);
    
    setMessage(""); // Clear input field
  };

  return (
    <>
      {/* Chatbot Floating Button */}
      <button className="chatbot-btn" onClick={toggleChat}>
        💬 Chat
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h4>Chatbot</h4>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="chatbot-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
