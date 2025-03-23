import React from "react";

const NewPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the New Page</h1>
      <p style={styles.text}>This is an additional page in your React project.</p>
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: "grey", // Set background color to grey
    height: "100vh", // Make it full screen height
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#fff", // White text for contrast
    fontSize: "28px",
  },
  text: {
    color: "#f5f5f5", // Light grey text
    fontSize: "18px",
  },
};

export default NewPage;
