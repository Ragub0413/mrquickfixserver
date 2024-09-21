import express from 'express';

import { getAllJobOders } from '../controllers/jobordercontroller.mjs';
const router = express.Router();

router.get('/',getAllJobOders);
export default router;