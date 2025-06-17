const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../model/user");
const { secret, expiresIn } = require("../config/jwt");

const signup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return next(createError(400, "All fields are required"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, "Email already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Account created successfully! Welcome to the Blogging App.",
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Email and password are required"));
    }

    //test if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError(400, "Please enter a valid email address"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        createError(
          404,
          "No account found with this email. Please sign up or check your email address."
        )
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(404, "Incorrect password. Please try again."));
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Welcome back! You have signed in successfully.",
      data: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  signin,
};
