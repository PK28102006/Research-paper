const express = require('express');
const cors = require('cors');
const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paperRoutes = require('./routes/paperRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Research Paper Portal API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/papers', paperRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log('=================================');
  console.log(`🚀 Server running in ${config.nodeEnv} mode`);
  console.log(`📡 Port: ${config.port}`);
  console.log(`🌐 Frontend: ${config.frontendUrl}`);
  console.log('=================================');
});

module.exports = app;
