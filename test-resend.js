require('dotenv').config();
const { Resend } = require('resend');

console.log('🔍 Testing Resend API Key...\n');

// Check if API key exists
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in .env file!');
  process.exit(1);
}

console.log('✅ API Key found:', process.env.RESEND_API_KEY.substring(0, 10) + '...');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Test sending email
async function testEmail() {
  try {
    console.log('\n📧 Attempting to send test email...\n');
    
    const data = await resend.emails.send({
      from: 'HavenTo <onboarding@resend.dev>',
      to: 'saurabhrajput.25072005@gmail.com',
      subject: 'Resend API Test - HavenTo',
      html: `
        <h1>✅ Resend API is Working!</h1>
        <p>This is a test email from your HavenTo application.</p>
        <p>If you received this, Resend is configured correctly!</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    console.log('\n🎉 Resend API is working correctly!');
    console.log('📬 Check your email: saurabhrajput.25072005@gmail.com\n');
    
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('invalid') || error.message.includes('unauthorized')) {
      console.error('\n💡 Solution: Your API key is invalid or expired.');
      console.error('   1. Go to https://resend.com/api-keys');
      console.error('   2. Delete the old API key');
      console.error('   3. Create a new API key');
      console.error('   4. Update .env file with new key');
      console.error('   5. Update Render environment variable\n');
    }
  }
}

testEmail();
