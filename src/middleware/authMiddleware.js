const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { secret } = require('../config/jwt');
const User = require('../model/user');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next(createError(401, 'You need to be logged in to access this feature. Please provide a valid token.'));
  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return next(createError(401, 'Sorry, we could not find your user account. Please log in again.'));
    next();
  } catch (err) {
    return next(createError(401, 'Your session has expired or your token is invalid. Please log in again to continue.'));
  }
};

module.exports = authMiddleware;