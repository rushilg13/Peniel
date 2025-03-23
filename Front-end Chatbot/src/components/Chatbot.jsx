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
      const response = await axios.post("http://localhost:8000/chat", formData, {
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

const styles = {
  chatbotContainer: {
    width: "30%", // Chatbot takes up 30% of the screen
    height: "85vh", // Full height of the screen
    position: "fixed", // Sticks to the left side
    left: "0",
    top: "0",
    backgroundColor: "#ff4444",
    borderRight: "3px solid #ffcc00",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#ff4444",
    padding: "10px",
    textAlign: "center",
    borderBottom: "2px solid #ffcc00",
  },
  appName: {
    color: "#ffcc00",
    fontSize: "22px",
    fontWeight: "bold",
  },
  chatWindow: {
    flex: 1, // Takes all available space in the chatbot
    overflowY: "auto",
    border: "2px solid #ffcc00",
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
  },
  userMessage: {
    textAlign: "right",
    margin: "10px 10px 10px auto",
    padding: "10px",
    backgroundColor: "#ffcc00",
    borderRadius: "10px",
    color: "#000000",
    maxWidth: "80%",
    marginLeft: "auto",
    marginRight:"auto",
  },
  botMessage: {
    textAlign: "left",
    margin: "10px 0",
    padding: "5px",
    backgroundColor: "#f8d7da",
    borderRadius: "10px",
    color: "#000000",
    maxWidth: "80%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  inputField: {
    padding: "10px",
    border: "2px solid #ffcc00",
    borderRadius: "10px",
    fontSize: "14px",
    width: "95%",
  },
  fileInput: {
    padding: "8px",
    border: "2px solid #ffcc00",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  sendButton: {
    padding: "10px",
    backgroundColor: "#ffcc00",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
  },
};


export default Chatbot;