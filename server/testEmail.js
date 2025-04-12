import dotenv from 'dotenv';
dotenv.config();
import { sendEmail } from './config/email.js';

// Test configuration
const testEmail = {
  to: 'test9025009577@gmail.com', // Your test recipient
  subject: 'SMTP Connection Test',
  text: 'If you see this, your email setup works!'
};

console.log('Starting email test...');
sendEmail(testEmail.to, testEmail.subject, testEmail.text)
  .then(success => {
    if (success) {
      console.log('✅ Email sent successfully!');
      console.log('Check your inbox (and spam folder)');
    } else {
      console.log('❌ Email failed silently');
    }
  })
  .catch(err => {
    console.error('❌ Critical failure:', err);
  });