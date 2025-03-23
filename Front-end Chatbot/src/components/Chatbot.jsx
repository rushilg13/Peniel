import React, { useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chatbot = () => {
  const [user_id, setUserId] = useState("user_123"); // Default user ID
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [rulesFile, setRulesFile] = useState(null);
  const [transactionsFile, setTransactionsFile] = useState(null);
  const [results, setResults] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Ignore empty messages

    try {

      const res = await axios.post("http://127.0.0.1:8000/chat", {
        user_id: user_id,
        message: message,

      });
      setConversation((prev) => [
        ...prev,
        { sender: "user", text: message },
        { sender: "bot", text: res.data.response },
      ]);
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "bot", text: "Error processing your request." },
      ]);
    }
  };

  const handleUploadRules = async () => {
    if (!rulesFile) return;

    const formData = new FormData();
    formData.append("file", rulesFile);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload-rules", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setConversation((prev) => [
        ...prev,
        { sender: "bot", text: `Rules extracted: ${res.data.rules}` },
      ]);
    } catch (error) {
      console.error("Error uploading rules file:", error);
    }
  };

  const handleUploadTransactions = async () => {
    if (!transactionsFile) return;

    const formData = new FormData();
    formData.append("file", transactionsFile);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload-transactions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data.results);

      // Set pie chart data
      setPieChartData({
        labels: ["Flagged", "Non-Flagged"],
        datasets: [
          {
            data: [res.data.flagged_count, res.data.non_flagged_count],
            backgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      });

      // Set bar chart data
      setBarChartData({
        labels: Object.keys(res.data.rule_counts),
        datasets: [
          {
            label: "Number of Transactions",
            data: Object.values(res.data.rule_counts),
            backgroundColor: "#4BC0C0",
          },
        ],
      });
    } catch (error) {
      console.error("Error uploading transactions file:", error);
    }
  };

  const handleResetSession = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/reset", { user_id: user_id });
      setConversation([]); // Clear conversation history
    } catch (error) {
      console.error("Error resetting session:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Compliance Chatbot</h1>

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

      {/* Text Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.inputField}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          Send
        </button>
      </div>

      {/* File Uploads */}
      <div style={styles.uploadContainer}>
        <div style={styles.fileUpload}>
          <input
            type="file"
            onChange={(e) => setRulesFile(e.target.files[0])}
            style={styles.fileInput}
          />
          <button onClick={handleUploadRules} style={styles.uploadButton}>
            Upload Rules
          </button>
        </div>
        <div style={styles.fileUpload}>
          <input
            type="file"
            onChange={(e) => setTransactionsFile(e.target.files[0])}
            style={styles.fileInput}
          />
          <button onClick={handleUploadTransactions} style={styles.uploadButton}>
            Upload Transactions
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button onClick={handleResetSession} style={styles.resetButton}>
        Reset Session
      </button>

      {/* Charts */}
      {pieChartData && (
        <div style={styles.chartContainer}>
          <h2>Percentage of Flagged Transactions</h2>
          <Pie data={pieChartData} />
        </div>
      )}
      {barChartData && (
        <div style={styles.chartContainer}>
          <h2>Transactions by Rule Subsection</h2>
          <Bar data={barChartData} />
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    height:"100vh",
    width: "30%", // Chatbot takes up 30% of the screen
    left: "0px",
    maxWidth: "800px",
    margin: "0px",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
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
    marginRight:"auto",
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
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  resetButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginBottom: "20px",
  },
  chartContainer: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
};


export default Chatbot;