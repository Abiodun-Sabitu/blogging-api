const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
createHttpError = require('http-errors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

const app = express();

// Connect to MongoDB
dbConnect = async () => { await connectDB(); };
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.get('/api/v1/', (req, res) => {
  try {
    res.status(200).json({ message: 'Welcome to the Blogging API' });
  } catch (error) {
    next(error);
  }
});
app.use((req, res, next) => {
  next(createHttpError(404, `this endpoint ${req.url} was not found`));
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogs', blogRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;