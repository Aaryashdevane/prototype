import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // ✅ Add this import

export default function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/aquabot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "800px", margin: "auto" }}>
      <h1>AquaBot 💧</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask AquaBot anything about water..."
        style={{ padding: "0.5rem", width: "300px" }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
        Send
      </button>

      {response && (
        <div
          style={{
            marginTop: "2rem",
            background: "#f0f8ff",
            padding: "1rem",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>AquaBot:</strong>
          <ReactMarkdown>{response}</ReactMarkdown> {/* ✅ Renders formatted markdown */}
        </div>
      )}
    </div>
  );
}
