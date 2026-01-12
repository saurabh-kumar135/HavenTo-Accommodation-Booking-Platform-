const express = require('express');
const router = express.Router();
const phoneVerificationController = require('../controllers/phoneVerificationController');

// @route   POST /api/verify-phone/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', phoneVerificationController.sendPhoneOTP);

// @route   POST /api/verify-phone/verify-otp
// @desc    Verify OTP and create user account
// @access  Public
router.post('/verify-otp', phoneVerificationController.verifyPhoneOTP);

// @route   POST /api/verify-phone/resend-otp
// @desc    Resend OTP to phone number
// @access  Public
router.post('/resend-otp', phoneVerificationController.resendPhoneOTP);

module.exports = router;
