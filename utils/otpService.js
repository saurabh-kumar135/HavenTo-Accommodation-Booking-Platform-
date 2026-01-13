const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, firstName) => {
  const mailOptions = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@havento.com',
      name: 'HavenTo'
    },
    subject: 'Verify Your Email - In Order To Complete Your Registration',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to HavenTo!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName || 'there'},</p>
            <p>Thank you for signing up with HavenTo! To complete your registration, please verify your email address using the OTP code below:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't create an account with HavenTo, please ignore this email.</p>
            
            <div class="footer">
              <p>© 2024 HavenTo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@havento.com',
      name: 'HavenTo'
    },
    subject: 'Reset Your Password - HavenTo',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName || 'there'},</p>
            <p>We received a request to reset your password for your HavenTo account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            
            <div class="footer">
              <p>© 2024 HavenTo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail
};
