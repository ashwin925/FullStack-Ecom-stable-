import asyncHandler from 'express-async-handler';
import { usersCol } from '../config/firebaseDB.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
  
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'buyer', phone = '', dob = '', gender = 'prefer-not-to-say', profilePictureUrl = '' } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const snapshot = await usersCol.where('email', '==', email).get();
  if (!snapshot.empty) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userRef = await usersCol.add({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    dob,
    gender,
    profilePictureUrl,
    createdAt: new Date().toISOString(),
    hasChangedName: false
  });

  const userDoc = await userRef.get();
  const user = { id: userDoc.id, ...userDoc.data() };

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

export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const userRef = usersCol.doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check if user already changed name and is trying to change again
    if (userData.hasChangedName && name !== userData.name) {
      res.status(400);
      throw new Error('Username can only be changed once');
    }

    const updateData = { name };
    if (name !== userData.name) {
      updateData.hasChangedName = true;
    }

    await userRef.update(updateData);
    
    // Update session
    req.session.user = { ...req.session.user, ...updateData };
    
    res.json({ 
      id: userId,
      name,
      email: req.user.email,
      role: req.user.role,
      hasChangedName: updateData.hasChangedName || userData.hasChangedName
    });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: error.message || 'Profile update failed' });
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const snapshot = await usersCol.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    // Don't reveal if email doesn't exist (security best practice)
    return res.json({ message: 'If an account exists with this email, we\'ve sent a password reset link' });
  }

  const userDoc = snapshot.docs[0];
  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000; // 1 hour

  await usersCol.doc(userDoc.id).update({
    resetToken: token,
    resetTokenExpires: expires
  });

  // In production, send email with this link:
  const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;
  console.log('Reset link:', resetLink); // Remove in production
  
  res.json({ message: 'If an account exists with this email, we\'ve sent a password reset link' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const snapshot = await usersCol
    .where('resetToken', '==', token)
    .where('resetTokenExpires', '>', Date.now())
    .limit(1)
    .get();

  if (snapshot.empty) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await usersCol.doc(snapshot.docs[0].id).update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null
  });

  res.json({ message: 'Password updated successfully' });
});