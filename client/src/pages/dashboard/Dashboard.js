import { useEffect, useState, useCallback, useRef } from "react";
import { getAuthUser } from "../../api/authUserApi.js";
import { LogOut, Link as LinkIcon, Network, User2 } from "lucide-react";
import WebhookUrlGenerator from "../../components/WebhhokURLGeneratorButton/WebhhokURLGeneratorButton.js";
import { LeadMappingPage } from "../leadMapping/LeadMappingPage.js";
import "./Dashboard.css";

const LogoutButton = () => {
  const logout = useCallback(() => {
    window.catalyst.auth.signOut("/");
  }, []);
  return (
    <button className="logout-btn" onClick={logout}>
      <LogOut className="logout-icon" />{" "}<span>Logout</span>
    </button>
  );
};

export const Dashboard = ({ userDetails }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getAuthUser();
      setUserInfo(data);
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scopes = "ZohoCRM.modules.all,ZohoCRM.settings.ALL,ZohoCRM.coql.READ";
  const isConnected = !!userInfo?.user?.user_id;

  const handleZohoConnect = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    window.location.href = `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}/oauthredirect&access_type=offline&prompt=consent`;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo-section">
          <img
            src="https://img1.wsimg.com/isteam/ip/fa32fa94-50a8-4a5c-9525-4781001c7a28/blob-4bf291d.png/:/rs=w:90,h:81,cg:true,m/cr=w:90,h:81/qt=q:100/ll"
            alt="Logo"
            className="logo"
          />
        </div>
        <div className="user-section" ref={dropdownRef}>
          <div
            className="user-avatar"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt="User Avatar"
              className="dropdown-icon"
            />
          </div>
          {showDropdown && (
            <div className="user-dropdown-card">
              <div className="dropdown-header">
                <span>
                  <b>
                    {userDetails.firstName} {userDetails.lastName}
                  </b>
                </span>
              </div>
              <div className="dropdown-row">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                  alt="Email"
                  className="dropdown-icon"
                />
                <span>{userDetails.mailid}</span>
              </div>
              <div className="dropdown-row">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
                  alt="Time Zone"
                  className="dropdown-icon"
                />
                <span>{userDetails.timeZone}</span>
              </div>
              <div className="dropdown-row">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                  alt="Joined"
                  className="dropdown-icon"
                />
                <span>{userDetails.createdTime}</span>
              </div>
              <LogoutButton />
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Cards */}
      <main className="dashboard-main">
        <div className="cards-grid">
          {/* Profile Card */}
          <div className="card">
            <h2 className="card-title">Overview</h2>
            <div className="card-content">
              Map IndiaMART fields to Zoho CRM lead fields for proper data
              integration.
            </div>
          </div>

          {/* Zoho Connection Card */}
          <div className="card">
            <h2 className="card-title">
              <Network className="icon-small" /> Zoho CRM Status
            </h2>
            {isConnected ? (
              <p className="connected">Connected to Zoho</p>
            ) : (
              <p className="not-connected">Not Connected</p>
            )}
            {!isConnected && (
              <button className="connect-btn" onClick={handleZohoConnect}>
                <Network className="icon-small" /> Connect to Zoho
              </button>
            )}
          </div>

          {/* Webhook URL Card */}
          {isConnected && (
            <div className="card">
              <h2 className="card-title">
                <LinkIcon className="icon-small" /> Generate Webhook URL
              </h2>
              <WebhookUrlGenerator />
            </div>
          )}
        </div>

        {/* Lead Mapping Full Width Section */}
        {isConnected && (
          <>
            <section className="lead-mapping-section">
              <LeadMappingPage />
            </section>
          </>
        )}
      </main>
    </div>
  );
};
