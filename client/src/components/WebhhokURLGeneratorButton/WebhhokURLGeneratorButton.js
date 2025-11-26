import { useState } from "react";
import { fetchWebhookUrl } from "../../api/indiamartWebhookApi.js";
import "./WebhhokURLGeneratorButton.css";

const WebhookUrlGenerator = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateUrl = async () => {
    try {
      setLoading(true);
      setCopied(false);

      const webhookUrl = await fetchWebhookUrl(); // using separate function
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
    <div>
      <button className="generate-btn" onClick={generateUrl} disabled={loading}>
        {loading ? "Generating IndiaMART Webhook URL..." : "Generate IndiaMART Webhook URL"}
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Webhook URL Generated</h2>

            <input className="url-box" value={url} readOnly />

            <div className="modal-actions">
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy URL"}
              </button>

              <button className="close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookUrlGenerator;
