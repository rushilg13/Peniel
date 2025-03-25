import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Chatbot from "./components/Chatbot"; // Existing component
import ChartsAndTable from "./components/ChartsAndTable"; // New component
import "./App.css"; // Optional: Add some basic styling

function App() {

  return (
    <Router>
        <main>
          <Routes>
            <Route path="/" element={<Chatbot />} />
          </Routes>
        </main>
  
    </Router>
  );
}


export default App;
