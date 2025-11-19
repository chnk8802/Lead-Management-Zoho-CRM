// services/zohoAuth.service.js
import axios from "axios";
import { datastoreTable } from "./catalyst.service";

export const refreshZohoAccessToken = async (row, app) => {
  const url = "https://accounts.zoho.in/oauth/v2/token";

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: row.refresh_token
  });

  const res = await axios.post(url, params);

  console.log("Refreshed Zoho token response:", res.data);

  const newAccessToken = res.data.access_token;
  const newExpiry = Date.now() + res.data.expires_in * 1000;

  const table = datastoreTable(req, "tokens");

  await table.updateRow({
    ROWID: row.ROWID,
    access_token: newAccessToken,
    expiry_time: newExpiry
  });

  return {
    access_token: newAccessToken,
    expiry_time: newExpiry
  };
};
