import React, { useState } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2"; // Import Line chart
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { Table, Tabs } from "antd"; // Import Ant Design Table

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

    const data=res?.data||{};
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
            transactionID: 66996885,
            customerID: "EWOURW",
            subschedule: "International Auto Loan",
            riskscore: 66,
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
          {
            key: "2",
            transactionID: 66996886,
            customerID: "ETUWJK",
            subschedule: "Student Loan",
            riskscore: 22,
            field: "Date",
            reason: "Invalid format",
            remediation: "Correct date format",
          },
          {
            key: "3",
            transactionID: 66996887,
            customerID: "OWUEFW",
            subschedule: "US Small Business",
            riskscore: 15,
            field: "Account Number",
            reason: "Missing value",
            remediation: "Provide account",
          },
          {
            key: "4",
            transactionID: 66996888,
            customerID: "WEOUGD",
            subschedule: "International Credit Card",
            riskscore: 30,
            field: "Currency",
            reason: "Unsupported currency",
            remediation: "Correct currency",
          },
          {
            key: "5",
            transactionID: 66996889,
            customerID: "QWIUDW",
            subschedule: "US Auto Loan",
            riskscore: 89,
            field: "Description",
            reason: "Too long",
            remediation: "Shorten description",
          },
          {
            key: "6",
            transactionID: 66996885,
            customerID: "TJGHID",
            subschedule: "US Other Consumer",
            riskscore: 20,
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
        ],
      })
    
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
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
        ],
      })
    
      //filtered transactions table data
      const [filteredTransactionsTableData, setFilteredTransactionsTableData] = useState({
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
            riskscore: 80,
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
            field: "Amount",
            reason: "Exceeds limit",
            remediation: "Reduce amount to within the limit",
          },
        ],
      })

    //   setPieChartData({
    //     labels: [ "Non-Flagged","Flagged for Operational Risk", "Flagged for Regulatory Risk"],
    //     datasets: [
    //       {
    //         data: [data.non_flagged_count, data.operational_flagged_count, data.regulatory_flagged_count],
    //         backgroundColor: ["#059e40", "#d14c04", "#cc020d"]//green, orange, red
    //       },
    //     ],
    //   });

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
    //   setRegulatoryTableData({
    //     columns: [
    //       {
    //         title: "Transaction ID",
    //         dataIndex: "transactionID",
    //         key: "transactionID",
    //       },
    //       {
    //         title: "Subschedule",
    //         dataIndex: "subschedule",
    //         key: "subschedule",
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
    //     ],
    //     data: data.regulatory_risk_transactions.map((transaction, index) => ({
    //       key: index + 1, // Unique key for each row
    //       transactionID: transaction.transactionID,
    //       subschedule: transaction.subschedule,
    //       field: transaction.field,
    //       reason: transaction.reason,
    //     })),
    //   });

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
    //   setFilteredTransactionsTableData({
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
                  <TabPane tab="Regulatory Risk Defaulters" key="1">
                    <Table
                      columns={regulatoryTableData.columns}
                      dataSource={regulatoryTableData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    />
                  </TabPane>
                  <TabPane tab="Potential Defaulters" key="2">
                    <Table
                      columns={potentialDefaultersTableData.columns}
                      dataSource={potentialDefaultersTableData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    />
                  </TabPane>
                  <TabPane tab="Filtered Data" key="3">
                    <Table
                      columns={filteredTransactionsTableData.columns}
                      dataSource={filteredTransactionsTableData.data}
                      pagination={{ pageSize:5 }} //Enable pagination
                    />
                  </TabPane>
                </Tabs>
                }
              </div>
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
      }
  };

  export default ChartsAndTable;