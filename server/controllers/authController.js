import asyncHandler from 'express-async-handler';
import { usersCol } from '../config/firebaseDB.js';
import bcrypt from 'bcryptjs';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'buyer' } = req.body;

  // Check if user already exists
  const snapshot = await usersCol.where('email', '==', email).get();
  if (!snapshot.empty) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user document
  const userRef = await usersCol.add({
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString()
  });

  // Get the created user data
  const userDoc = await userRef.get();
  const user = { id: userDoc.id, ...userDoc.data() };

  // Set session
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for:', email); // Debug log

  // Find user by email
  const snapshot = await usersCol.where('email', '==', email).limit(1).get();
  
  if (snapshot.empty) {
    console.log('User not found'); // Debug log
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const userDoc = snapshot.docs[0];
  const user = { id: userDoc.id, ...userDoc.data() };

  console.log('Found user:', user.email); // Debug log

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch); // Debug log

  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  // Set session
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  console.log('Session set:', req.session.user); // Debug log

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

export const logout = asyncHandler(async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({ message: 'Logout failed' });
    } else {
      res.clearCookie('connect.sid');
      res.json({ message: 'Successfully logged out' });
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  if (!req.session.user) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  const userDoc = await usersCol.doc(req.session.user.id).get();
  if (!userDoc.exists) {
    res.status(404);
    throw new Error('User not found');
  }

  const user = userDoc.data();
  res.json({
    id: userDoc.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});