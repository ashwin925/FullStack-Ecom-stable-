import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', 
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }).status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  try{
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });}
  catch (error) {
    console.error('Login error:', error.message); // Use error
    res.status(401).json({ 
      message: error.message || 'Invalid credentials' 
    });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).json({ message: 'Successfully logged out' });
});