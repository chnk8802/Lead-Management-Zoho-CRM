import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirect to home
  };

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you are looking for does not exist.</p>
        <button className="home-btn" onClick={handleGoHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};
