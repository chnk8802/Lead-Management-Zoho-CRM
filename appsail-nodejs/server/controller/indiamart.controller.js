import jwt from "jsonwebtoken";
import { getRowsByQuery } from "../service/catalyst.service.js";
import { accessToken } from "../service/zohoAuth.service.js";
// import { createLead } from "../service/crm.servce.js";
import { crmAxios } from "../utils/crmAxios.utils.js";

export const generateIndiaMartWebhookURL = async (req, res) => {
  try {
    // Get currently authenticated user
    const user = req.authenticatedUser;
    const userId = user.user_id;

    // JWT secret key from env
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }

    // 10 years = 3650 days = 10 * 365 * 24 * 60 * 60 seconds
    const tenYears = "3650d";

    // Create JWT with user id
    const token = jwt.sign({ userId }, secret, { expiresIn: tenYears });

    // Redirect URI from env file
    const baseUrl = process.env.REDIRECT_URI;
    if (!baseUrl) {
      return res.status(500).json({ error: "REDIRECT_URI not configured" });
    }

    // Final IndiaMART Webhook URL
    const webhookUrl = `${baseUrl}/api/webhook/indiamart/?token=${token}`;

    return res.json({
      webhook_url: webhookUrl,
    });
  } catch (error) {
    console.error("Error generating IndiaMART webhook URL:", error);
    return res.status(500).json({
      error: "Failed to generate webhook URL",
      details: error.message,
    });
  }
};

export const handleIndiaMartWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const token = req.query.token;
    if (!token) {
      throw new Error("Token missing");
    }

    // Verify JWT
    const secret = process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      throw new Error("Invalid token");
    }

    const userId = decoded.userId;
    const query = `SELECT * FROM tokens WHERE auth_user_id = '${userId}'`;
    const rows = await getRowsByQuery(req, query);

    if (!rows || rows.length === 0) {
      throw new Error("No tokens found for user");
    }
    const tokenRows = rows[0].tokens;
    const lead_mapping = JSON.parse(tokenRows.lead_mapping);

    // ------------ Mapping starts here ------------
    const mappedPayload = {};

    for (const key in payload) {
      if (lead_mapping[key]) {
        mappedPayload[lead_mapping[key]] = payload[key];
      }
    }
    // ------------ Mapping ends here ------------
    // and push the data to zoho crm using Zoho CRM APIs.
    const access_token = await accessToken(req, userId);

    try {
      if (!access_token) {
        throw new Error("Access token is required to create lead");
      }
      if (!mappedPayload || Object.keys(mappedPayload).length === 0) {
        throw new Error("Payload is required to create lead");
      }
      const leadData = { data: [mappedPayload] };
      const response = await crmAxios(access_token).post("/Leads", leadData);
      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      console.error("Zoho CRM Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      throw new Error(JSON.stringify(error.response?.data || error.message));
    }
  } catch (err) {
    console.error("Error handling Indiamart webhook:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      stack: err.stack,
    });
  }
};
