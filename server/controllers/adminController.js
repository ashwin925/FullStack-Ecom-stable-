// server/controllers/adminController.js
import asyncHandler from 'express-async-handler';
import PermissionRequest from '../models/PermissionRequest.js';
import User from '../models/User.js';

// @desc    Create a permission request
// @route   POST /api/admin/requests
// @access  Private
export const createPermissionRequest = asyncHandler(async (req, res) => {
  const { userId, userName, oldEmail, newEmail, oldPassword, newPassword, description } = req.body;

  // Validate current credentials (optional but recommended)
  const user = await User.findById(userId);
  if (!user || user.email !== oldEmail || !(await user.matchPassword(oldPassword))) {
    res.status(400);
    throw new Error('Invalid current email or password');
  }

  // Save the request
  const request = await PermissionRequest.create({
    userId,
    userName,
    oldEmail,
    newEmail,
    newPassword, // Note: Store hashed password in production!
    description,
    status: 'pending'
  });

  res.status(201).json(request);
});

// @desc    Get all pending requests
// @route   GET /api/admin/requests
// @access  Private (Admin)
export const getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await PermissionRequest.find({ status: 'pending' });
  res.json(requests);
});

// @desc    Approve a request
// @route   PUT /api/admin/requests/:id/approve
// @access  Private (Admin)
export const approveRequest = asyncHandler(async (req, res) => {
  const request = await PermissionRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Update user's email/password
  const user = await User.findById(request.userId);
  user.email = request.newEmail;
  user.password = request.newPassword; // Auto-hashed via User model's pre-save hook
  await user.save();

  // Mark request as approved
  request.status = 'approved';
  await request.save();

  res.json({ message: 'Request approved and user updated' });
});

// @desc    Reject a request
// @route   PUT /api/admin/requests/:id/reject
// @access  Private (Admin)
export const rejectRequest = asyncHandler(async (req, res) => {
  const request = await PermissionRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  request.status = 'rejected';
  await request.save();

  res.json({ message: 'Request rejected' });
});