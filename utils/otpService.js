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
    replyTo: process.env.SENDGRID_FROM_EMAIL || 'noreply@havento.com',
    subject: 'Complete your HavenTo registration',
    text: `Hi ${firstName || 'there'},

Thank you for signing up with HavenTo!

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't create an account with HavenTo, you can safely ignore this email.

Best regards,
The HavenTo Team

© 2024 HavenTo. All rights reserved.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Verify Your Email</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          @media only screen and (max-width: 600px) {
            .container { padding: 10px; }
            .header, .content { padding: 20px; }
            .otp-code { font-size: 28px; letter-spacing: 4px; }
          }
        </style>
      </head>
      <body>
        <div style="display: none; max-height: 0px; overflow: hidden;">
          Your verification code is ${otp}. Complete your HavenTo registration now.
        </div>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Welcome to HavenTo!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName || 'there'},</p>
            <p>Thank you for signing up with HavenTo! Please use the verification code below to complete your registration:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't create an account with HavenTo, you can safely ignore this email.</p>
            
            <div class="footer">
              <p>© 2024 HavenTo. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    categories: ['email-verification'],
    customArgs: {
      type: 'otp-verification'
    }
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
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@havento.com',
      name: 'HavenTo'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL || 'noreply@havento.com',
    subject: 'HavenTo - Password Reset Request',
    text: `Hi ${firstName || 'there'},

We received a request to reset your password for your HavenTo account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

Best regards,
The HavenTo Team

© 2024 HavenTo. All rights reserved.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Reset Your Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; }
          .button:hover { background: #5568d3; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .link-box { background: white; padding: 15px; border-radius: 5px; word-break: break-all; margin: 15px 0; }
          @media only screen and (max-width: 600px) {
            .container { padding: 10px; }
            .header, .content { padding: 20px; }
            .button { padding: 12px 24px; font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div style="display: none; max-height: 0px; overflow: hidden;">
          Reset your HavenTo password. Click the link to create a new password.
        </div>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName || 'there'},</p>
            <p>We received a request to reset your password for your HavenTo account.</p>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>🔒 Security Notice:</strong> This is a legitimate password reset email from HavenTo.</p>
            </div>
            
            <p>Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button" style="background: #667eea; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; display: inline-block; font-weight: 600;">Reset My Password</a>
            </div>
            
            <p style="margin-top: 25px;">Or copy this secure link:</p>
            <div class="link-box">
              <a href="${resetLink}" style="color: #667eea; text-decoration: none; word-break: break-all;">${resetLink}</a>
            </div>
            
            <p><strong>⏰ This link expires in 1 hour</strong> for your security.</p>
            <p>If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.</p>
            
            <div class="footer">
              <p>© 2024 HavenTo. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    categories: ['password-reset'],
    customArgs: {
      type: 'password-reset'
    }
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
