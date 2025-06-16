const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { secret } = require('../config/jwt');
const User = require('../model/user');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next(createError(401, 'No token provided'));
  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return next(createError(401, 'User not found'));
    next();
  } catch (err) {
    return next(createError(401, 'Invalid or expired token'));
  }
};

module.exports = authMiddleware;