import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const handleSendMessage = async () => {
    if (!input.trim() && !file) return;

    // Add user message to chat
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Prepare form data
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("message", input);

    try {
      // Send message and file to backend
      const response = await axios.post("http://localhost:8000/upload-rules", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add bot response to chat
      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { text: "Error processing your request.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    }

    // Clear input and file
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
          <div
            key={index}
            style={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.inputField}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.fileInput}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

// Updated Styles
const styles = {
  chatbotContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    border: "2px solid #ff4444",
    borderRadius: "15px",
    backgroundColor: "#ff4444",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  header: {
    backgroundColor: "#ff4444",
    padding: "10px",
    borderRadius: "10px 10px 0 0",
    textAlign: "center",
  },
  appName: {
    color: "#ffcc00",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
  },
  chatWindow: {
    height: "500px",
    overflowY: "auto",
    border: "2px solid #ffcc00",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#ffffff",
  },
  userMessage: {
    textAlign: "right",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#ffcc00",
    borderRadius: "10px",
    color: "#000000",
    maxWidth: "70%",
    marginLeft: "auto",
  },
  botMessage: {
    textAlign: "left",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "10px",
    color: "#000000",
    maxWidth: "70%",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    padding: "12px",
    border: "2px solid #ffcc00",
    borderRadius: "10px",
    fontSize: "16px",
  },
  fileInput: {
    padding: "12px",
    border: "2px solid #ffcc00",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  sendButton: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#ffcc00",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  sendButtonHover: {
    backgroundColor: "#e6b800",
  },
};

export default Chatbot;