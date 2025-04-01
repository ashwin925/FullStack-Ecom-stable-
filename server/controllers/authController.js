import asyncHandler from 'express-async-handler';
import { usersCol } from '../config/firebaseDB.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

  console.log('Login attempt for:', email);

  const snapshot = await usersCol.where('email', '==', email).limit(1).get();
  
  if (snapshot.empty) {
    console.log('User not found');
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const userDoc = snapshot.docs[0];
  const user = { id: userDoc.id, ...userDoc.data() };

  console.log('Found user:', user.email);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);

  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  console.log('Session set:', req.session.user);

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
  const { name, phone, dob, gender } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400);
    throw new Error('Name must be at least 2 characters');
  }

  try {
    const userRef = usersCol.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404);
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const updateData = { 
      name: name.trim(),
      phone: phone || null,
      dob: dob || null,
      gender: gender || 'prefer-not-to-say'
    };

    // Name change restriction check
    if (userData.hasChangedName && name !== userData.name) {
      res.status(400);
      throw new Error('Username can only be changed once');
    }

    // Track name changes
    if (name !== userData.name) {
      updateData.hasChangedName = true;
      updateData.nameLastChanged = new Date().toISOString();
    }

    // Atomic update
    await userRef.update(updateData);

    // Update session
    const updatedUser = {
      ...req.session.user,
      ...updateData
    };
    req.session.user = updatedUser;

    res.json({
      id: userId,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      hasChangedName: updateData.hasChangedName
    });

  } catch (error) {
    console.error('Profile update error:', {
      error: error.message,
      userId,
      attemptedUpdate: req.body
    });
    
    if (!res.headersSent) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Profile update failed',
        code: error.code || 'PROFILE_UPDATE_ERROR'
      });
    }
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const snapshot = await usersCol.where('email', '==', email).limit(1).get();
    
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const token = crypto.randomBytes(32).toString('hex');
      const expires = Date.now() + 3600000;

      // 1️⃣ First: Debug BEFORE Firestore update
      console.log('🔥 [1/5] Preparing to store token for:', email);
      console.log('🔗 [2/5] Generated reset token:', token);

      // 2️⃣ Save to Firestore
      await usersCol.doc(userDoc.id).update({
        resetToken: token,
        resetTokenExpires: expires
      });

      // 3️⃣ Verify Firestore update
      const updatedDoc = await usersCol.doc(userDoc.id).get();
      console.log('📂 [3/5] Firestore document ID:', updatedDoc.id);
      console.log('🔑 [4/5] Token matches?:', updatedDoc.data().resetToken === token);

      // 4️⃣ Prepare email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      console.log('📧 [5/5] Sending email with link:', resetLink);

      await transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
      });
      
      console.log('✅ Email successfully queued for delivery');
    }

    res.json({ message: 'If an account exists, we\'ve sent a reset link' });
  } catch (error) {
    console.error('🔴 Full error stack:', error.stack); // More detailed error
    res.json({ message: 'If an account exists, we\'ve sent a reset link' });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

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

  const userDoc = snapshot.docs[0];
  await usersCol.doc(userDoc.id).update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null
  });

  res.json({ message: 'Password updated successfully' });
});