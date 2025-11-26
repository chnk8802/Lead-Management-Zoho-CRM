// services/zohoAuth.service.js
import axios from "axios";
import {
  datastoreTable,
  getRowsByQuery,
} from "./catalyst.service.js";
import { getAccessToken, toLocalSQLString } from "../utils/helpers.utils.js";

// Helper: check if token is expired
const isExpired = (expiryTime) => {
  if (!expiryTime) return true;

  const expiry = new Date(expiryTime).getTime();
  const now = Date.now();
  return expiry <= now;
};

export const accessToken = async (req) => {
  try {
    if (!req) throw new Error("req is required to refresh token");

    const user = req.authenticatedUser;
    const table = datastoreTable(req, "tokens");

    const query = `SELECT * FROM tokens WHERE auth_user_id = '${user.user_id}'`;
    const rows = await getRowsByQuery(req, query);

    if (!rows || rows.length === 0) {
      throw new Error("No token found for user");
    }

    const { ROWID, access_token, refresh_token, expiry_time } = rows[0].tokens;

    // -------------------------------------------------------------------
    // 1️⃣ If token is NOT expired → return existing token
    // -------------------------------------------------------------------
    if (access_token && !isExpired(expiry_time)) {
      return access_token;
    }

    // -------------------------------------------------------------------
    // 2️⃣ Token EXPIRED → refresh using refresh_token
    // -------------------------------------------------------------------
    const url = "https://accounts.zoho.in/oauth/v2/token";

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token,
    });

    const result = await axios.post(url, params);

    const newAccessToken = result.data.access_token;
    const expiresIn = result.data.expires_in;
    const newExpiry = new Date(Date.now() + expiresIn * 1000);
    const formattedExpiry = toLocalSQLString(newExpiry);

    // -------------------------------------------------------------------
    // 3️⃣ Update datastore with new access token + expiry
    // -------------------------------------------------------------------
    const UpdatePayload = {
      ROWID,
      access_token: newAccessToken,
      expiry_time: formattedExpiry,
    };
    await table.updateRow(UpdatePayload);
    const usableAccessToken = await getAccessToken(req);
    return usableAccessToken;
  } catch (error) {
    console.error(
      "Error refreshing Zoho access token:",
      error.response?.data || error
    );
    throw new Error("Failed to refresh Zoho access token");
  }
};
