// src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('\n❌ Error en la aplicación:');
  console.error(`📝 Detalles: ${err.message}`);
  console.error(`🔍 Stack: ${err.stack}`);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler; 