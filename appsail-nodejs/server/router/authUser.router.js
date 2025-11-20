import express from "express";
import { getAuthUser } from "../controller/authUser.controller.js";

const router = express.Router();
router.get("/", getAuthUser);

export default router;