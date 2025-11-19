import express from 'express'
import {oauthConnection} from '../controller/crmAuthConnectionController.js'

const router = express.Router()
router.get("/", oauthConnection);

export default router