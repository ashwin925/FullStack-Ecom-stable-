import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, no session');
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

export const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as seller');
  }
};