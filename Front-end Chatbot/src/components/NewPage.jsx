import React, { useState } from "react";


const NewPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    // Handle file upload logic here (e.g., send to backend)
    alert(`File "${selectedFile.name}" selected for upload.`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the New Page</h1>
      <p style={styles.text}>This is an additional page in your React project.</p>

      {/* File Upload Button */}
      <div style={styles.fileUploadContainer}>
        <input type="file" onChange={handleFileChange} style={styles.fileInput} />
        <button onClick={handleUpload} style={styles.uploadButton}>Upload</button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: "white", // Set background to black
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  heading: {
    color: "black", // White text for contrast
    fontSize: "28px",
  },
  text: {
    color: "black", // Light grey text
    fontSize: "18px",
  },
  fileUploadContainer: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  fileInput: {
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  uploadButton: {
    padding: "10px 15px",
    backgroundColor: "#ffcc00",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default NewPage;
