import express from 'express';
import { login, register, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';
import { sendEmail } from '../config/email.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);  // ✅ Correct place for the route
router.post('/reset-password', resetPassword);

// routes/auth.js (add this right before export)
router.get('/test-email', protect, async (req, res) => {
  try {
    await sendEmail(
      req.user.email,
      '📧 Test Email from Your App',
      `Hello ${req.user.name},\n\nThis is a test email to verify your setup.`
    );
    res.json({ success: true, message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send test email' });
  }
});

export default router;