'use strict'
import "dotenv/config";
import express from "express"
import path from "path"
import { fileURLToPath } from "url";
import crmConnectionRouter from "./router/crmAuthConnectionRouter.js"
import authUserRouter from "./router/authUserRouter.js"

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appDir = path.join(__dirname, '../client')
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;
 
app.get('/', (req, res) => {
  res.sendFile(path.join(appDir, 'index.html'))
})

app.use("/oauthredirect", crmConnectionRouter);
app.use("/api/user", authUserRouter);

app.use(express.static(appDir));
 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});