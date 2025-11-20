import { useEffect, useState } from "react";
import { getLeadFields } from "../../api/crmApi.js";

export const LeadMappingPage = () => {
  const [leads, setLeads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapping, setMapping] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const instamartFields = [
    { api_name: "SUBJECT", display_label: "Subject" },
    { api_name: "QUERY_TIME", display_label: "Query Time" },
    { api_name: "QUERY_TYPE", display_label: "Query Type" },
    { api_name: "SENDER_CITY", display_label: "Sender City" },
    { api_name: "SENDER_NAME", display_label: "Sender Name" },
    { api_name: "SENDER_EMAIL", display_label: "Sender Email" },
    { api_name: "SENDER_PHONE", display_label: "Sender Phone" },
    { api_name: "SENDER_STATE", display_label: "Sender State" },
    { api_name: "CALL_DURATION", display_label: "Call Duration" },
    { api_name: "QUERY_MESSAGE", display_label: "Query Message" },
    { api_name: "SENDER_MOBILE", display_label: "Sender Mobile" },
    { api_name: "SENDER_ADDRESS", display_label: "Sender Address" },
    { api_name: "SENDER_COMPANY", display_label: "Sender Company" },
    { api_name: "SENDER_PINCODE", display_label: "Sender Pincode" },
    { api_name: "QUERY_MCAT_NAME", display_label: "Query MCAT Name" },
    { api_name: "RECEIVER_MOBILE", display_label: "Receiver Mobile" },
    { api_name: "UNIQUE_QUERY_ID", display_label: "Unique Query ID" },
    { api_name: "SENDER_EMAIL_ALT", display_label: "Sender Email (Alt)" },
    { api_name: "SENDER_PHONE_ALT", display_label: "Sender Phone (Alt)" },
    { api_name: "SENDER_MOBILE_ALT", display_label: "Sender Mobile (Alt)" },
    { api_name: "QUERY_PRODUCT_NAME", display_label: "Query Product Name" },
    { api_name: "SENDER_COUNTRY_ISO", display_label: "Sender Country ISO" }
  ];

   useEffect(() => {
      async function fetchLeadsData() {
        try {
          const data = await getLeadFields();
          setLeads(data);
        } catch (err) {
          setError(err.message || "Failed to fetch leads");
        } finally {
          setLoading(false);
        }
      }
      fetchLeadsData();
    }, []);

  const zohoFields = leads?.fields || [];

  const handleChange = (instaKey, zohoKey) => {
    setMapping((prev) => ({ ...prev, [instaKey]: zohoKey }));
  };

  const saveMapping = async () => {
    alert("Save mapping functionality is not implemented yet.");
    // setSaving(true);
    // setMessage(null);
    // try {
    //   const payload = Object.entries(mapping).map(([insta, zoho]) => ({
    //     instamartField: insta,
    //     zohoField: zoho,
    //   }));

    //   const res = await fetch("/mapping", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ mappings: payload }),
    //   });

    //   if (!res.ok) throw new Error("Failed to save mapping");
    //   setMessage("Mapping saved successfully!");
    // } catch (e) {
    //   console.error(e);
    //   setMessage("Error saving mapping.");
    // }
    // setSaving(false);
  };

  if (loading)
    return <div className="p-10 text-gray-600">Loading fields...</div>;
  if (error)
    return <div className="p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">Lead Field Mapping</h1>
        <p className="mb-8 text-gray-600">
          Map IndiaMART fields to Zoho CRM lead fields.
        </p>

        <div className="space-y-4">
          {instamartFields.map((field) => (
            <div
              key={field.api_name}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow-sm"
            >
              <span className="font-medium text-gray-700">
                {field.display_label}
              </span>

              <select
                className="border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-400 w-64"
                value={mapping[field.api_name] || ""}
                onChange={(e) => handleChange(field.api_name, e.target.value)}
              >
                <option value="">Select Zoho Field</option>
                {zohoFields.map((z) => (
                  <option key={z.api_name} value={z.api_name}>
                    {z.display_label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <button
            onClick={saveMapping}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Mapping"}
          </button>
        </div>

        {message && (
          <div className="mt-5 p-4 rounded-lg bg-green-100 text-green-800 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
