// server/routes/adminRoutes.js
import express from 'express';
import { 
  createPermissionRequest,
  getPendingRequests,
  approveRequest,
  rejectRequest
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/requests', protect, createPermissionRequest);
router.get('/requests', protect, admin, getPendingRequests);
router.put('/requests/:id/approve', protect, admin, approveRequest);
router.put('/requests/:id/reject', protect, admin, rejectRequest);

export default router;