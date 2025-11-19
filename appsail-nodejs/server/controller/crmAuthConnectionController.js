import { URLSearchParams } from "url";
import { oauthAxios } from "../utils/oauthAxios.js";
import { datastoreTable, getCurrentUser } from "../service/catalyst.service.js";

export const oauthConnection = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.warn("Missing code parameter in /oauthredirect:", req.query);
    return res.status(400).send("Missing `code` parameter in redirect.");
  }
  let client_id = process.env.CLIENT_ID;
  let client_secret = process.env.CLIENT_SECRET;
  let redirect_uri = `${process.env.REDIRECT_URI}/oauthredirect`;
  console.log("OAuth Redirect URI:", redirect_uri);
  console.log("Received code:", code);
  console.log("Using Client ID:", client_id);
  console.log("Using Client Secret:", client_secret ? "****" : "MISSING");
  // Build params for Zoho token endpoint
  const params = new URLSearchParams({
    client_id: client_id,
    client_secret: client_secret,
    grant_type: "authorization_code",
    redirect_uri: redirect_uri,
    code: code,
  });

  try {
    // 1 Exchange code for OAuth tokens (using axios instance)
    const tokenResp = await oauthAxios.post("/token", params.toString());

    // 2 Catalyst - get user and datastore
    const user = await getCurrentUser(req);
    if (!user) {
      console.warn("User not logged in.");
      return res.status(400).send("User not logged in.");
    }

    const tokensTable = datastoreTable(req, "tokens");
    console.log("tokenResp", tokenResp.data);
    // 3 Prepare row data to store
    const rowData = {
      auth_user_id: user.user_id,
      scope: tokenResp.data.scope,
      api_domain: tokenResp.data.api_domain,
      token_type: tokenResp.data.token_type,
      access_token: tokenResp.data.access_token,
      refresh_token: tokenResp.data.refresh_token,
      expires_in: tokenResp.data.expires_in,
      expiry_time: Date.now() + tokenResp.data.expires_in * 1000,
    };

    // 4 Insert token row
    const inserted = await tokensTable.insertRow(rowData);

    res.json({
      message: "Tokens saved successfully",
      tokens: rowData,
      datastore_response: inserted,
    });
  } catch (error) {
    console.error(
      "Error in /oauthredirect:",
      error?.response?.data || error.message || error
    );
    ``;
    let msg = "Token exchange failed";
    if (error?.response?.data?.error) msg += ": " + error;

    return res.status(500).send(msg);
  }
};
