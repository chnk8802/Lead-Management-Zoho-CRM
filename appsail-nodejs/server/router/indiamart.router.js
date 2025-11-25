import express from 'express'
import { getIndiamartLeadData } from '../controller/indiamart.controller.js';
import { catalystAuthMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()
router.post("/indiamart", catalystAuthMiddleware, getIndiamartLeadData);

export default router