require('dotenv').config();
const nodemailer = require('nodemailer').default || require('nodemailer');

console.log('========================================');
console.log('📧 EMAIL SERVICE TEST');
console.log('========================================\n');

console.log('Configuration:');
console.log('Gmail User:', process.env.GMAIL_USER);
console.log('Gmail Password:', process.env.GMAIL_APP_PASSWORD ? '***configured***' : '❌ NOT SET');
console.log('\n');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

console.log('Step 1: Verifying SMTP connection...');
transporter.verify()
  .then(() => {
    console.log('✅ SMTP Connection successful!\n');
    
    console.log('Step 2: Sending test email...');
    return transporter.sendMail({
      from: `"Airbnb Clone" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Password Reset Request - FINAL TEST',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px;">
            <p>Hello,</p>
            <p>We received a request to reset your password.</p>
            <p style="text-align: center;">
              <a href="http://localhost:5173/reset-password/test123" style="display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </p>
            <p>Or copy this link: http://localhost:5173/reset-password/test123</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
          </div>
        </div>
      `
    });
  })
  .then((info) => {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n========================================');
    console.log('✅ SUCCESS - Email delivered to Gmail!');
    console.log('========================================');
    console.log('\nCheck your inbox at:', process.env.GMAIL_USER);
    console.log('Subject: Password Reset Request - FINAL TEST');
    console.log('\nIf you don\'t see it in Inbox, check Spam folder!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error details:');
    console.log(error);
    process.exit(1);
  });
