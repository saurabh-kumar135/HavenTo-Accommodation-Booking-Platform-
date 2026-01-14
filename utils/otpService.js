const { Resend } = require('resend');
require('dotenv').config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, firstName) => {
  const mailOptions = {
    from: 'HavenTo <onboarding@resend.dev>', // Resend's test email for free tier
    to: email,
    subject: 'Complete your HavenTo registration',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 30px -30px;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to HavenTo!</h1>
          </div>
          
          <p>Hi ${firstName || 'there'},</p>
          <p>Thank you for signing up with HavenTo! Please use the verification code below to complete your registration:</p>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">${otp}</div>
          </div>
          
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't create an account with HavenTo, you can safely ignore this email.</p>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>© 2024 HavenTo. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const data = await resend.emails.send(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`, data);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: 'HavenTo <onboarding@resend.dev>', // Resend's test email for free tier
    to: email,
    subject: 'Reset your HavenTo password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 30px -30px;">
            <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
          </div>
          
          <p>Hi ${firstName || 'there'},</p>
          <p>We received a request to reset your password for your HavenTo account.</p>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404;"><strong>🔒 Security Notice:</strong> This is a legitimate password reset email from HavenTo.</p>
          </div>
          
          <p>Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">Reset My Password</a>
          </div>
          
          <p style="margin-top: 25px;">Or copy this secure link:</p>
          <div style="background: white; padding: 15px; border-radius: 5px; word-break: break-all; margin: 15px 0;">
            <a href="${resetLink}" style="color: #667eea; text-decoration: none;">${resetLink}</a>
          </div>
          
          <p><strong>⏰ This link expires in 1 hour</strong> for your security.</p>
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.</p>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>© 2024 HavenTo. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const data = await resend.emails.send(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${email}`, data);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail
};
