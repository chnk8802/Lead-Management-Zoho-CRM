import express from "express";
import { getAuthUser } from "../controller/authUserController.js";

const router = express.Router();
router.get("/", getAuthUser);

export default router;