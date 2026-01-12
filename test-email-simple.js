require('dotenv').config();

// Import nodemailer properly
let nodemailer;
try {
  nodemailer = require('nodemailer');
  if (!nodemailer.createTransporter) {
    // Try default export
    nodemailer = nodemailer.default;
  }
} catch (e) {
  console.error('Failed to load nodemailer:', e.message);
  process.exit(1);
}

console.log('========================================');
console.log('📧 DIRECT EMAIL TEST');
console.log('========================================\n');

console.log('Gmail User:', process.env.GMAIL_USER);
console.log('Password Set:', process.env.GMAIL_APP_PASSWORD ? 'YES' : 'NO');
console.log('\n');

// Simple SMTP test using raw nodemailer
const testEmail = async () => {
  try {
    console.log('Creating transporter...');
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified!\n');

    console.log('Sending email...');
    const info = await transporter.sendMail({
      from: `"Airbnb Clone" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Password Reset - WORKING TEST',
      html: `
        <h1 style="color: #667eea;">🔐 Password Reset Request</h1>
        <p>This email confirms the password reset feature is WORKING!</p>
        <p><a href="http://localhost:5173/reset-password/abc123" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
        <p>Link: http://localhost:5173/reset-password/abc123</p>
      `
    });

    console.log('\n✅✅✅ EMAIL SENT SUCCESSFULLY! ✅✅✅');
    console.log('Message ID:', info.messageId);
    console.log('\n📬 CHECK YOUR GMAIL NOW!');
    console.log('Email:', process.env.GMAIL_USER);
    console.log('Subject: Password Reset - WORKING TEST');
    console.log('\n⚠️  Check SPAM folder if not in inbox!');
    
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nDetails:', error);
  }
};

testEmail();
