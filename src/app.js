const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const createHttpError = require('http-errors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Connect to MongoDB
dbConnect = async () => { await connectDB(); };
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Routes
app.get('/api/v1/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Blogging API' });
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogs', blogRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  next(createHttpError(404, `Looks like '${req.url}' isn’t a valid route. Please check the URL and try again.`) );
});
// Error handler
app.use(errorHandler);

module.exports = app;