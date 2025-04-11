import dotenv from 'dotenv';
import { sendEmail } from './config/email.js';

dotenv.config();

try {
  await sendEmail(
    'yourpersonal@gmail.com', // Replace with your email
    'Test Email',
    'This is a test from your app!'
  );
  console.log('✅ Email sent! Check inbox/spam.');
} catch (err) {
  console.error('❌ Failed:', err.message);
}