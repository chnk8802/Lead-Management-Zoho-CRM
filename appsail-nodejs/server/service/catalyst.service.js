import catalyst from "zcatalyst-sdk-node";

export const app = (req) => {
  try {
    return catalyst.initialize(req);
  } catch (err) {
    console.error("Catalyst initialization failed:", err);
    throw new Error("Catalyst initialization failed");
  }
};

export const datastore = (req) => {
  try {
    return app(req).datastore();
  } catch (err) {
    console.error("Datastore initialization failed:", err);
    throw new Error("Datastore init failed");
  }
};

export const datastoreTable = (req, tableName) => {
  try {
    const ds = datastore(req);
    return ds.table(tableName);
  } catch (err) {
    console.error(`Datastore table (${tableName}) initialization failed:`, err);
    throw new Error("Datastore table init failed");
  }
};

export const userManagement = (req) => {
  try {
    return app(req).userManagement();
  } catch (err) {
    console.error("Fetching userManagement failed:", err);
    throw new Error("UserManagement init failed");
  }
};

export const getCurrentUser = async (req) => {
  try {
    const userMgmt = userManagement(req);
    if (!userMgmt) return null;
    return await userMgmt.getCurrentUser();
  } catch (err) {
    console.error("getCurrentUser failed:", err);
    return null;
  }
};

export const zcql = async (req) => {
  try {
    return app(req).zcql();
  } catch (err) {
    console.error("ZCQL execution failed:", err);
    throw new Error("ZCQL execution failed");
  }
};

export const getRowsByQuery = async (req, query) => {
  try {
    const zcqlInstance = await zcql(req);
    const result = await zcqlInstance.executeZCQLQuery(query);
    return result;
  } catch (err) {
    console.error("getRowsByQuery failed:", err);
    throw new Error("getRowsByQuery failed");
  }
};

export const getUserToken = async (req) => {
  const zcql = app(req).zcql();
  const user = await getCurrentUser(req);
  if (!user) {
    throw new Error("No authenticated user");
  }
  const userId = user.user_id;
  const query = `SELECT * FROM tokens WHERE auth_user_id = '${userId}'`;
  const rows = await zcql.executeZCQLQuery(query);
  return rows.length ? rows[0].tokens : null;
};