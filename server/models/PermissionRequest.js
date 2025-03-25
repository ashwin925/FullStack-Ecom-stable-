// server/models/PermissionRequest.js
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  oldEmail: { 
    type: String, 
    required: true 
  },
  newEmail: { 
    type: String, 
    required: true 
  },
  newPassword: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model('PermissionRequest', requestSchema);