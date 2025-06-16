const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../model/user');
const { secret, expiresIn } = require('../config/jwt');

const signup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return next(createError(400, 'All fields are required'));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, 'Email already exists'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ first_name, last_name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(createError(400, 'Email and password are required'));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(401, 'Invalid credentials'));
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  signin
};