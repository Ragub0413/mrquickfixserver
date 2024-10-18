import express from 'express'
import { getAllData } from '../controllers/notificationController.mjs';

const router  = express.Router();

router.get('/', getAllData);
export default router