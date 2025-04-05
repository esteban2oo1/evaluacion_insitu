// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger_config');
const { initializeDatabase } = require('./db');
const routes = require('./api/v1/routes');
const errorHandler = require('./api/v1/middlewares/errorHandler');

// Initialize express app
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: '*', // Permite todas las origenes (en producción, especifica los dominios permitidos)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Initialize database connection
initializeDatabase()
  .then(() => {
    console.log('✅ Base de datos inicializada correctamente');
    
    // Mostrar configuración de CORS después de la inicialización de la base de datos
    console.log('\n🔒 CORS activado con las siguientes configuraciones:');
    console.log('════════════════════════════════════════════════════════════════════════════');
    console.log('   • Origen: Todos permitidos (*)');
    console.log('   • Métodos: GET, POST, PUT, DELETE, PATCH, OPTIONS');
    console.log('   • Headers: Content-Type, Authorization');
    console.log('   • Credenciales: Habilitadas');
    console.log('   • Tiempo de caché: 24 horas');
    console.log('════════════════════════════════════════════════════════════════════════════\n');
  })
  .catch((error) => {
    console.error('\n❌ Error al iniciar el servidor:');
    console.error(`📝 Detalles: ${error.message}`);
    process.exit(1);
  });

// API routes
app.use('/api/v1', routes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado'
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
