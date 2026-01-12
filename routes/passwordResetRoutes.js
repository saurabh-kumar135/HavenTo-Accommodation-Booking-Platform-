const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

// Request password reset
router.post('/request', passwordResetController.requestPasswordReset);

// Validate reset token
router.get('/validate/:token', passwordResetController.validateResetToken);

// Reset password
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;
