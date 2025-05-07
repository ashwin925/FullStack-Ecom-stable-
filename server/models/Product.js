// server/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  ratings: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  averageRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Calculate average rating before saving
productSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = parseFloat((sum / this.ratings.length).toFixed(2));
  } else {
    this.averageRating = 0;
  }
  next();
});

// Add method to update average rating
productSchema.methods.updateAverage = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    return;
  }
  const sum = this.ratings.reduce((total, r) => total + r.rating, 0);
  this.averageRating = parseFloat((sum / this.ratings.length).toFixed(2));
};

// Add index for better performance
productSchema.index({ seller: 1 });
productSchema.index({ 'ratings.userId': 1 });

export default mongoose.model('Product', productSchema);