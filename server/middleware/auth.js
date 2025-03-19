  import asyncHandler from 'express-async-handler';

  const protect = asyncHandler(async (req, res, next) => {
    if (req.session.user) {
      req.user = req.session.user;
      next();
    } else {
      res.status(401).json({ message: 'Not authorized, no session' });
    }
  });

  const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(401);
      throw new Error('Not authorized as an admin');
    }
  };

  const seller = (req, res, next) => {
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(401);
      throw new Error('Not authorized as a seller');
    }
  };

  export { protect, admin, seller };