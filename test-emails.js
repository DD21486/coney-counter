// Test script to verify email functionality
import { sendNewSignupNotification, sendApprovalEmail } from './src/lib/email';

async function testEmails() {
  try {
    console.log('Testing signup notification...');
    await sendNewSignupNotification('test@example.com', 'Test User');
    console.log('✅ Signup notification sent');
    
    console.log('Testing approval email...');
    await sendApprovalEmail('test@example.com', 'Test User');
    console.log('✅ Approval email sent');
    
    console.log('All email tests passed!');
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmails();
