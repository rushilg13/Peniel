import React from "react";
import Chatbot from "./components/Chatbot"; // Import the FileUpload component
import "./App.css"; // Optional: Add some basic styling

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Regulatory Compliance Assistant</h1>
        <p>Upload your regulatory document and transaction data to analyze compliance.</p>
      </header>
      <main>
        <Chatbot /> {/* Render the FileUpload component */}
      </main>
    </div>
  );
}

export default App;