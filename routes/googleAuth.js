const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth flow
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure'
  }),
  (req, res) => {
    // Successful authentication
    req.session.isLoggedIn = true;
    req.session.user = req.user;
    
    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/success`);
  }
);

// @route   GET /api/auth/google/success
// @desc    Return user data after successful Google auth
// @access  Private
router.get('/google/success', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userType: req.user.userType,
        profilePicture: req.user.profilePicture,
        authProvider: req.user.authProvider
      }
    });
  } else {
    res.status(401).json({
      success: false,
      errors: ['Not authenticated']
    });
  }
});

// @route   GET /api/auth/google/failure
// @desc    Handle Google OAuth failure
// @access  Public
router.get('/google/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
});

module.exports = router;
