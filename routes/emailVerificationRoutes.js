const express = require('express');
const router = express.Router();
const emailVerificationController = require('../controllers/emailVerificationController');

// Send OTP
router.post('/send-otp', emailVerificationController.sendOTP);

// Verify OTP
router.post('/verify-otp', emailVerificationController.verifyOTP);

// Resend OTP
router.post('/resend-otp', emailVerificationController.resendOTP);

module.exports = router;
