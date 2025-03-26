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

    const [regulatoryRiskDefaultersData, setRegulatoryRiskDefaultersData] = useState({
    });

    useEffect(() => {
      const fetchPieChartData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/pie-chart");
          const data = response.data;
  
          // Update pie chart data
          setPieChartData({
            labels: ["Compliant Data", "Regulatory Risk Defaulters", "Potential Defaulters", "Errors In Data"],
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

      const fetchTableData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/tables");
          const data = response.data;

          const compliantData=data.compliant_df_json || [];
          const regRiskDefaulters=JSON.parse(data.reg_risk_def_json || "[]");
          const potentialDefaulters=JSON.parse(data.pot_def_json || "[]");
          const errorsInData=data.errs_df_json || [];

          console.log("regRiskDefaulters: "+regRiskDefaulters);

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
              subschedule: transaction["PORTFOLIO_ID"],
              field: Array.isArray(failingRules) ? failingRules.join(", ") : failingRules, // Join array elements with a comma
              reason: Array.isArray(remediation) ? remediation.join(", ") : remediation, // Join array elements with a comma
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
    
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      };
  
      fetchPieChartData(); // Call the async function
      fetchTableData();
    }, []);

    //segregate flag 0 transactions into compliant_transactions or potentialDefaulters_transactions based on risk label
    const [compliant_transactions, setCompliant_transactions] = useState();
    // const [compliantData, setCompliantData] = useState({
    //   columns: [
    //     {
    //       title: "Risk Label",
    //       dataIndex: "riskLabel",
    //       key: "riskLabel",
    //     },
    //     {
    //       title: "Transaction ID",
    //       dataIndex: "transactionID",
    //       key: "transactionID",
    //     },
    //     {
    //       title: "Customer ID",
    //       dataIndex: "customerID",
    //       key: "customerID",
    //     },
    //     {
    //       title: "Product",
    //       dataIndex: "subschedule",
    //       key: "subschedule",
    //     },
    //   ],
    //   data: data.compliant_transactions.map((transaction, index) => ({
    //     key: index + 1, // Unique key for each row
    //     riskLabel: "Low",
    //     transactionID: transaction.transactionID,
    //     customerID: transaction.customerID,
    //     subschedule: transaction.subschedule,
    //   })),  
    // })
    


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
            label: "Compliant Data",
            data: [12, 19, 8, 15, 10, 14, 9, 7, 13, 11],
            backgroundColor: "#059e40",
          },
          {
            label: "Regulatory Risk Defaulters",
            data: [5, 10, 4, 8, 6, 7, 5, 3, 6, 5],
            backgroundColor: "#d14c04",
          },
          {
            label: "Potential Defaulters",
            data: [3, 6, 2, 4, 3, 5, 2, 1, 4, 3],
            backgroundColor: "#cc020d",
          },
          {
            label: "Errors In Data",
            data: [3, 6, 2, 4, 3, 5, 2, 1, 4, 3],
            backgroundColor: "#fcba03",
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
    
      //potential defaulters table data
      const [potentialDefaultersTableData, setPotentialDefaultersTableData] = useState({
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
            title: "% Risk of defaulting",
            dataIndex: "riskscore",
            key: "riskscore",
          },
          {
            title: "Risk Label",
            dataIndex: "riskLabel",
            key: "riskLabel",
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
            customerID: "ABCDEF",
            subschedule: "International Auto Loan",
            riskscore: 80,
            riskLabel: "Medium",
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
          {
            key: "2",
            transactionID: 12345672,
            customerID: "OQURKS",
            subschedule: "US Auto Loan",
            riskscore: 70,
            riskLabel: "Medium",
            field: "Date",
            reason: "Invalid format",
            remediation: "Correct date format",
          },
          {
            key: "3",
            transactionID: 12345673,
            customerID: "JOAKEH",
            subschedule: "International Credit Card",
            riskscore: 60,
            riskLabel: "High",
            field: "Account Number",
            reason: "Missing value",
            remediation: "Provide account number",
          },
          {
            key: "4",
            transactionID: 12345674,
            customerID: "UTEKXA",
            subschedule: "Student Loan",
            riskscore: 50,
            riskLabel: "High",
            field: "Currency",
            reason: "Unsupported currency",
            remediation: "Correct currency",
          },
          {
            key: "5",
            transactionID: 12345675,
            customerID: "OSYFMA",
            subschedule: "International First Lien Mortgage",
            riskscore: 40,
            riskLabel: "Medium",
            field: "Description",
            reason: "Too long",
            remediation: "Shorten description",
          },
          {
            key: "6",
            transactionID: 12345676,
            customerID: "BEUGHA",
            subschedule: "International Other Consumer",
            riskscore: 30,
            riskLabel: "High",
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
        ],
      })
    
      //Errors in data table data
      const [errorsInDataTableData, setErrorsInDataTableData] = useState({
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
            customerID: "ABCDEF",
            subschedule: "International Auto Loan",
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
          {
            key: "2",
            transactionID: 12345672,
            customerID: "OQURKS",
            subschedule: "US Auto Loan",
            field: "Date",
            reason: "Invalid format",
            remediation: "Correct date format",
          },
          {
            key: "3",
            transactionID: 12345673,
            customerID: "JOAKEH",
            subschedule: "International Credit Card",
            field: "Account Number",
            reason: "Missing value",
            remediation: "Provide account number",
          },
          {
            key: "4",
            transactionID: 12345674,
            customerID: "UTEKXA",
            subschedule: "Student Loan",
            field: "Currency",
            reason: "Unsupported currency",
            remediation: "Correct currency",
          },
          {
            key: "5",
            transactionID: 12345675,
            customerID: "OSYFMA",
            subschedule: "International First Lien Mortgage",
            field: "Description",
            reason: "Too long",
            remediation: "Shorten description",
          },
          {
            key: "6",
            transactionID: 12345676,
            customerID: "BEUGHA",
            subschedule: "International Other Consumer",
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
        ],
      })

    //   // Set bar chart data
    //   setBarChartData({
    //     labels: Object.keys(data.transactions_by_sub_schedule),
    //     datasets: [
    //       {
    //         label: "Non-Flagged",
    //         data: Object.values(data.transactions_by_sub_schedule),
    //         backgroundColor: "#059e40",
    //       },
    //       {
    //         label: "Flagged for Operational Risk",
    //         data: Object.values(data.transactions_by_sub_schedule),
    //         backgroundColor: "#d14c04",
    //       },
    //       {
    //         label: "Flagged for Regulatory Risk",
    //         data: Object.values(data.transactions_by_sub_schedule),
    //         backgroundColor: "#cc020d",
    //       },
    //     ],
    //   });

    //   // Set line chart data
    //   setLineChartData({
    //     labels: Object.keys(data.average_risk_score_across_subschedules),
    //     datasets: [
    //       {
    //         label: "Average Risk Score",
    //         data: Object.values(data.average_risk_score_across_subschedules), // Example: Transaction counts
    //         borderColor: "#cc020d",
    //         fill: false,
    //       },
    //     ],
    //   });

    //   //set regulatory table data
      
    //   //set potential defaulters table data
    //   setPotentialDefaultersTableData({
    //     columns: [
    //       {
    //         title: "Transaction ID",
    //         dataIndex: "transactionID",
    //         key: "transactionID",
    //       },
    //       {
    //         title: "Customer ID",
    //         dataIndex: "customerID",
    //         key: "customerID",
    //       },
    //       {
    //         title: "Product",
    //         dataIndex: "subschedule",
    //         key: "subschedule",
    //       },
    //       {
    //         title: "% Risk of defaulting",
    //         dataIndex: "riskscore",
    //         key: "riskscore",
    //       },
    //       {
    //         title: "Failing Field",
    //         dataIndex: "field",
    //         key: "field",
    //       },
    //       {
    //         title: "Reason for Failure",
    //         dataIndex: "reason",
    //         key: "reason",
    //       },
    //       {
    //         title: "Steps for Remediation",
    //         dataIndex: "remediation",
    //         key: "remediation",
    //       },
    //     ],
    //     data: data.operational_risk_transactions.map((transaction, index) => ({
    //       key: index + 1, // Unique key for each row
    //       transactionID: transaction.transactionID,
    //       subschedule: transaction.subschedule,
    //       field: transaction.field,
    //       reason: transaction.reason,
    //       remediation: transaction.remediation,
    //     })),
    //   });

    //   //set filtered transactions table data
    //   setErrorsInDataTableData({
    //     columns: [
    //       {
    //         title: "Transaction ID",
    //         dataIndex: "transactionID",
    //         key: "transactionID",
    //       },
    //       {
    //         title: "Customer ID",
    //         dataIndex: "customerID",
    //         key: "customerID",
    //       },
    //       {
    //         title: "Product",
    //         dataIndex: "subschedule",
    //         key: "subschedule",
    //       },
    //       {
    //         title: "% Risk of defaulting",
    //         dataIndex: "riskscore",
    //         key: "riskscore",
    //       },
    //       {
    //         title: "Missing Field",
    //         dataIndex: "field",
    //         key: "field",
    //       },
    //       {
    //         title: "Reason for Failure",
    //         dataIndex: "reason",
    //         key: "reason",
    //       },
    //       {
    //         title: "Steps for Remediation",
    //         dataIndex: "remediation",
    //         key: "remediation",
    //       },
    //     ],
    //     data: data.operational_risk_transactions.map((transaction, index) => ({
    //       key: index + 1, // Unique key for each row
    //       transactionID: transaction.transactionID,
    //       subschedule: transaction.subschedule,
    //       field: transaction.field,
    //       reason: transaction.reason,
    //       remediation: transaction.remediation,
    //     })),
    //   });

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
                    <h4>Average Risk Score across Subschedules</h4>
                    <Line data={lineChartData} />
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
                    Compliant Data
                    </span>
                  }
                     key="1">
                      <p>Compliant, low risk data</p>
                    {/* <Table
                      columns={compliantData.columns}
                      dataSource={compliantData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    /> */}
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
                      <p>Data that is not compliant with rules</p>
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
                      <p>Heightened risk compliant data</p>
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
                      <p>Data with missing attributes according to the rules</p>
                    <Table
                      columns={errorsInDataTableData.columns}
                      dataSource={errorsInDataTableData.data}
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