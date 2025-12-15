import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export const LoginPage = () => {
  useEffect(() => {
    // config is optional
    window.catalyst.auth.signIn("login");
  }, []);

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <img
          src="/logo512.png"
          alt="Logo"
          className="login-logo"
        />
        <h1 className="login-title">Indiamart2ZohoCRM</h1>
        <p className="login-subtitle">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign-up
          </Link>{" "}
          now!
        </p>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <div id="login"></div>
      </div>
    </div>
  );
};
