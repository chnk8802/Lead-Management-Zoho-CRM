import { getCurrentUser } from "../service/catalyst.service.js";

export const catalystAuthMiddleware = async (req, res, next) => {
    try {
        const user = await getCurrentUser(req);
        if (!user) {
            console.warn("User not logged in.");
            return res.status(400).send("No authenticated user.");
        }
        req.authenticatedUser = user;
        next();
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).send("Internal server error.");
    }
};