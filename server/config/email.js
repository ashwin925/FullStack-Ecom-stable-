// server/config/email.js
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Debug: Verify env vars are loaded
console.log('Environment:', {
  clientId: process.env.GMAIL_OAUTH_CLIENT_ID?.slice(0, 10) + '...',
  refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN?.slice(0, 10) + '...',
  emailUser: process.env.EMAIL_USER
});

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_OAUTH_CLIENT_ID,
  process.env.GMAIL_OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_OAUTH_REFRESH_TOKEN
});

export const sendEmail = async (to, subject, text) => {
  try {
    const { token } = await oauth2Client.getAccessToken();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // false for STARTTLS
      requireTLS: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
        accessToken: token
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    
    return true;
  } catch (err) {
    console.error('FULL ERROR:', err);
    return false;
  }
};