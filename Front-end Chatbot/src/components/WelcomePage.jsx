import React, { useState } from "react";
import "./WelcomePage.css";

const WelcomePage = () => {

    return (
        <div className="welcome-page">
            <h1>Regulatory Reporting Compliance <br/> made easy, just for you.</h1>
            <p>Ask me questions or upload your rules file and transactions file to get started.</p>
            <p className="pItalics">Please wait after clicking "Send", patience is key!</p>
        </div>
    );

};

export default WelcomePage;