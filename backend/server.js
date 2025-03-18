const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Load environment variables
dotenv.config();

// Check if we're in development mode and should skip DB check
const SKIP_DB_CHECK = process.env.SKIP_DB_CHECK === 'true';

// Import database connection
const { pool, testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const evaluationRoutes = require('./routes/evaluations');
const reportRoutes = require('./routes/reports');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Teacher Evaluation System API',
      version: '1.0.0',
      description: 'API for managing teacher evaluations',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api', authRoutes);
app.use('/api', evaluationRoutes);
app.use('/api', reportRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection if not skipped
    if (!SKIP_DB_CHECK) {
      const dbConnected = await testConnection();
      
      if (!dbConnected) {
        console.error('Failed to connect to database. Server will not start.');
        process.exit(1);
      }
    } else {
      console.warn('WARNING: Skipping database connection check. Some features may not work.');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});