import { getCurrentUser, getUserToken } from "../service/catalyst.service.js";

export const toLocalSQLString = (date) => {
  return date
    .toLocaleString("sv-SE", { hour12: false })
    .replace("T", " ");
}

export const getAccessToken = async (req) => {
  const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "No authenticated user" });
    }
    const rows = await getUserToken(req);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No Zoho OAuth tokens found for this user" });
    }
    const { access_token } = rows;
    if (!access_token) {
      throw new Error("Access token not found");
    }
    return access_token;
}