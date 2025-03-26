import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2"; // Import Line chart
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { Table, Tabs } from "antd"; // Import Ant Design Table
import "./ChartsAndTable.css";
import { saveAs } from "file-saver";

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

  const ChartsAndTable = ({ res }) => {

    const [pieChartData, setPieChartData] = useState({
      labels: [], // Empty labels
      datasets: [
        {
          data: [], // Empty data array
          backgroundColor: [], // Empty background colors
        },
      ],
    });

    const [barChartData, setBarChartData] = useState({
      labels: [], // Empty labels
      datasets: [
        {
          label: [],
          data: [],
          backgroundColor: [], // Empty background colors
        },
      ],
    });

    const [lineChartData, setLineChartData] = useState({
      labels: [], // Empty labels
      datasets: [
        {
          label: [],
          data: [],
          borderColor: [], // Empty background colors
          fill: null,
        },
      ],
    });

    const [regulatoryRiskDefaultersData, setRegulatoryRiskDefaultersData] = useState({
    });

    const [potentialDefaultersTableData, setPotentialDefaultersTableData] = useState({
    });

    const [compliantTableData, setCompliantTableData] = useState({
    });

    const [errorTableData, setErrorTableData] = useState({
    });

    useEffect(() => {
      const fetchPieChartData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/pie-chart");
          const data = response.data;
  
          // Update pie chart data
          setPieChartData({
            labels: ["Compliant Data", "Regulatory Risk Defaulters", "Potential Compliant Defaulters", "Errors In Data"],
            datasets: [
              {
                data: [
                  data?.cat1 || 0,
                  data?.cat3 || 0,
                  data?.cat2 || 0,
                  data?.cat4 || 0,
                ],
                backgroundColor: ["#059e40", "#d14c04", "#cc020d", "#fcba03"], // Green, Orange, Red, Yellow
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching pie chart data:", error);
        }
      };

      const fetchBarGraph = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/bar-graph");
          const data = response.data.data;

          const labels = Object.keys(data);
          const values = Object.values(data);
          const datasets = [
            {
              label: "Compliant Data",
              data: values.map((value) => value[0] || 0),
              backgroundColor: "#059e40",
            },
            {
              label: "Regulatory Risk Defaulters",
              data: values.map((value) => value[1] || 0),
              backgroundColor: "#d14c04",
            },
            {
              label: "Potential Defaulters",
              data: values.map((value) => value[2] || 0),
              backgroundColor: "#cc020d",
            },
            {
              label: "Errors In Data",
              data: values.map((value) => value[3] || 0),
              backgroundColor: "#fcba03",
            },
          ]
  
          setBarChartData({
            labels: labels,
            datasets: datasets,
          });
        } catch (error) {
          console.error("Error fetching bar graph data:", error);
        }
      };

      const fetchLineChartData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/line-graph");
          const data = response.data.data;
  
          // Update line chart data
          setLineChartData({
            labels: Object.keys(data),
            datasets: [
              {
                label: "Average Risk Score",
                data: Object.values(data),
                borderColor: "#cc020d",
                fill: false,
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching pie chart data:", error);
        }
      };



      const fetchTableData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/tables");
          const data = response.data;

          const compliantData=JSON.parse(data.compliant_df_json || "[]");
          const regRiskDefaulters=JSON.parse(data.reg_risk_def_json || "[]");
          const potentialDefaulters=JSON.parse(data.pot_def_json || "[]");
          const errorsInData=JSON.parse(data.errs_df_json || "[]");

          if (Array.isArray(compliantData)) {
            // Map the transactions into the required format for the table
            const compliant_data = compliantData.map((transaction, index) => {
              return {
              key: index + 1, // Unique key for each row
              transactionID: transaction["Transaction ID"],
              customerID: transaction["Customer ID"],
              subschedule: transaction["PORTFOLIO_ID"],
              riskLabel: transaction["Risk_Label"],
              };
            });
  
            setCompliantTableData({
            columns: [
              {
                title: "Transaction ID",
                dataIndex: "transactionID",
                key: "transactionID",
              },
              {
                title: "Customer ID",
                dataIndex: "customerID",
                key: "customerID",
              },
              {
                title: "Product",
                dataIndex: "subschedule",
                key: "subschedule",
              },
              {
                title: "Risk Score",
                dataIndex: "riskLabel",
                key: "riskLabel",
              },
            ],
            data: compliant_data,
          });
        } else {
          console.error("compliantData is not an array:", compliantData);
        }
          
          if (Array.isArray(regRiskDefaulters)) {
            // Map the transactions into the required format for the table
            const reg_risk_data = regRiskDefaulters.map((transaction, index) => {
              let failingRules = transaction["failing rules"];
              let remediation = transaction["remediation"];
              if (typeof failingRules === "string") {
                try {
                  failingRules = JSON.parse(failingRules.replace(/'/g, '"'));
                } catch (error) {
                  console.error("Error parsing failing rules:", error);
                  failingRules = [];
                }
              }

              //fix
              if (typeof remediation === "string") {
                try {
                  remediation = JSON.parse(remediation.replace(/'/g, '"'));
                } catch (error) {
                  console.error("Error parsing remediation:", error);
                  remediation = [];
                }
              }

              return {
              key: index + 1, // Unique key for each row
              transactionID: transaction["Transaction ID"],
              customerID: transaction["Customer ID"],
              subschedule: transaction["PORTFOLIO_ID"],
              field: Array.isArray(failingRules) ? failingRules.join(", ") : failingRules, // Join array elements with a comma
              reason: Array.isArray(remediation) ? remediation.join(", ") : (remediation!=null? remediation : ["We cannot offer you a solution right now. Thank you for your patience."]), // Join array elements with a comma
              };
            });
  
          setRegulatoryRiskDefaultersData({
            columns: [
              {
                title: "Transaction ID",
                dataIndex: "transactionID",
                key: "transactionID",
              },
              {
                title: "Customer ID",
                dataIndex: "customerID",
                key: "customerID",
              },
              {
                title: "Product",
                dataIndex: "subschedule",
                key: "subschedule",
              },
              {
                title: "Failing Rule(s)",
                dataIndex: "field",
                key: "field",
              },
              {
                title: "Remediation",
                dataIndex: "reason",
                key: "reason",
              },
            ],
            data: reg_risk_data,
          });
        } else {
          console.error("regRiskDefaulters is not an array:", regRiskDefaulters);
        }
    
        if (Array.isArray(potentialDefaulters)) {
          // Map the transactions into the required format for the table
          const pot_def_data = potentialDefaulters.map((transaction, index) => {

            return {
            key: index + 1, // Unique key for each row
            transactionID: transaction["Transaction ID"],
            customerID: transaction["Customer ID"],
            subschedule: transaction["PORTFOLIO_ID"],
            riskscore: transaction["Risk Score"],
            riskLabel: transaction["Risk_Label"],
            };
          });

          setPotentialDefaultersTableData({
          columns: [
            {
              title: "Transaction ID",
              dataIndex: "transactionID",
              key: "transactionID",
            },
            {
              title: "Customer ID",
              dataIndex: "customerID",
              key: "customerID",
            },
            {
              title: "Product",
              dataIndex: "subschedule",
              key: "subschedule",
            },
            {
              title: "Risk Score",
              dataIndex: "riskscore",
              key: "riskscore",
            },
            {
              title: "Risk Label",
              dataIndex: "riskLabel",
              key: "riskLabel",
            },
          ],
          data: pot_def_data,
        });
      } else {
        console.error("potentialDefaulters is not an array:", potentialDefaulters);
      }

      if (Array.isArray(errorsInData)) {
        // Map the transactions into the required format for the table
        const error_data = errorsInData.map((transaction, index) => {
          let missingFields = transaction["missing fields"];
          if (typeof missingFields === "string") {
            try {
              missingFields = JSON.parse(missingFields.replace(/'/g, '"'));
            } catch (error) {
              console.error("Error parsing missing fields:", error);
              missingFields = [];
            }
          }

          return {
          key: index + 1, // Unique key for each row
          transactionID: transaction["Transaction ID"],
          customerID: transaction["Customer ID"],
          subschedule: transaction["PORTFOLIO_ID"],
          field: Array.isArray(missingFields) ? missingFields.join(", ") : missingFields, // Join array elements with a comma
          };
        });

        setErrorTableData({
        columns: [
                {
                  title: "Transaction ID",
                  dataIndex: "transactionID",
                  key: "transactionID",
                },
                {
                  title: "Customer ID",
                  dataIndex: "customerID",
                  key: "customerID",
                },
                {
                  title: "Product",
                  dataIndex: "subschedule",
                  key: "subschedule",
                },
                {
                  title: "Missing Field",
                  dataIndex: "field",
                  key: "field",
                }
              ],
        data: error_data,
      });
    } else {
      console.error("errorsInData is not an array:", errorsInData);
    }
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
  };
  
      fetchPieChartData(); // Call the async function
      fetchBarGraph();
      fetchLineChartData();
      fetchTableData();

    }, []);

    const pieChartOptions = {
      plugins: {
        legend: {
          align: "start"
        }
      }
    };
    
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
            ticks: {
              maxRotation: 45, // Rotate labels for better visibility
              minRotation: 0,
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

      const lineChartOptions = {
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
            ticks: {
              maxRotation: 45, // Rotate labels for better visibility
              minRotation: 0,
            },
          },
          y: {
            stacked: true, // Enable stacking on the y-axis
            title: {
              display: true,
              text: "Score", // Label for the y-axis
            },
          },
        },
      };
    
    
    const handleDownload = async () => {

      console.log(res);
      if (!res ) {
        console.error("No data available to download.");
        return;
      }
    
        
      try {
        const rows = res.split("\n").map((row) => row.split(","));
        const headers = rows[0]; // First row contains headers
        const data = rows.slice(1); // Remaining rows contain data

        // Convert the parsed data back into CSV format
        const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n");
        // Create a Blob object for the CSV data
        const blob = new Blob([csvContent], { type: "text/csv" });
    
        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions_data.csv"; // File name for the downloaded CSV
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        console.log("CSV file downloaded successfully.");
      } catch (error) {
        console.error("Error generating CSV file:", error);
      }
    };

      return (
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
                    <h4>Average Risk Score across Sub-schedules</h4>
                    <Line data={lineChartData} options={lineChartOptions}/>
                  </div>
                )}
              </div>
              {/* Table Container*/}
              <div style={styles.tableContainer} className="tableContainer">
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
                  <TabPane tab={
                    <span style={{
                      color: "#059e40"
                    }}
                    >
                    Compliant Data Repository
                    </span>
                  }
                     key="1">
                      <div className="tabDescription">Compliant, low risk data.</div>
                    <Table
                      columns={compliantTableData.columns}
                      dataSource={compliantTableData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    />
                  </TabPane>
                  <TabPane tab={
                    <span style={{
                      color: "#d14c04"
                    }}
                    >
                    Regulatory Risk Defaulters
                    </span>
                  }
                     key="2">
                      <div className="tabDescription">Data that is not compliant with rules.</div>
                    <Table
                      columns={regulatoryRiskDefaultersData.columns}
                      dataSource={regulatoryRiskDefaultersData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    />
                  </TabPane>
                  <TabPane tab={
                    <span style={{
                      color: "#cc020d"
                    }}
                    >
                    Potential Defaulters
                    </span>
                  }
                     key="3">
                      <div className="tabDescription">Heightened risk compliant data, risk score calculated on a scale of 1-100.</div>
                    <Table
                      columns={potentialDefaultersTableData.columns}
                      dataSource={potentialDefaultersTableData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    />
                  </TabPane>
                  <TabPane tab={
                    <span style={{
                      color: "#fcba03"
                    }}
                    >
                    Errors In Data
                    </span>
                  }
                     key="4">
                      <div className="tabDescription">Data with missing attributes according to the rules.</div>
                    <Table
                      columns={errorTableData.columns}
                      dataSource={errorTableData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    />
                  </TabPane>
                </Tabs>
                }
              </div>
              
                      {/* Download Button should only render after data has been processed */}
                      <button onClick={handleDownload} style={styles.downloadButton}>
                        Download
                      </button>
              </div>
      );

  };

  const styles = {
    chartsAndTableContainer: {
        display: "flex",
        flexDirection: "column", // Stack charts and table vertically
        width: "100%",
        padding: "20px",
        gap: "20px", // Add spacing between charts and table
        marginRight: "20px", // Add right margin
      },
      chartsContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row", // Align charts in a single line
        justifyContent: "space-between", // Space charts evenly
        alignItems: "flex-start", // Align charts at the top
        padding: "1px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd", // Add a separator
      },
      barChartContainer: {
        width: "35%", // Equal width for all charts
        padding: "1px",
        border: "2px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        height: "280px",
        overflowX: "auto",
        overflowY: "auto",
      },
      lineChartContainer: {
        width: "30% !important", // Equal width for all charts
        padding: "1px",
        border: "2px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        height: "280px",
        overflowX: "auto",
        overflowY: "auto",
      },
      pieChartContainer: {
        width: "30% !important", // Equal width for all charts
        padding: "1px",
        border: "2px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        height: "280px",
        overflowX: "auto",
        overflowY: "auto",
      },
      tableContainer: {
        width: "100%", // Ensure the table takes full width
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
      downloadButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#059e40",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
        borderLeft: "1px solid #ddd", // Add a separator between the input and button
        display: "block", // Ensure the button behaves like a block element
        marginLeft: "auto", //Button to the right
        marginRight: "-20px",
      },
  };

  export default ChartsAndTable;