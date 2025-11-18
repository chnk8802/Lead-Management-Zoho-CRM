// app.get("/oauthredirect", async (req, res) => {
//   const { code } = req.query;
//   if (!code) {
//     console.warn("No code parameter present on /oauthredirect", req.query);
//     return res
//       .status(400)
//       .send("No `code` parameter found in the query string.");
//   }

//   const tokenUrl = `https://accounts.zoho.in/oauth/v2/token`;

//   const params = new URLSearchParams({
//     client_id: process.env.CLIENT_ID || "",
//     client_secret: process.env.CLIENT_SECRET || "",
//     grant_type: "authorization_code",
//     redirect_uri: `${process.env.REDIRECT_URI}/oauthredirect`,
//     code: code,
//   });

//   try {
//     const tokenResp = await axios.post(tokenUrl, params.toString());

//     const catalystApp = catalyst.initialize(req);

//     const datastore = catalystApp.datastore();
//     const table = datastore.table("tokens");

//     const userManagement = catalystApp.userManagement();

//     let user = await userManagement.getCurrentUser();

//     if (!user) {
//       console.warn("No logged in user found");
//       return res.status(400).send("No logged in user found");
//     }

//     const rowData = {
//       refresh_token: tokenResp.data.refresh_token,
//       expires_in: user.user_id,
//     };

//     const insertedRow = await table.insertRow(rowData);

//     res.json({
//       message: "Tokens saved successfully",
//       tokens: rowData,
//       datastore_response: insertedRow,
//     });
//   } catch (error) {
//     console.error("Error in /oauthredirect route:", error?.response?.data || error.message || error);

//     let errorMsg = "Token exchange failed";
//     if (error?.response?.data?.error) {
//       errorMsg += ": " + error.response.data.error;
//     } else if (error?.message) {
//       errorMsg += ": " + error.message;
//     }

//     res.status(500).send(errorMsg);
//   }
// });