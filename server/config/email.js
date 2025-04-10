import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<div style="font-family: Arial; padding: 20px;">${text.replace(/\n/g, '<br>')}</div>`
    });
  } catch (error) {
    console.error('Email error (non-critical):', error.message);
    // Silently fail - don't throw to avoid breaking main functionality
  }
};