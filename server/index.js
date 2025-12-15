"use strict";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crmConnectionRouter from "./router/crmAuthConnection.router.js";
import authUserRouter from "./router/authUser.router.js";
import crmRouter from "./router/crm.router.js";
import webhookRouter from "./router/indiamart.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const appDir = path.join(__dirname, "../client");
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;

// Serve static files
app.use(express.static(appDir));
// parse JSON bodies
app.use(express.json());

// Routers
app.use("/oauthredirect", crmConnectionRouter);
app.use("/api/user", authUserRouter);
app.use("/api/crm", crmRouter);
app.use("/api/webhook", webhookRouter);

// Fallback to index.html for frontend routes
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(appDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});
