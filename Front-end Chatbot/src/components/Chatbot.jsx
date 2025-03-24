import React, { useState } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2"; // Import Line chart
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { Table, Tabs } from "antd"; // Import Ant Design Table
import "./Chatbot.css";

// Register Chart.js components
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement, // Required for Line Chart
  LineElement // Required for Line Chart
);

const { TabPane } = Tabs;

const Chatbot = () => {
  const [user_id, setUserId] = useState("user_123"); // Default user ID
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [rulesFile, setRulesFile] = useState(null);
  const [transactionsFile, setTransactionsFile] = useState(null);
  const [results, setResults] = useState([]);

  // Pie Chart Data
  const [pieChartData, setPieChartData] = useState({
    labels: [ "Non-Flagged","Flagged for Operational Risk", "Flagged for Regulatory Risk"],
    datasets: [
      {
        data: [30, 25, 45], 
        backgroundColor: ["#059e40","#d14c04", "#cc020d"]//green, orange, red
      },
    ],
  });

  const pieChartOptions = {
  plugins: {
    legend: {
      align: "start"
    }
  }
  };

  // Bar Chart Data
  const [barChartData, setBarChartData] = useState({
    labels: ["A-1", "A-2", "A-3", "A-4", "A-5", "A-6", "A-7", "A-8", "A-9", "A-10"],
    datasets: [
      {
        label: "Non-Flagged",
        data: [12, 19, 8, 15, 10, 14, 9, 7, 13, 11],
        backgroundColor: "#059e40",
      },
      {
        label: "Flagged for Operational Risk",
        data: [5, 10, 4, 8, 6, 7, 5, 3, 6, 5],
        backgroundColor: "#d14c04",
      },
      {
        label: "Flagged for Regulatory Risk",
        data: [3, 6, 2, 4, 3, 5, 2, 1, 4, 3],
        backgroundColor: "#cc020d",
      },
    ],
  });

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top", // Position the legend at the top
        align: "start"
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`; // Show dataset label and value in the tooltip
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Enable stacking on the x-axis
        title: {
          display: true,
          text: "Sub-Schedules", // Label for the x-axis
        },
      },
      y: {
        stacked: true, // Enable stacking on the y-axis
        title: {
          display: true,
          text: "Number of Transactions", // Label for the y-axis
        },
      },
    },
  };

  // Line Chart Data
  const [lineChartData, setLineChartData] = useState({
    labels: ["A-1", "A-2", "A-3", "A-4", "A-5", "A-6", "A-7", "A-8", "A-9", "A-10"],
    datasets: [
      {
        label: "Average Risk Score",
        data: [65, 59, 80, 81, 56, 55, 40, 32, 45, 55], // Sample Data
        borderColor: "#cc020d",
        fill: false,
      },
    ],
  });

  //regulatory table data
  const [regulatoryTableData, setRegulatoryTableData] = useState({
    columns: [
      {
        title: "Transaction ID",
        dataIndex: "transactionID",
        key: "transactionID",
      },
      {
        title: "Subschedule",
        dataIndex: "subschedule",
        key: "subschedule",
      },
      {
        title: "Failing Field",
        dataIndex: "field",
        key: "field",
      },
      {
        title: "Reason for Failure",
        dataIndex: "reason",
        key: "reason",
      },
    ],
    data: [
      {
        key: "1",
        transactionID: 66996885,
        subschedule: "Sub-Schedule A-1",
        field: "Amount",
        reason: "Exceeds limit",
      },
      {
        key: "2",
        transactionID: 66996886,
        subschedule: "Sub-Schedule A-2",
        field: "Date",
        reason: "Invalid format",
      },
      {
        key: "3",
        transactionID: 66996887,
        subschedule: "Sub-Schedule A-3",
        field: "Account Number",
        reason: "Missing value",
      },
      {
        key: "4",
        transactionID: 66996888,
        subschedule: "Sub-Schedule A-4",
        field: "Currency",
        reason: "Unsupported currency",
      },
      {
        key: "5",
        transactionID: 66996889,
        subschedule: "Sub-Schedule A-5",
        field: "Description",
        reason: "Too long",
      },
      {
        key: "6",
        transactionID: 66996885,
        subschedule: "Sub-Schedule A-6",
        field: "Amount",
        reason: "Exceeds limit",
      },
    ],
  })

  //operational table data
  const [operationalTableData, setOperationalTableData] = useState({
    columns: [
      {
        title: "Transaction ID",
        dataIndex: "transactionID",
        key: "transactionID",
      },
      {
        title: "Subschedule",
        dataIndex: "subschedule",
        key: "subschedule",
      },
      {
        title: "Failing Field",
        dataIndex: "field",
        key: "field",
      },
      {
        title: "Reason for Failure",
        dataIndex: "reason",
        key: "reason",
      },
      {
        title: "Steps for Remediation",
        dataIndex: "remediation",
        key: "remediation",
      },
    ],
    data: [
      {
        key: "1",
        transactionID: 12345671,
        subschedule: "Sub-Schedule A-10",
        field: "Amount",
        reason: "Exceeds limit",
      },
      {
        key: "2",
        transactionID: 12345672,
        subschedule: "Sub-Schedule A-9",
        field: "Date",
        reason: "Invalid format",
      },
      {
        key: "3",
        transactionID: 12345673,
        subschedule: "Sub-Schedule A-8",
        field: "Account Number",
        reason: "Missing value",
      },
      {
        key: "4",
        transactionID: 12345674,
        subschedule: "Sub-Schedule A-7",
        field: "Currency",
        reason: "Unsupported currency",
      },
      {
        key: "5",
        transactionID: 12345675,
        subschedule: "Sub-Schedule A-6",
        field: "Description",
        reason: "Too long",
      },
      {
        key: "6",
        transactionID: 12345676,
        subschedule: "Sub-Schedule A-5",
        field: "Amount",
        reason: "Exceeds limit",
      },
    ],
  })

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
        labels: [ "Non-Flagged","Flagged for Operational Risk", "Flagged for Regulatory Risk"],
        datasets: [
          {
            data: [res.data.non_flagged_count, res.data.operational_flagged_count, res.data.regulatory_flagged_count],
            backgroundColor: ["#059e40", "#d14c04", "#cc020d"]//green, orange, red
          },
        ],
      });

      // Set bar chart data
      setBarChartData({
        labels: Object.keys(res.data.transactions_by_sub_schedule),
        datasets: [
          {
            label: "Non-Flagged",
            data: Object.values(res.data.transactions_by_sub_schedule),
            backgroundColor: "#059e40",
          },
          {
            label: "Flagged for Operational Risk",
            data: Object.values(res.data.transactions_by_sub_schedule),
            backgroundColor: "#d14c04",
          },
          {
            label: "Flagged for Regulatory Risk",
            data: Object.values(res.data.transactions_by_sub_schedule),
            backgroundColor: "#cc020d",
          },
        ],
      });

      // Set line chart data
      setLineChartData({
        labels: Object.keys(res.data.average_risk_score_across_subschedules),
        datasets: [
          {
            label: "Average Risk Score",
            data: Object.values(res.data.average_risk_score_across_subschedules), // Example: Transaction counts
            borderColor: "#cc020d",
            fill: false,
          },
        ],
      });

      //set regulatory table data
      setRegulatoryTableData({
        columns: [
          {
            title: "Transaction ID",
            dataIndex: "transactionID",
            key: "transactionID",
          },
          {
            title: "Subschedule",
            dataIndex: "subschedule",
            key: "subschedule",
          },
          {
            title: "Failing Field",
            dataIndex: "field",
            key: "field",
          },
          {
            title: "Reason for Failure",
            dataIndex: "reason",
            key: "reason",
          },
        ],
        data: res.data.regulatory_risk_transactions.map((transaction, index) => ({
          key: index + 1, // Unique key for each row
          transactionID: transaction.transactionID,
          subschedule: transaction.subschedule,
          field: transaction.field,
          reason: transaction.reason,
        })),
      });

      //set operational table data
      setOperationalTableData({
        columns: [
          {
            title: "Transaction ID",
            dataIndex: "transactionID",
            key: "transactionID",
          },
          {
            title: "Subschedule",
            dataIndex: "subschedule",
            key: "subschedule",
          },
          {
            title: "Failing Field",
            dataIndex: "field",
            key: "field",
          },
          {
            title: "Reason for Failure",
            dataIndex: "reason",
            key: "reason",
          },
          {
            title: "Steps for Remediation",
            dataIndex: "remediation",
            key: "remediation",
          },
        ],
        data: res.data.operational_risk_transactions.map((transaction, index) => ({
          key: index + 1, // Unique key for each row
          transactionID: transaction.transactionID,
          subschedule: transaction.subschedule,
          field: transaction.field,
          reason: transaction.reason,
          remediation: transaction.remediation,
        })),
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
    <div style={styles.mainContainer}>
      {/* Chatbot Container */}
      <div style={styles.chatbotContainer}>
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
        {/* <div style={styles.inputContainer}>
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
        </div> */}

<div style={styles.inputContainer}>
  <div style={styles.inputWithButton}>
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
      </div>
      <div style={styles.chartsAndTableContainer}>
      {/* Charts Container */}
      <div style={styles.chartsContainer}>
        {pieChartData && (
          <div style={styles.pieChartContainer}>
            <h4>Percentage of Flagged Transactions</h4>
            <Pie data={pieChartData} options={pieChartOptions}/>
          </div>
        )}
        {barChartData && (
          <div style={styles.barChartContainer}>
            <h4>Transactions by Sub-schedule</h4>
              <Bar data={barChartData} options={barChartOptions} />
          </div>
        )}
        {lineChartData && (
          <div style={styles.lineChartContainer}>
            <h4>Average Risk Score across Subschedules</h4>
            <Line data={lineChartData} />
          </div>
        )}
      </div>
      {/* Table Container*/}
      <div style={styles.tableContainer}>
        {
          <Tabs defaultActiveKey="1"
          tabBarStyle={{
            backgroundColor: "#f9f9f9", // Light background color for tabs
            padding: "10px", // Add padding around the tabs
            borderRadius: "10px", // Rounded corners for the tab bar
            border: "1px solid #ddd", // Border around the tab bar
            fontSize: "16px", // Font size for tab labels
            fontWeight: "bold", // Make tab labels bold
          }}
          className="custom-tabs"
          >
          <TabPane tab="Regulatory Risk Transactions" key="1">
            <Table
              columns={regulatoryTableData.columns}
              dataSource={regulatoryTableData.data}
              pagination={{ pageSize:5 }} //Enable pagination
            />
          </TabPane>
          <TabPane tab="Operational Risk Transactions" key="2">
            <Table
              columns={operationalTableData.columns}
              dataSource={operationalTableData.data}
              pagination={{ pageSize:5 }} //Enable pagination
            />
          </TabPane>
        </Tabs>
        }
      </div>
      </div>
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
    backgroundColor: "#007bff",
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
  },
  chartsAndTableContainer: {
    display: "flex",
    flexDirection: "column", // Stack charts and table vertically
    width: "100%",
    padding: "20px",
    gap: "20px", // Add spacing between charts and table
    marginRight: "20px", // Add right margin
  },
  tableContainer: {
    width: "100%", // Ensure the table takes full width
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  chartsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row", // Align charts in a single line
    justifyContent: "space-between", // Space charts evenly
    alignItems: "flex-start", // Align charts at the top
    padding: "20px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd", // Add a separator
  },
  barChartContainer: {
    width: "30%", // Equal width for all charts
    padding: "1px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    height: "300px",
    overflowX: "auto",
    overflowY: "auto",
  },
  lineChartContainer: {
    width: "30% !important", // Equal width for all charts
    padding: "1px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    height: "300px"
  },
  pieChartContainer: {
    width: "30% !important", // Equal width for all charts
    padding: "1px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    height: "300 px",
    overflowX: "auto",
    overflowY: "auto",
  },
};

export default Chatbot;