import express from 'express'
import { getLeadFields, getLeads } from '../controller/crm.controller.js'

const router = express.Router()
router.get("/leads", getLeads);
router.get("/lead-fields", getLeadFields);

export default router