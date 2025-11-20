import { useEffect, useState } from "react";
import { getLeadFields } from "../../api/crmApi.js";
import "./LeadsPage.css";

export const LeadsPage = () => {
  const [leads, setLeads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldMappings, setFieldMappings] = useState({});

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


  const handleMappingChange = (instaField, zohoField) => {
    setFieldMappings((prev) => ({
      ...prev,
      [instaField]: zohoField
    }));
  };

  const saveMapping = () => {
    const mappingArray = Object.entries(fieldMappings).map(([insta, zoho]) => ({
      instamartField: insta,
      zohoField: zoho
    }));
    console.log("Mappings to save:", mappingArray);
    // TODO: Call API to save mapping
  };

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

  if (loading) return <div className="leads-container">Loading leads...</div>;
  if (error) return <div className="leads-container error">Error: {error}</div>;

  const zohoFields = leads?.fields || [];

  return (
    <>
      <div className="mapping-container">
        <h2>Map Instamart Fields to Zoho CRM Fields</h2>
        {instamartFields.map((field) => (
          <div className="field-mapping-row" key={field.api_name}>
            <span className="instamart-field">{field.display_label}</span>
            <select
              value={fieldMappings[field.api_name] || ""}
              onChange={(e) =>
                handleMappingChange(field.api_name, e.target.value)
              }
            >
              <option value="">Select Zoho Field</option>
              {zohoFields.map((zField) => (
                <option key={zField.api_name} value={zField.api_name}>
                  {zField.display_label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={saveMapping} className="save-mapping-btn">
          Save Mapping
        </button>
      </div>

      <div className="leads-container">
        <h1>Leads Data</h1>
        <pre className="leads-json">{JSON.stringify(leads, null, 2)}</pre>
      </div>
    </>
  );
};


// import { useEffect, useState } from "react";
// import { getLeadFields, getLeads } from "../../api/crmApi.js";
// import "./LeadsPage.css";

// export const LeadsPage = () => {
//   const [leads, setLeads] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [fieldMappings, setFieldMappings] = useState({});

//   const handleMappingChange = (instaField, zohoField) => {
//     setFieldMappings((prev) => ({
//       ...prev,
//       [instaField]: zohoField,
//     }));
//   };
//   const saveMapping = () => {
//     const mappingArray = Object.entries(fieldMappings).map(([insta, zoho]) => ({
//       instamartField: insta,
//       zohoField: zoho,
//     }));
//     console.log("Mappings to save:", mappingArray);
//     // Call API to save the mapping
//   };

//   useEffect(() => {
//     async function fetchLeadsData() {
//       try {
//         const data = await getLeadFields(); // Call the reusable function
//         setLeads(data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch leads");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLeadsData();
//   }, []);

//   if (loading) return <div className="leads-container">Loading leads...</div>;
//   if (error) return <div className="leads-container error">Error: {error}</div>;

//   return (
//     <>
//       <div className="mapping-container">
//         <h2>Map Instamart Fields to Zoho CRM Fields</h2>
//         {instamartFields.map((field) => (
//           <div className="field-mapping-row" key={field.api_name}>
//             <span className="instamart-field">{field.display_label}</span>
//             <select
//               value={fieldMappings[field.api_name] || ""}
//               onChange={(e) =>
//                 handleMappingChange(field.api_name, e.target.value)
//               }
//             >
//               <option value="">Select Zoho Field</option>
//               {zohoFields.map((zField) => (
//                 <option key={zField.api_name} value={zField.api_name}>
//                   {zField.display_label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ))}
//       </div>

//       <div className="leads-container">
//         <h1>Leads Data</h1>
//         <pre className="leads-json">{JSON.stringify(leads, null, 2)}</pre>
//       </div>
//     </>
//   );
// };
