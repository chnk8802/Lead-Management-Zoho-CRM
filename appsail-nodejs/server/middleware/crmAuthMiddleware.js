// import axios from "axios";
// export const crmAuthMiddleware = async (req, res, next) => {
//     try {
//         const catalystApp = req.catalystApp;
//         const userId = req.user?.user_id;

//         if (!userId) {
//             return res.status(401).json({ error: "No authenticated user" });
//         }
//         let query = `SELECT * FROM tokens WHERE auth_user_id = '${userId}'`;
//         const zcql = catalystApp.zcql();

//         const rows = await zcql.executeZCQLQuery(query);

//         if (!rows.length) {
//             return res.status(400).json({ error: "CRM is not connected for this user" });
//         }

//         let row = rows[0].tokens;

//         // Check expiry
//         if (Date.now() > row.expiry_time) {
//             token = await refreshZohoToken(row, catalystApp);
//         }

//         // Inject CRM data for downstream handlers
//         req.crm = {
//             access_token: token,
//             api_domain: row.api_domain
//         };

//         next();

//     } catch (error) {
//         console.error("CRM Auth Middleware failed:", error);
//         res.status(500).json({ error: "CRM token validation failed" });
//     }
// };
// const refreshZohoToken = async (row, app) => {
//     const url = "https://accounts.zoho.in/oauth/v2/token";

//     const params = new URLSearchParams({
//         grant_type: "refresh_token",
//         client_id: process.env.ZOHO_CLIENT_ID,
//         client_secret: process.env.ZOHO_CLIENT_SECRET,
//         refresh_token: row.refresh_token,
//     });

//     const response = await axios.post(url, params);

//     const newAccessToken = response.data.access_token;
//     const newExpiry = Date.now() + response.data.expires_in * 1000;

//     const datastore = app.datastore();
//     const table = datastore.table("tokens");

//     await table.updateRow({
//         id: row.id,
//         access_token: newAccessToken,
//         expiry_time: newExpiry
//     });

//     return newAccessToken;
// }