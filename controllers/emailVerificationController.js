const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateOTP, sendOTPEmail } = require('../utils/otpService');
const { 
  storePendingVerification, 
  getPendingVerification, 
  removePendingVerification 
} = require('../utils/otpStorage');

// Send OTP for email verification
exports.sendOTP = async (req, res) => {
  try {
    const { email, firstName, lastName, password, userType } = req.body;

    // Check if email already exists with verified account
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.emailVerified) {
      return res.status(400).json({
        success: false,
        errors: ['Email already registered']
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store in temporary memory (NOT in database)
    storePendingVerification(email, {
      firstName,
      lastName,
      password: hashedPassword,
      userType
    }, otp, otpExpires);

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, firstName);

    if (!emailResult.success) {
      // Remove from temporary storage if email fails
      removePendingVerification(email);
      return res.status(500).json({
        success: false,
        errors: ['Failed to send verification email. Please try again.']
      });
    }

    res.json({
      success: true,
      message: 'Verification code sent to your email!'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      errors: ['An error occurred. Please try again.']
    });
  }
};

// Verify OTP and complete registration
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Get from temporary storage
    const pendingData = getPendingVerification(email);

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        errors: ['Verification session expired. Please sign up again.']
      });
    }

    // Check OTP expiry
    if (Date.now() > pendingData.expiresAt) {
      removePendingVerification(email);
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
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.emailVerified) {
      removePendingVerification(email);
      return res.status(400).json({
        success: false,
        errors: ['Email already verified. Please login.']
      });
    }

    // CREATE user in database (ONLY after successful OTP verification)
    const newUser = new User({
      firstName: pendingData.firstName,
      lastName: pendingData.lastName,
      email: email,
      password: pendingData.password, // Already hashed
      userType: pendingData.userType,
      emailVerified: true // Mark as verified immediately
    });
    await newUser.save();

    // Remove from temporary storage
    removePendingVerification(email);

    // Create session
    req.session.isLoggedIn = true;
    req.session.user = newUser;

    res.json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      errors: ['An error occurred. Please try again.']
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Get from temporary storage
    const pendingData = getPendingVerification(email);

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
    storePendingVerification(email, {
      firstName: pendingData.firstName,
      lastName: pendingData.lastName,
      password: pendingData.password,
      userType: pendingData.userType
    }, otp, otpExpires);

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, pendingData.firstName);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        errors: ['Failed to send verification email. Please try again.']
      });
    }

    res.json({
      success: true,
      message: 'New verification code sent to your email!'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      errors: ['An error occurred. Please try again.']
    });
  }
};
