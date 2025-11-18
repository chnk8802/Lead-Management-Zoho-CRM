import catalyst from "zcatalyst-sdk-node";

export const getUser = async (req) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const userManagement = catalystApp.userManagement();
    const currentUser = await userManagement.getCurrentUser();

    if (!currentUser) console.warn("No user found");
    return currentUser;
  } catch (err) {
    console.error("Catalyst getUser error:", err);
    throw err;
  }
};
