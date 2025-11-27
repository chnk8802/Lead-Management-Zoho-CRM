import express from 'express'
import { generateIndiaMartWebhookURL, handleIndiaMartWebhook } from '../controller/indiamart.controller.js';
import { catalystAuthMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()
router.get("/generate-webhook-url", catalystAuthMiddleware, generateIndiaMartWebhookURL)
router.post("/indiamart", handleIndiaMartWebhook);

export default router