import {
  datastoreTable,
  getRowsByQuery,
} from "../service/catalyst.service.js";

export const getAuthUser = async (req, res) => {
  try {
    const user = req.authenticatedUser;
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

export const getMapping = async (req, res) => {
  try {
    const user = req.authenticatedUser;
    const query = `SELECT * FROM tokens WHERE auth_user_id = '${user.user_id}'`;
    const rows = await getRowsByQuery(req, query);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No tokens found for user" });
    }
    const tokenRow = rows[0].tokens || {};
    const leadMapping = tokenRow.lead_mapping
      ? JSON.parse(tokenRow.lead_mapping)
      : null;
    res.json({ lead_mapping: leadMapping });
  } catch (error) {
    console.error("Error in getMapping:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const saveMapping = async (req, res) => {
  try {
    const user = req.authenticatedUser;
    const { mapping } = req.body;
    const table = datastoreTable(req, "tokens");

    const query = `SELECT * FROM tokens WHERE auth_user_id = '${user.user_id}'`;
    const rows = await getRowsByQuery(req, query);

    if (!rows || rows.length === 0) {
      throw new Error("No token found for user");
    }

    const { ROWID } = rows[0].tokens;

    const UpdatePayload = {
      ROWID,
      lead_mapping: JSON.stringify(mapping),
    };
    try {
      await table.updateRow(UpdatePayload);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error stringifying mapping:", error);
    }
  } catch (error) {
    console.error(
      "Error saving lead mapping:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      error: "Failed to save lead mapping",
      details: error?.response?.data || error.message,
    });
  }
};
