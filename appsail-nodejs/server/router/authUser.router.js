import express from "express";
import { getAuthUser, getMapping, saveMapping } from "../controller/authUser.controller.js";
import { catalystAuthMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", catalystAuthMiddleware, getAuthUser);
router.get("/mapping", catalystAuthMiddleware, getMapping);
router.post("/save-mapping", catalystAuthMiddleware, saveMapping);

export default router;