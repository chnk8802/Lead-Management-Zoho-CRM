import {crmAxios} from "../utils/crmAxios.utils.js"
import { getAccessToken } from "../utils/helpers.utils.js";

export const getLeads = async (req, res) => {
  try {
    const access_token = await getAccessToken(req);

    const api = crmAxios(access_token);

    const response = await api.get("/Leads?fields=Last_Name");

    return res.json(response.data);

  } catch (error) {
    console.error("Error fetching leads:", error?.response?.data || error.message);

    return res.status(500).json({
      error: "Failed to fetch leads from Zoho CRM",
      details: error?.response?.data || error.message,
    });
  }
};

export const getLeadFields = async (req, res) => {
  try {
    const access_token = await getAccessToken(req);

    const api = crmAxios(access_token);
    const response = await api.get("/settings/fields?module=Leads");
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching lead fields:", error?.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to fetch lead fields from Zoho CRM",
      details: error?.response?.data || error.message,
    });
  }
};