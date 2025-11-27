import { useEffect, useState } from "react";
import { getLeadFields } from "../../api/crmApi.js";
import "./LeadMappingPage.css";
import { instamartFields } from "./instamart.fields.js";
import { getMapping, saveMapping } from "../../api/authUserApi.js";

// Mandatory CRM fields
const REQUIRED_ZOHO_FIELDS = ["Company", "Last_Name", "Phone"];

export const LeadMappingPage = () => {
  const [leadFields, setLeadFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapping, setMapping] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

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

  // Fetch existing saved mapping
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

  const filteredZohoFields = zohoFields.filter((f) =>
    allowedTypes.includes(f.data_type)
  );

  // Handle selection
  const handleChange = (instaKey, zohoKey) => {
    setMapping((prev) => ({ ...prev, [instaKey]: zohoKey }));
  };

  // Validate mapping before saving
  const validateMapping = () => {
    const selectedFields = Object.values(mapping).filter((v) => v);

    // Duplicate detection
    const hasDuplicates =
      new Set(selectedFields).size !== selectedFields.length;

    if (hasDuplicates) {
      return {
        valid: false,
        message: "A Zoho field cannot be mapped more than once.",
      };
    }

    // Check required Zoho fields
    for (const field of REQUIRED_ZOHO_FIELDS) {
      if (!selectedFields.includes(field)) {
        return {
          valid: false,
          message: `Mandatory field "${field}" must be mapped.`,
        };
      }
    }

    return { valid: true, message: null };
  };

  const handleSaveMapping = async () => {
    const validation = validateMapping();
    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }

    setSaving(true);
    setMessage(null);

    const fullMapping = instamartFields.reduce((acc, field) => {
      acc[field.api_name] = mapping[field.api_name] || null;
      return acc;
    }, {});

    try {
      const result = await saveMapping(fullMapping);
      setMessage(
        result ? "Mapping saved successfully!" : "Error saving mapping."
      );
    } catch (err) {
      setMessage("Error saving mapping.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading fields...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">Lead Field Mapping</h1>
        <p className="subtitle">
          Map IndiaMART fields to Zoho CRM lead fields for proper data
          integration.
        </p>

        {instamartFields.map((field) => (
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

        <div className="button-container">
          <button
            onClick={handleSaveMapping}
            disabled={saving}
            className="save-button"
          >
            {saving ? "Saving..." : "Save Mapping"}
          </button>

          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </div>
  );
};



// import { useEffect, useState } from "react";
// import { getLeadFields } from "../../api/crmApi.js";
// import "./LeadMappingPage.css";
// import { instamartFields } from "./instamart.fields.js";
// import { getMapping, saveMapping } from "../../api/authUserApi.js";

// export const LeadMappingPage = () => {
//   const [leadFields, setLeadFields] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [mapping, setMapping] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     async function fetchLeadFields() {
//       try {
//         const data = await getLeadFields();
//         setLeadFields(data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch lead fields");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchLeadFields();
//   }, []);

//   // fetch previously saved mapping
//   useEffect(() => {
//     async function fetchMappingData() {
//       try {
//         const savedMapping = await getMapping();
//         const leadMap = savedMapping?.lead_mapping || {};
//         setMapping(leadMap);
//       } catch (err) {
//         console.error("Error fetching mapping:", err);
//       }
//     }
//     fetchMappingData();
//   }, []);

//   const zohoFields = leadFields?.fields || [];
//   const allowedTypes = [
//     "ownerlookup",
//     "text",
//     "email",
//     "phone",
//     "website",
//     "picklist",
//     "datetime",
//     "textarea",
//   ];
//   const filteredZohoFields = zohoFields.filter((f) =>
//     allowedTypes.includes(f.data_type)
//   );

//   const handleChange = (instaKey, zohoKey) => {
//     setMapping((prev) => ({ ...prev, [instaKey]: zohoKey }));
//   };

//   const handleSaveMapping = async () => {
//     setSaving(true);
//     setMessage(null);
//     const fullMapping = instamartFields.reduce((acc, field) => {
//       acc[field.api_name] = mapping[field.api_name] || null;
//       return acc;
//     }, {});

//     try {
//       const result = await saveMapping(fullMapping); // call your API function
//       if (result) {
//         setMessage("Mapping saved successfully!");
//       } else {
//         setMessage("Error saving mapping.");
//       }
//     } catch (err) {
//       console.error("Error saving mapping:", err);
//       setMessage("Error saving mapping.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="loading">Loading fields...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="page-container">
//       <div className="card">
//         <h1 className="title">Lead Field Mapping</h1>
//         <p className="subtitle">
//           Map IndiaMART fields to Zoho CRM lead fields for proper data
//           integration.
//         </p>

//         {instamartFields.map((field) => (
//           <div key={field.api_name} className="field-row">
//             <span className="field-label">{field.display_label}</span>
//             <select
//               className="field-select"
//               value={mapping[field.api_name] || ""}
//               onChange={(e) => handleChange(field.api_name, e.target.value)}
//             >
//               <option value="">Select Zoho Field</option>
//               {filteredZohoFields.map((z) => (
//                 <option
//                   key={z.api_name}
//                   value={z.api_name}
//                   disabled={
//                     Object.values(mapping).includes(z.api_name) &&
//                     mapping[field.api_name] !== z.api_name
//                   }
//                 >
//                   {z.display_label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ))}

//         <div className="button-container">
//           <button
//             onClick={handleSaveMapping}
//             disabled={saving}
//             className="save-button"
//           >
//             {saving ? "Saving..." : "Save Mapping"}
//           </button>
//           {message && <div className="message">{message}</div>}
//         </div>
//       </div>
//     </div>
//   );
// };
