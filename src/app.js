const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

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
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;