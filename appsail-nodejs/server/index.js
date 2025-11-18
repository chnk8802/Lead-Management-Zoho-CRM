'use strict'
import "dotenv/config";
import express from "express"
import path from "path"
import { fileURLToPath } from "url";

import {getUser} from "./service/userService.js"

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appDir = path.join(__dirname, '../client')
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;
 
app.get('/', (req, res) => {
  res.sendFile(path.join(appDir, 'index.html'))
})

app.get('/api/user', async (req, res) => {
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ message: "No logged-in user" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/oauthredirect", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    console.warn("No code parameter present on /oauthredirect", req.query);
    return res
      .status(400)
      .send("No `code` parameter found in the query string.");
  }

  const tokenUrl = `https://accounts.zoho.in/oauth/v2/token`;

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID || "",
    client_secret: process.env.CLIENT_SECRET || "",
    grant_type: "authorization_code",
    redirect_uri: `${process.env.REDIRECT_URI}/oauthredirect`,
    code: code,
  });

  try {
    const tokenResp = await axios.post(tokenUrl, params.toString());

    const catalystApp = catalyst.initialize(req);

    const datastore = catalystApp.datastore();
    const table = datastore.table("tokens");

    const userManagement = catalystApp.userManagement();

    let user = await userManagement.getCurrentUser();

    if (!user) {
      console.warn("No logged in user found");
      return res.status(400).send("No logged in user found");
    }

    const rowData = {
      refresh_token: tokenResp.data.refresh_token,
      expires_in: tokenResp.data.expires_in, 
      user_id: user.user_id,
    };

    const insertedRow = await table.insertRow(rowData);

    res.json({
      message: "Tokens saved successfully",
      tokens: rowData,
      datastore_response: insertedRow,
    });
  } catch (error) {
    console.error("Error in /oauthredirect route:", error?.response?.data || error.message || error);

    let errorMsg = "Token exchange failed";
    if (error?.response?.data?.error) {
      errorMsg += ": " + error.response.data.error;
    } else if (error?.message) {
      errorMsg += ": " + error.message;
    }

    res.status(500).send(errorMsg);
  }
});

app.use(express.static(appDir));
 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});