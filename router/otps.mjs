import express from 'express';
import { autOTP, sendOTP } from '../controllers/otpController.mjs';

const router = express.Router();
router.post('/sendotp/:email',sendOTP);
router.post('/otpvalidation/:email',autOTP);

export default router;