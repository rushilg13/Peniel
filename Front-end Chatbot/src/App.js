import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Chatbot from "./components/Chatbot"; // Existing component
import NewPage from "./components/NewPage";  // New page
import StatsChart from "./components/StatsChart"; // New component
import "./App.css"; // Optional: Add some basic styling

function App() {
  return (
    
    <Router>
      {/* Navigation Bar */}
      <nav className="nav-links">
          <Link to="/">Chatbot</Link>
          <Link to="/new-page">New Page</Link>
          <Link to="/stats">Stats</Link> {/* New Link for Stats Page */}
        </nav>    

        <main>
          <Routes>
            <Route path="/" element={<Chatbot />} />
            <Route path="/new-page" element={<NewPage />} />
            <Route path="/stats" element={<StatsChart />} />
          </Routes>
        </main>
  
    </Router>
  );
}


export default App;
