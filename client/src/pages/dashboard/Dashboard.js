import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogoutButton } from "../../components/LogoutButton.js";
import "./Dashboard.css";
import { getAuthUser } from "../../api/authUserApi.js";

export const Dashboard = ({ userDetails }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getAuthUser();
      setUserInfo(data);
    };
    fetchUser();
  }, []);

  const scopes = "ZohoCRM.modules.all,ZohoCRM.settings.ALL,ZohoCRM.coql.READ";
  const handleZohoConnect = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    window.location.href = `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}/oauthredirect&access_type=offline&prompt=consent`;
  };

  const togglePopover = () => setPopoverOpen(!popoverOpen);

  return (
    <div className="dashboard-container">
      {/* Header */}{" "}
      <header className="dashboard-header">
        {" "}
        <h2>Dashboard</h2>{" "}
        <menu className="menu-links">
          <Link to="/lead-mapping">Lead Mapping</Link>
        </menu>
        <div className="user-icon-wrapper">
          <img
            id="userIcon"
            src="https://cdn2.iconfinder.com/data/icons/user-management/512/profile_settings-512.png"
            alt="User"
            onClick={togglePopover}
          />
          {popoverOpen && (
            <div className="user-popover">
              <button
                className="close-btn"
                onClick={() => setPopoverOpen(false)}
              >
                ×
              </button>{" "}
              <p>
                <b>User ID:</b> {userDetails.userId}
              </p>{" "}
              <p>
                <b>First Name:</b> {userDetails.firstName}
              </p>{" "}
              <p>
                <b>Last Name:</b> {userDetails.lastName}
              </p>{" "}
              <p>
                <b>Email:</b> {userDetails.mailid}
              </p>{" "}
              <p>
                <b>Time Zone:</b> {userDetails.timeZone}
              </p>{" "}
              <p>
                <b>Joined On:</b> {userDetails.createdTime}
              </p>
              {userInfo && userInfo.user && userInfo.user.user_id ? (
                <p id="connectedToZoho">Connected to Zoho</p>
              ) : (
                <div className="zoho-connect-section">
                  <button onClick={handleZohoConnect}>Connect to Zoho</button>
                </div>
              )}
              <LogoutButton btnvalue={{ title: "Logout" }} />{" "}
            </div>
          )}{" "}
        </div>{" "}
      </header>
      {/* Main content area */}
      <main className="dashboard-main">
        <h3>Welcome, {userDetails.firstName}!</h3>
        <p>This is your dashboard overview.</p>
        {/* Add more widgets/content here */}
      </main>
    </div>
  );
};
