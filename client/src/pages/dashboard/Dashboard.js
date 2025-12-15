import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser, getMapping, saveMapping } from "../../api/authUserApi.js";
import { fetchWebhookUrl } from "../../api/indiamartWebhookApi.js";
import { getLeadFields } from "../../api/crmApi.js";
import { LogOut, Link as LinkIcon, Network } from "lucide-react";
import { indiamartFields } from "./indiamart.fields.js";
import "./Dashboard.css";

/* ================= Logout Button ================= */
const LogoutButton = () => {
  const logout = useCallback(() => {
    window.catalyst.auth.signOut("/");
  }, []);

  return (
    <button className="logout-btn" onClick={logout}>
      <LogOut className="logout-icon" /> <span>Logout</span>
    </button>
  );
};

/* ================= Webhook Generator ================= */
const WebhookUrlGenerator = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateUrl = async () => {
    try {
      setLoading(true);
      setCopied(false);

      const webhookUrl = await fetchWebhookUrl();
      setUrl(webhookUrl);
      setShowModal(true);
    } catch {
      alert("Failed to generate URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="webhook-wrapper">
      <button className="primary-btn" onClick={generateUrl} disabled={loading}>
        {loading ? "Generating..." : "Generate IndiaMART Webhook URL"}
      </button>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="simple-modal centered-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Webhook URL Generated 🎉</h2>
            <div className="url-container">
              <input type="text" value={url} readOnly />
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? "Copied ✔" : "Copy"}
              </button>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= Lead Mapping ================= */
const REQUIRED_ZOHO_FIELDS = ["Company", "Last_Name", "Phone"];

const LeadMappingPage = () => {
  const [leadFields, setLeadFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapping, setMapping] = useState({});
  const [saving, setSaving] = useState(false);
  const [messageInfo, setMessageInfo] = useState({ text: null, type: null });

  // Fetch Zoho fields
  useEffect(() => {
    async function fetchLeadFields() {
      try {
        const data = await getLeadFields();
        setLeadFields(data);
      } catch (err) {
        setError(err.message || "Failed to fetch lead fields");
      } finally {
        setLoading(false);
      }
    }
    fetchLeadFields();
  }, []);

  // Fetch existing mapping
  useEffect(() => {
    async function fetchMappingData() {
      try {
        const savedMapping = await getMapping();
        setMapping(savedMapping?.lead_mapping || {});
      } catch (err) {
        console.error("Error fetching mapping:", err);
      }
    }
    fetchMappingData();
  }, []);

  const zohoFields = leadFields?.fields || [];
  const allowedTypes = [
    "ownerlookup",
    "text",
    "email",
    "phone",
    "website",
    "picklist",
    "datetime",
    "textarea",
  ];

  const excludedFields = [
    "Full_Name",
    "Lead_Source",
    "Created_Time",
    "Modified_Time",
    "Created_By",
    "Modified_By",
  ];

  const filteredZohoFields = zohoFields.filter(
    (f) =>
      allowedTypes.includes(f.data_type) && !excludedFields.includes(f.api_name)
  );

  const handleChange = (instaKey, zohoKey) => {
    setMapping((prev) => ({ ...prev, [instaKey]: zohoKey }));
  };

  const validateMapping = () => {
    const selectedFields = Object.values(mapping).filter((v) => v);

    const hasDuplicates =
      new Set(selectedFields).size !== selectedFields.length;

    if (hasDuplicates) {
      return {
        valid: false,
        message: "A Zoho field cannot be mapped more than once.",
        type: "error",
      };
    }

    for (const field of REQUIRED_ZOHO_FIELDS) {
      if (!selectedFields.includes(field)) {
        return {
          valid: false,
          message: `Mandatory field "${field}" must be mapped.`,
          type: "error",
        };
      }
    }

    return { valid: true, message: null, type: null };
  };

  const handleSaveMapping = async () => {
    const validation = validateMapping();
    if (!validation.valid) {
      setMessageInfo({ text: validation.message, type: validation.type });
      return;
    }

    setSaving(true);
    setMessageInfo({ text: null, type: null });

    const fullMapping = indiamartFields.reduce((acc, field) => {
      acc[field.api_name] = mapping[field.api_name] || null;
      return acc;
    }, {});

    try {
      const result = await saveMapping(fullMapping);
      setMessageInfo({
        text: result ? "Mapping saved successfully!" : "Error saving mapping.",
        type: result ? "success" : "error",
      });
    } catch (err) {
      setMessageInfo({ text: "Error saving mapping.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading fields...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page-container">
      <center>
        <h1 className="title">Lead Field Mapping</h1>
        <p className="subtitle">
          Map IndiaMART fields to Zoho CRM lead fields for proper data
          integration.
        </p>
      </center>

      {indiamartFields.map((field) => (
        <div key={field.api_name} className="field-row">
          <span className="field-label">{field.display_label}</span>
          <select
            className="field-select"
            value={mapping[field.api_name] || ""}
            onChange={(e) => handleChange(field.api_name, e.target.value)}
          >
            <option value="">Select Zoho Field</option>
            {filteredZohoFields.map((z) => {
              const isAlreadySelected = Object.values(mapping).includes(
                z.api_name
              );
              const isCurrentValue = mapping[field.api_name] === z.api_name;

              return (
                <option
                  key={z.api_name}
                  value={z.api_name}
                  disabled={isAlreadySelected && !isCurrentValue}
                >
                  {z.display_label}
                </option>
              );
            })}
          </select>
        </div>
      ))}

      {messageInfo.text && (
        <div className={`message ${messageInfo.type}-message`}>
          <span>{messageInfo.text}</span>
          <button
            className="message-close"
            onClick={() => setMessageInfo({ text: null, type: null })}
          >
            &times;
          </button>
        </div>
      )}

      <div className="button-container">
        <button
          onClick={handleSaveMapping}
          disabled={saving}
          className="save-button"
        >
          {saving ? "Saving..." : "Save Mapping"}
        </button>
      </div>
    </div>
  );
};

/* ================= OAuth Success ================= */
const OAuthSuccess = () => {
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
        <div className="success-icon">&#10003;</div>
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
};

/* ================= Dashboard ================= */
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

    window.location.href = `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&access_type=offline&prompt=consent`;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-section">
          <img src="/logo512.png" alt="Logo" className="logo" />
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
                <b>
                  {userDetails.firstName} {userDetails.lastName}
                </b>
              </div>
              <div className="dropdown-row">
                <span>{userDetails.mailid}</span>
              </div>

              <div className="dropdown-row">
                <span>{userDetails.timeZone}</span>
              </div>

              <div className="dropdown-row">
                <span>{userDetails.createdTime}</span>
              </div>

              <LogoutButton />
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        <div className="cards-grid">
          <div className="card">
            <h2 className="card-title">Overview</h2>
            <p>
              Map IndiaMART fields to Zoho CRM lead fields for proper
              integration.
            </p>
          </div>

          <div className="card">
            <h2 className="card-title">Zoho CRM Status</h2>

            {isConnected ? (
              <>
              <p className="connected">Connected to Zoho</p>
              </>
              
            ) : (
              <>
                <p className="not-connected">Not Connected</p>
                <button className="connect-btn" onClick={handleZohoConnect}>
                  Connect to Zoho
                </button>
              </>
            )}
          </div>

          {isConnected && (
            <div className="card">
              <h2 className="card-title">Generate Webhook URL</h2>
              <WebhookUrlGenerator />
            </div>
          )}
        </div>

        {isConnected && (
          <section className="lead-mapping-section">
            <LeadMappingPage />
          </section>
        )}
      </main>
    </div>
  );
};