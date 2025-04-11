import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Debug: Verify all credentials
console.log('Loaded OAuth Credentials:', {
  clientId: process.env.GMAIL_OAUTH_CLIENT_ID ? '✅' : '❌',
  clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET ? '✅' : '❌',
  refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN ? '✅' : '❌',
  emailUser: process.env.EMAIL_USER ? '✅' : '❌'
});

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_OAUTH_CLIENT_ID,
  process.env.GMAIL_OAUTH_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

export const sendEmail = async (to, subject, text) => {
  try {
    // Set credentials and get new access token
    oAuth2Client.setCredentials({
      refresh_token: process.env.GMAIL_OAUTH_REFRESH_TOKEN
    });
    
    const { token: accessToken } = await oAuth2Client.getAccessToken();
    console.log('Access token generated successfully');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
        accessToken
      }
    });

    const info = await transporter.sendMail({
      from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<div>${text.replace(/\n/g, '<br>')}</div>`
    });

    console.log('Email delivered to:', info.accepted);
    return true;
  } catch (error) {
    console.error('EMAIL FAILURE DETAILS:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return false;
  }
};