import jwt from "jsonwebtoken";
import { getRowsByQuery } from "../service/catalyst.service.js";
import { accessToken } from "../service/zohoAuth.service.js";
import { crmAxios } from "../utils/crmAxios.utils.js";
import { getLeadsRelatedList, getProduct } from "../service/crm.servce.js";

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
    const payload = req.body.RESPONSE;
    if (!payload) {
      throw new Error("Invalid payload");
    }

    const instamartProduct = payload["QUERY_PRODUCT_NAME"];

    if (!instamartProduct) {
      throw new Error("Indiamart product name is missing in payload");
    }

    const token = req.query.token;
    if (!token) {
      throw new Error("Token missing");
    }

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

    const mappedPayload = {};

    for (const key in payload) {
      if (lead_mapping[key]) {
        mappedPayload[lead_mapping[key]] = payload[key];
      }
    }

    const access_token = await accessToken(req, userId);

    if (!access_token) {
      throw new Error("Access token is required to create lead");
    }

    const api = crmAxios(access_token);

    if (!mappedPayload || Object.keys(mappedPayload).length === 0) {
      throw new Error("Payload is required to create lead");
    }

    let response;
    const leadData = { data: [mappedPayload] };
    try {
      response = await api.post("/Leads", leadData);
    } catch (error) {
      return res.status(500).json({
        error: "Error creating lead in Zoho CRM",
        message: error.message,
        stack: error.stack,
      });
    }

    const createdLeadId = response.data.data[0].details.id;

    if (!response || !response.data) {
      throw new Error("Invalid response from Zoho CRM while creating lead");
    }

    const product = await getProduct(access_token, instamartProduct);
    const productRelatedList = await getLeadsRelatedList(access_token);
    const productId = product.id;
    // const relatedListId = productRelatedList.id;
    const relatedListApiName = productRelatedList.api_name;

    const payloadData = {
      data: [{ id: productId }],
    };

    let relatedListResponse;
    try {
      relatedListResponse = await api.put(
        `/Leads/${createdLeadId}/${relatedListApiName}`,
        payloadData
      );
    } catch (error) {
      return res.status(500).json({
        error: "Error updating related list in Zoho CRM",
        message: error.message,
        stack: error.stack,
      });
    }
    if (
      !relatedListResponse ||
      !relatedListResponse.data ||
      !relatedListResponse.data.data
    ) {
      throw new Error(
        "Invalid response from Zoho CRM while updating related list"
      );
    }

    return res.status(200).json({
      data: [
        {
          code: "SUCCESS",
          message: "Lead created successfully with related product",
          status: "success",
        },
      ],
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};