const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateOTP, sendPhoneOTP } = require('../utils/smsService');
const { 
  storePendingVerification, 
  getPendingVerification, 
  removePendingVerification 
} = require('../utils/otpStorage');

// Send OTP for phone verification
exports.sendPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber, firstName, lastName, password, userType } = req.body;

    // Validate phone number format (basic validation)
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({
        success: false,
        errors: ['Please enter a valid phone number']
      });
    }

    // Check if phone number already exists with verified account
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser && existingUser.phoneVerified) {
      return res.status(400).json({
        success: false,
        errors: ['Phone number already registered']
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store in temporary memory (NOT in database)
    storePendingVerification(phoneNumber, {
      firstName,
      lastName,
      password: hashedPassword,
      userType,
      authMethod: 'phone'
    }, otp, otpExpires);

    // Send OTP via SMS
    const smsResult = await sendPhoneOTP(phoneNumber, otp, firstName);

    if (!smsResult.success) {
      // Remove from temporary storage if SMS fails
      removePendingVerification(phoneNumber);
      return res.status(500).json({
        success: false,
        errors: ['Failed to send verification code. Please try again.']
      });
    }

    res.json({
      success: true,
      message: 'Verification code sent to your phone!',
      consoleMode: smsResult.consoleMode || false
    });

  } catch (error) {
    console.error('Send phone OTP error:', error);
    res.status(500).json({
      success: false,
      errors: ['An error occurred. Please try again.']
    });
  }
};

// Verify phone OTP and complete registration
exports.verifyPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Get from temporary storage
    const pendingData = getPendingVerification(phoneNumber);

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        errors: ['Verification session expired. Please sign up again.']
      });
    }

    // Check OTP expiry
    if (Date.now() > pendingData.expiresAt) {
      removePendingVerification(phoneNumber);
      return res.status(400).json({
        success: false,
        errors: ['Verification code expired. Please request a new one.']
      });
    }

    // Verify OTP
    if (pendingData.otp !== otp) {
      return res.status(400).json({
        success: false,
        errors: ['Invalid verification code']
      });
    }

    // Check if user was created in the meantime (edge case)
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser && existingUser.phoneVerified) {
      removePendingVerification(phoneNumber);
      return res.status(400).json({
        success: false,
        errors: ['Phone number already verified. Please login.']
      });
    }

    // CREATE user in database (ONLY after successful OTP verification)
    const newUser = new User({
      firstName: pendingData.firstName,
      lastName: pendingData.lastName,
      phoneNumber: phoneNumber,
      password: pendingData.password, // Already hashed
      userType: pendingData.userType,
      phoneVerified: true, // Mark as verified immediately
      authProvider: 'phone',
      authMethod: 'phone'
    });
    await newUser.save();

    // Remove from temporary storage
    removePendingVerification(phoneNumber);

    // Create session
    req.session.isLoggedIn = true;
    req.session.user = newUser;

    res.json({
      success: true,
      message: 'Phone verified successfully!',
      user: {
        id: newUser._id,
        phoneNumber: newUser.phoneNumber,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType
      }
    });

  } catch (error) {
    console.error('Verify phone OTP error:', error);
    res.status(500).json({
      success: false,
      errors: ['An error occurred. Please try again.']
    });
  }
};

// Resend phone OTP
exports.resendPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Get from temporary storage
    const pendingData = getPendingVerification(phoneNumber);

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        errors: ['Verification session expired. Please sign up again.']
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Update temporary storage with new OTP
    storePendingVerification(phoneNumber, {
      firstName: pendingData.firstName,
      lastName: pendingData.lastName,
      password: pendingData.password,
      userType: pendingData.userType,
      authMethod: 'phone'
    }, otp, otpExpires);

    // Send OTP via SMS
    const smsResult = await sendPhoneOTP(phoneNumber, otp, pendingData.firstName);

    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        errors: ['Failed to send verification code. Please try again.']
      });
    }

    res.json({
      success: true,
      message: 'New verification code sent to your phone!',
      consoleMode: smsResult.consoleMode || false
    });

  } catch (error) {
    console.error('Resend phone OTP error:', error);
    res.status(500).json({
      success: false,
      errors: ['An error occurred. Please try again.']
    });
  }
};
