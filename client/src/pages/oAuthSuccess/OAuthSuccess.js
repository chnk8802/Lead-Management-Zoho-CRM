import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OAuthSuccess.css";

export const OAuthSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
    }
  }, [countdown, navigate]);

  return (
    <div className="oauth-success-container">
      <div className="oauth-success-card">
        <div className="success-icon">&#10003;</div> {/* Checkmark icon */}
        <h1 className="success-title">CRM Connected Successfully</h1>
        <p className="success-subtitle">
          Your Zoho CRM account has been linked. Redirecting to dashboard...
        </p>
        <p className="success-countdown">
          Redirecting in <strong>{countdown}</strong> seconds...
        </p>
        <button className="success-button" onClick={() => navigate("/")}>
          Go Now
        </button>
      </div>
    </div>
  );
}
