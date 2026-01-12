// Temporary in-memory storage for pending OTP verifications
// This prevents database pollution with unverified users

const pendingVerifications = new Map();

// Cleanup expired OTPs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingVerifications.entries()) {
    if (now > data.expiresAt) {
      pendingVerifications.delete(email);
      console.log(`🗑️  Cleaned up expired OTP for ${email}`);
    }
  }
}, 10 * 60 * 1000); // 10 minutes

// Store pending verification
const storePendingVerification = (email, userData, otp, expiresAt) => {
  pendingVerifications.set(email, {
    ...userData,
    otp,
    expiresAt
  });
  console.log(`💾 Stored pending verification for ${email}`);
};

// Get pending verification
const getPendingVerification = (email) => {
  return pendingVerifications.get(email);
};

// Remove pending verification
const removePendingVerification = (email) => {
  pendingVerifications.delete(email);
  console.log(`✅ Removed pending verification for ${email}`);
};

module.exports = {
  storePendingVerification,
  getPendingVerification,
  removePendingVerification
};
