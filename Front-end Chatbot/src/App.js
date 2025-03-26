import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Chatbot from "./components/Chatbot"; // Existing component
import ChartsAndTable from "./components/ChartsAndTable"; // New component
import "./App.css"; // Optional: Add some basic styling
import Navbar from "./components/NavbarContainer"
function App() {

  return (
    <Router>
      <Navbar /> {/* Add the Navbar here */}
      <main style={{ marginTop: '60px' }}> 
        {/* <main]> */}
          <Routes>
            <Route path="/" element={<Chatbot />} />
          </Routes>
        </main>
  
    </Router>
  );
}


export default App;
