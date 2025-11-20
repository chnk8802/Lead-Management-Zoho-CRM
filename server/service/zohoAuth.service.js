// services/zohoAuth.service.js
import axios from "axios";
import { datastoreTable, getUserToken } from "./catalyst.service.js";
import { toLocalSQLString } from "../utils/helpers.utils.js";

export const refreshZohoAccessToken = async (req) => {
  if (!req) throw new Error("req is required to refresh token");
  try {
    const url = "https://accounts.zoho.in/oauth/v2/token";

    const row = getUserToken(req);

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      refresh_token: row.refresh_token,
    });
    const result = await axios.post(url, params);

    const newAccessToken = result.data.access_token;
    let expiry_time = new Date(Date.now() + result.data.expires_in * 1000);
    const formatted = toLocalSQLString(expiry_time);
    const table = datastoreTable(req, "tokens");

    const updated = await table.updateRow({
      ROWID: row.ROWID,
      access_token: newAccessToken,
      expiry_time: formatted,
    });
    console.log(updated)
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing Zoho access token:", error);
    throw new Error("Failed to refresh Zoho access token");
  }
};
