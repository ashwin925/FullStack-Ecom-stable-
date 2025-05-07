// server/routes/products.js
import express from 'express';
import { 
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, seller } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, seller, createProduct);

router.route('/:id')
  .delete(protect, seller, deleteProduct)
  .put(protect, seller, updateProduct);

  router.post('/:id/rate', protect, async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send('Product not found');
  
      // Check if user has purchased this product
      const hasPurchased = await Order.exists({
        'userId': req.user.id,
        'products.productId': req.params.id
      });
      
      if (!hasPurchased) {
        return res.status(403).send('You must purchase the product first');
      }
  
      // Update or add rating
      const existingIndex = product.ratings.findIndex(
        r => r.userId.toString() === req.user.id
      );
      
      if (existingIndex >= 0) {
        product.ratings[existingIndex].rating = req.body.rating;
      } else {
        product.ratings.push({
          userId: req.user.id,
          rating: req.body.rating
        });
      }
  
      // Calculate new average
      const sum = product.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      product.averageRating = (sum / product.ratings.length).toFixed(1);
  
      await product.save();
      res.send(product);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }); 

export default router;