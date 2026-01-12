const twilio = require('twilio');
require('dotenv').config();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create Twilio client
const createTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return null;
  }
  
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
};

// Send OTP via SMS
const sendPhoneOTP = async (phoneNumber, otp, firstName) => {
  // Check if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.log('\n========================================');
    console.log('📱 PHONE OTP (Console Mode)');
    console.log('========================================');
    console.log(`To: ${phoneNumber}`);
    console.log(`Name: ${firstName || 'User'}`);
    console.log(`\nYour verification code is: ${otp}`);
    console.log('\n⚠️  Twilio not configured - OTP printed to console for testing');
    console.log('To enable SMS sending, add Twilio credentials to .env file');
    console.log('========================================\n');
    
    return { success: true, consoleMode: true };
  }

  const client = createTwilioClient();
  
  const message = `Hello ${firstName || 'there'}!\n\nYour HavenTo verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this message.`;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log(`✅ SMS sent to ${phoneNumber}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    
    // Fallback to console logging if SMS fails
    console.log('\n========================================');
    console.log('📱 PHONE OTP (Fallback Mode)');
    console.log('========================================');
    console.log(`To: ${phoneNumber}`);
    console.log(`OTP: ${otp}`);
    console.log('\n⚠️  SMS sending failed - OTP printed to console');
    console.log(`Error: ${error.message}`);
    console.log('========================================\n');
    
    return { success: true, consoleMode: true };
  }
};

module.exports = {
  generateOTP,
  sendPhoneOTP
};
