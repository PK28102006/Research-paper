const express = require('express');
const cors = require('cors');
const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paperRoutes = require('./routes/paperRoutes');
const initDb = require('./config/initDb');

const app = express();

// Initialize Database
initDb();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      config.frontendUrl,
      'http://localhost:5173',
      'http://localhost:5174',
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    // Also allow any .vercel.app domain for deployment flexibility
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
