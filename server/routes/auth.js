import express from 'express';
import { login, register, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);  // ✅ Correct place for the route
router.post('/reset-password', resetPassword);

export default router;