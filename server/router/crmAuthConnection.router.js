import express from 'express'
import {oauthConnection} from '../controller/crmAuthConnection.controller.js'

const router = express.Router()
router.get("/", oauthConnection);

export default router