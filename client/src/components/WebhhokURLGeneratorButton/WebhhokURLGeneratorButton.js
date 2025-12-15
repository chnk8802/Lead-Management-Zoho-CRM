import { useState } from "react";
import { fetchWebhookUrl } from "../../api/indiamartWebhookApi.js";
import "./WebhhokURLGeneratorButton.css";

export const WebhookUrlGenerator = () => {
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
    } catch (err) {
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
        <div className="simple-modal">
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
      )}
    </div>
  );
};
