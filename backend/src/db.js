// src/db.js
const mysql = require('mysql2/promise');
const { dbConfig } = require('./config');

let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('\n🔄 Inicializando conexión a la base de datos...');
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida exitosamente');
    console.log(`📊 Base de datos: ${dbConfig.database}`);
    console.log(`🔌 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('\n❌ Error al conectar con la base de datos:');
    console.error(`📝 Detalles: ${error.message}`);
    throw error;
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return pool;
}

module.exports = {
  initializeDatabase,
  getPool
};
