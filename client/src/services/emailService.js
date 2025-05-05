import emailjs from '@emailjs/browser';

// Initialize with your public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendUserEmail = async (userEmail, userName, actionType) => {
  try {
    const templateParams = {
      user_email: userEmail, // Will go to the logged-in user
      name: userName,
      action: actionType,
      reply_to: 'ashwinsundar90250@gmail.com' // Replies come here
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
  } catch (error) {
    console.error('Email sending failed:', error);
    // Silent fail - don't interrupt user experience
  }
};