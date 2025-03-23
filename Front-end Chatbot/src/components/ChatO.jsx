import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const handleSendMessage = async () => {
    if (!input.trim() && !file) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("message", input);

    try {
      const response = await axios.post("http://localhost:5000/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { text: "Error processing your request.", sender: "bot" }]);
    }

    setInput("");
    setFile(null);
  };

  return (
    <div style={styles.chatbotContainer}>
      <div style={styles.header}>
        <h1 style={styles.appName}>Compliance Chatbot</h1>
      </div>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." style={styles.inputField} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={styles.fileInput} />
        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

// Updated Styles for 30% width
const styles = {
  chatbotContainer: {
    width: "30%", // Chatbot takes up 30% of the screen
    height: "100vh", // Full height of the screen
    position: "fixed", // Sticks to the left side
    left: "0",
    top: "0",
    backgroundColor: "#ff4444",
    borderRight: "2px solid #ffcc00",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    backgroundColor: "#ff4444",
    padding: "10px",
    textAlign: "center",
  },
  appName: {
    color: "#ffcc00",
    fontSize: "20px",
    fontWeight: "bold",
  },
  chatWindow: {
    height: "70vh", // Takes most of the space
    overflowY: "auto",
    border: "2px solid #ffcc00",
    padding: "10px",
    backgroundColor: "#ffffff",
  },
  userMessage: {
    textAlign: "right",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#ffcc00",
    borderRadius: "10px",
    color: "#000000",
  },
  botMessage: {
    textAlign: "left",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "10px",
    color: "#000000",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    position: "absolute",
    bottom: "10px",
    width: "90%",
  },
  inputField: {
    padding: "8px",
    border: "2px solid #ffcc00",
    borderRadius: "5px",
  },
  fileInput: {
    padding: "8px",
    border: "2px solid #ffcc00",
    borderRadius: "5px",
  },
  sendButton: {
    padding: "8px",
    backgroundColor: "#ffcc00",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Chatbot;
