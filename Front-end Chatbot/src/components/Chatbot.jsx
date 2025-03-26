import React, { useState } from "react";
import axios from "axios";
import ChartsAndTable from "./ChartsAndTable";
import WelcomePage from "./WelcomePage";
import attachLogo from "../assets/images/attachLogo.png";


const Chatbot = () => {
  const [user_id, setUserId] = useState("user_123"); // Default user ID
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [rulesFile, setRulesFile] = useState(null);
  const [transactionsFile, setTransactionsFile] = useState(null);
  const [results, setResults] = useState([]);
  const [attachedFile, setAttachedFile] = useState(null); // State for the attached file
  const fileInputRef = React.useRef(null); // Ref for the hidden file input

  const handleSendMessage = async () => {
    if (!message.trim() && !attachedFile) return; // Ignore if no message or file is provided
  
    const formData = new FormData();
    formData.append("user_id", user_id);
    if(message.trim())
      formData.append("message", message);
    if (attachedFile) {
      formData.append("file", attachedFile); // Attach the file if provided
    }
    setConversation((prev) => [
      ...prev,
      { sender: "user", text: message || attachedFile.name },
    ]);
    setMessage(""); // Clear input after sending
    try {
      const res = await axios.post("http://127.0.0.1:8000/upload-rules", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setConversation((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]);
      setAttachedFile(null); // Clear the attached file after sending
      if (res.data.df)
        setResults(res.data.df);
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "bot", text: "Error processing your request." },
      ]);
    }
  };


  const handleUploadDataset = async () => {
    if (!transactionsFile) return;

    const formData = new FormData();
    formData.append("file", transactionsFile);

    setConversation((prev) => [
      ...prev,
      { sender: "user", text: transactionsFile.name },
    ]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload-dataset", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      res.data && res.data.reply ? setConversation((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]) : setConversation((prev) => [
        ...prev,
        { sender: "bot", text: "Error uploading Data" },
      ]);
    } catch (error) {
      console.error("Error uploading transactions file:", error);
    }
  };

  const handleResetSession = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/reset", { user_id: user_id });
      setConversation([]); // Clear conversation history
      setResults(null);
    } catch (error) {
      console.error("Error resetting session:", error);
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Chatbot Container */}
      <div style={styles.chatbotContainer}>
        <h1 style={styles.header}>CompliSense</h1>
        <h4 style={styles.h4header}>Intelligent Compliance, Simplified!</h4>

        {/* Chat Window */}
        <div style={styles.chatWindow}>
          {conversation.map((msg, index) => (
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
  <div style={styles.inputWithButton}>
    {/* File Input */}
    <button onClick={() => fileInputRef.current.click()} style={styles.attachButton}>
    {attachedFile ? attachedFile.name : (<img src={attachLogo} alt="Attach Rules" title="Attach Rules" style={styles.attachLogo} />)} 
    </button>
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={(e) => setAttachedFile(e.target.files[0])}
    />
    {/* Text Input */}
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message..."
      style={styles.inputFieldWithButton}
      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
    />
    <button onClick={handleSendMessage} style={styles.sendButton}>
      Send
    </button>
  </div>
</div>

        {/* File Uploads */}
        <div style={styles.uploadContainer}>
          <div style={styles.fileUpload}>
            <input
              type="file"
              onChange={(e) => setTransactionsFile(e.target.files[0])}
              style={styles.fileInput}
            />
            <button onClick={handleUploadDataset} style={styles.uploadButton}>
              Upload Data
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <button onClick={handleResetSession} style={styles.resetButton}>
          Reset Session
        </button>
      </div>

      {results && results.length > 0 ? ( 

        <ChartsAndTable res={results} />
       ) : (
        <WelcomePage />
      )}
    </div>
  );
};

// Styles
const styles = {
  mainContainer: {
    display: "flex",
    height: "110vh",
    width: "100%",
  },
  chatbotContainer: {
    width: "30%",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  h4header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  chatWindow: {
    height: "300px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: "#fff",
  },
  userMessage: {
    textAlign: "right",
    margin: "5px 0",
    padding: "10px",
    backgroundColor: "#d1e7dd",
    borderRadius: "10px",
    maxWidth: "70%",
    marginLeft: "auto",
  },
  botMessage: {
    textAlign: "left",
    margin: "5px 0",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "10px",
    maxWidth: "70%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  inputWithButton: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "5px",
    overflow: "hidden",
  },
  attachButton: {
    padding: "10px",
    border: "none",
    backgroundColor: "#f0f0f0",
    color: "#333",
    cursor: "pointer",
    fontSize: "16px",
    borderLeft: "1px solid #ddd", // Add a separator between the input and the button
    borderRight: "1px solid #ddd", // Add a separator between the + button and the Send button
  },
  attachLogo: {
    width: "20px", // Adjust the size of the logo
    height: "20px",
  },
  inputFieldWithButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  
  sendButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#059e40",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    borderLeft: "1px solid #ddd", // Add a separator between the input and button
  },
  inputField: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  fileUpload: {
    display: "flex",
    gap: "10px",
  },
  fileInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  uploadButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#059e40",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  resetButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#cc020d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginBottom: "20px",
  }
};

export default Chatbot;