import express from 'express';
import { autOTP, sendOTP } from '../controllers/otpController.mjs';

const router = express.Router();
router.post('/sendotp',sendOTP);
router.post('/otpvalidation',autOTP);

export default router;