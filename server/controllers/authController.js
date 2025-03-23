import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

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

  // Log the created user for debugging
  console.log('User created:', user);

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


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

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


export const logout = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Logout failed' });
    } else {
      res.clearCookie('connect.sid'); 
      res.json({ message: 'Successfully logged out' });
    }
  });
});


export const getMe = asyncHandler(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const userData = await User.findById(user._id).select('-password');
  res.json(userData);
});