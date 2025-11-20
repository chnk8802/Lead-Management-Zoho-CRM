import { getCurrentUser, getRowsByQuery} from "../service/catalyst.service.js";

export const getAuthUser = async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "No authenticated user" });
    }

    const query = `SELECT * FROM tokens WHERE auth_user_id = '${user.user_id}'`;
    const rows = await getRowsByQuery(req, query);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No tokens found for user" });
    }
    const tokenRow = rows[0].tokens || {};
    res.json({
      user: {
        user_id: tokenRow.auth_user_id,
        ROWID: tokenRow.ROWID,
        scope: tokenRow.scope,
        api_domain: tokenRow.api_domain,
      },
    });
  } catch (error) {
    console.error("Error in getAuthUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
