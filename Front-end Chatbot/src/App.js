import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Chatbot from "./components/Chatbot"; // Existing component
import NewPage from "./NewPage";  // New page
import "./App.css"; // Optional: Add some basic styling

function App() {
  return (
    
    <Router>
      {/* Navigation Bar */}
      <nav className="nav-links">
          <Link to="/">Chatbot</Link>
          <Link to="/new-page">New Page</Link>
        </nav>    

        <main>
          <Routes>
            <Route path="/" element={<Chatbot />} />
            <Route path="/new-page" element={<NewPage />} />
          </Routes>
        </main>
  
    </Router>
  );
}

export default App;
