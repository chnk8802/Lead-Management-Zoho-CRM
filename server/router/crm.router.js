import express from 'express'
import { getLeadFields, getLeads } from '../controller/crm.controller.js'
import { catalystAuthMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()
router.get("/leads", catalystAuthMiddleware, getLeads);
router.get("/lead-fields", catalystAuthMiddleware, getLeadFields);

export default router