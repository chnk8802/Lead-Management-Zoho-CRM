// controllers/crm.controller.js
import { datastore, getCurrentUser } from "../services/catalyst.service.js";
import { crmAxios } from "../utils/zohoAxios.js";

export const getLeads = async (req, res) => {
  try {
    // 1️⃣ Get catalyst user
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "No authenticated user" });
    }

    // 2️⃣ Fetch tokens from Catalyst
    const store = datastore(req);
    const tokenTable = store.table("tokens");
    const rows = await tokenTable.getRows({ auth_user_id: user.user_id });

    if (rows.length === 0) {
      return res.status(404).json({ error: "No Zoho OAuth tokens found for this user" });
    }

    const { access_token } = rows[0];

    // 3️⃣ Create CRM axios instance with the saved access token
    const api = crmAxios(access_token);

    // 4️⃣ Call Zoho CRM v8 Leads API
    const response = await api.get("/Leads");

    return res.json(response.data);

  } catch (error) {
    console.error("Error fetching leads:", error?.response?.data || error.message);

    return res.status(500).json({
      error: "Failed to fetch leads from Zoho CRM",
      details: error?.response?.data || error.message,
    });
  }
};

export const createLead = async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "No authenticated user" });
    }
    const store = datastore(req);
    const tokenTable = store.table("tokens");
    const rows = await tokenTable.getRows({ auth_user_id: user.user_id });
    if (rows.length === 0) {
      return res.status(404).json({ error: "No Zoho OAuth tokens found for this user" });
    }
    const { access_token } = rows[0];
    const api = crmAxios(access_token);
    const leadData = req.body;
    const response = await api.post("/Leads", { data: [leadData] });
    return res.json(response.data);
  } catch (error) {
    console.error("Error creating lead:", error?.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to create lead in Zoho CRM",
      details: error?.response?.data || error.message,
    });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const leadId = req.params.id;
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "No authenticated user" });
    }
    const store = datastore(req);
    const tokenTable = store.table("tokens");
    const rows = await tokenTable.getRows({ auth_user_id: user.user_id });
    if (rows.length === 0) {
      return res.status(404).json({ error: "No Zoho OAuth tokens found for this user" });
    }
    const { access_token } = rows[0];
    const api = crmAxios(access_token);
    const response = await api.get(`/Leads/${leadId}`);
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching lead by ID:", error?.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to fetch lead by ID from Zoho CRM",
      details: error?.response?.data || error.message,
    });
  }
};