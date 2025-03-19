import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';


// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create the user
  const user = await User.create({ name, email, password, role });

  // Store user data in session
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Store user data in session
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Logout failed' });
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Successfully logged out' });
    }
  });
});

// @desc    Get user profile
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const userData = await User.findById(user._id).select('-password');
  res.json(userData);
});