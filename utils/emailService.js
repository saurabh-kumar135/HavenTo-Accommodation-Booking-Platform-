const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const createTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('\n========================================');
    console.log('📧 PASSWORD RESET EMAIL (Console Mode)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Subject: Password Reset Request`);
    console.log(`\nReset Link: ${resetUrl}`);
    console.log('\n⚠️  Gmail not configured - Link printed to console for testing');
    console.log('To enable email sending, add Gmail credentials to .env file');
    console.log('========================================\n');
    
    return { success: true, consoleMode: true };
  }
  
  const transporter = createTransport();
  
  const mailOptions = {
    from: `"HavenTo" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password for your HavenTo account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <div class="footer">
              <p>© 2024 HavenTo. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // Fallback to console logging if email fails
    console.log('\n========================================');
    console.log('📧 PASSWORD RESET EMAIL (Fallback Mode)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log('\n⚠️  Email sending failed - Link printed to console');
    console.log(`Error: ${error.message}`);
    console.log('========================================\n');
    
    return { success: true, consoleMode: true };
  }
};

module.exports = {
  sendPasswordResetEmail
};
