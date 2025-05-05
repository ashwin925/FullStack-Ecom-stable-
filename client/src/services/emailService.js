import emailjs from '@emailjs/browser';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendUserEmail = async (userEmail, userName, actionType) => {
  try {
    const templateParams = {
      user_email: userEmail, // Only goes to the user
      name: userName,
      action: actionType,
      reply_to: 'ashwinsundar90250@gmail.com' // Only affects replies
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};