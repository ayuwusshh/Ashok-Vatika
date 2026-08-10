require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { errorHandler } = require('./middleware/errorMiddleware');
const apiLimiter = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();

// Connect to Database and Redis
connectDB();
connectRedis();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use(apiLimiter);

// Default Route
app.get('/', (req, res) => {
  res.send('Ashok Vatika 2.0 API is running...');
});

// Import Routes
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/tours', require('./routes/tourRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/analyze', require('./routes/analyzerRoutes'));

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
