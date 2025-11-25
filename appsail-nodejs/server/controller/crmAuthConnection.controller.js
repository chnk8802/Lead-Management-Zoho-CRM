import { URLSearchParams } from "url";
import { oauthAxios } from "../utils/oauthAxios.utils.js";
import {
  datastoreTable,
  getRowsByQuery,
} from "../service/catalyst.service.js";
import { toLocalSQLString } from "../utils/helpers.utils.js";

export const oauthConnection = async (req, res) => {
  try {
    const user = req.authenticatedUser;
    const { code } = req.query;

    if (!code) {
      console.warn("Missing code parameter in /oauthredirect:", req.query);
      return res.status(400).send("Missing `code` parameter in redirect.");
    }
    let client_id = process.env.CLIENT_ID;
    let client_secret = process.env.CLIENT_SECRET;
    let redirect_uri = `${process.env.REDIRECT_URI}/oauthredirect`;

    const params = new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      grant_type: "authorization_code",
      redirect_uri: redirect_uri,
      code: code,
    });

    const tokenResp = await oauthAxios.post("/token", params.toString());

    // const user = await getCurrentUser(req);
    // if (!user) {
    //   console.warn("User not logged in.");
    //   return res.status(400).send("User not logged in.");
    // }

    // check if tokens already exist for this user and delete them
    const existingRows = await getRowsByQuery(
      req,
      `SELECT ROWID FROM tokens WHERE auth_user_id = '${user.user_id}'`
    );
    if (existingRows.length > 0) {
      for (const row of existingRows) {
        await datastoreTable(req, "tokens").deleteRow(row.ROWID);
      }
    }

    const tokensTable = datastoreTable(req, "tokens");

    let expiry_time = new Date(Date.now() + tokenResp.data.expires_in * 1000);
    const formatted = toLocalSQLString(expiry_time);

    const rowData = {
      auth_user_id: user.user_id,
      scope: tokenResp.data.scope,
      api_domain: tokenResp.data.api_domain,
      token_type: tokenResp.data.token_type,
      access_token: tokenResp.data.access_token,
      refresh_token: tokenResp.data.refresh_token,
      expires_in: tokenResp.data.expires_in,
      expiry_time: formatted,
    };

    const inserted = await tokensTable.insertRow(rowData);

    return res.redirect(`${process.env.REDIRECT_URI}/oauth-success`);
  } catch (error) {
    console.error("Error in /oauthredirect:", error);
    return res.status(500).send("Token exchange failed");
  }
};
