import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const StatsChart = () => {
  // Sample data for the charts
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [12000, 15000, 14000, 17000, 19000, 22000],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Growth",
        data: [200, 400, 800, 1500, 2500, 4000],
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ["Chrome", "Firefox", "Safari", "Edge", "Others"],
    datasets: [
      {
        data: [60, 15, 10, 10, 5],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.chartContainer}>
        <div style={styles.chartBox}>
          <h3>Sales (Bar Chart)</h3>
          <Bar data={barData} />
        </div>
        <div style={styles.chartBox}>
          <h3>User Growth (Line Chart)</h3>
          <Line data={lineData} />
        </div>
        <div style={styles.chartBox}>
          <h3>Browser Usage (Pie Chart)</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    textAlign: "top-right",
    padding: "10px",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    minHeight: "100vh",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  chartContainer: {
    width: "70%", // Chatbot takes up 30% of the screen
    height: "50%", // Full height of the screen
    position: "fixed", // Sticks to the left side
    left: "400px",
    top: "10px",
    display: "flex",
    justifyContent: "right",
    gap: "20px",
    flexWrap: "wrap",
  },
  chartBox: {
    width: "300px",
    padding: "15px",
    backgroundColor: "#333",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

export default StatsChart;
