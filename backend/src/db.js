// src/db.js
const mysql = require('mysql2/promise');
const { dbConfig, dbRemoteConfig, dbSecurityConfig } = require('./config/db_config');

let pool;
let remotePool;
let securityPool;

// Configuración común para los pools
const poolConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 segundos
  acquireTimeout: 10000, // 10 segundos
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

async function initializeDatabase() {
  try {
    // Inicializar conexión a base de datos local
    pool = mysql.createPool({
      ...dbConfig,
      ...poolConfig
    });
    
    // Inicializar conexión a sigedin_ies remoto
    remotePool = mysql.createPool({
      ...dbRemoteConfig,
      ...poolConfig
    });
    
    // Inicializar conexión a sigedin_seguridad
    securityPool = mysql.createPool({
      ...dbSecurityConfig,
      ...poolConfig
    });
    
    console.log('\n🔄 Inicializando conexiones a las bases de datos...');
    
    // Probar conexión a base de datos local
    try {
      const connection = await pool.getConnection();
      console.log('✅ Conexión a base de datos local establecida exitosamente');
      console.log(`📊 Base de datos: ${dbConfig.database}`);
      console.log(`🔌 Host: ${dbConfig.host}:${dbConfig.port}`);
      connection.release();
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos local:', error.message);
    }
    
    // Probar conexión a sigedin_ies remoto
    try {
      const remoteConnection = await remotePool.getConnection();
      console.log('\n✅ Conexión a sigedin_ies remoto establecida exitosamente');
      console.log(`📊 Base de datos: ${dbRemoteConfig.database}`);
      console.log(`🔌 Host: ${dbRemoteConfig.host}:${dbRemoteConfig.port}`);
      remoteConnection.release();
    } catch (error) {
      console.error('❌ Error al conectar con sigedin_ies remoto:', error.message);
    }
    
    // Probar conexión a sigedin_seguridad
    try {
      const securityConnection = await securityPool.getConnection();
      console.log('\n✅ Conexión a sigedin_seguridad establecida exitosamente');
      console.log(`📊 Base de datos: ${dbSecurityConfig.database}`);
      console.log(`🔌 Host: ${dbSecurityConfig.host}:${dbSecurityConfig.port}`);
      securityConnection.release();
    } catch (error) {
      console.error('❌ Error al conectar con sigedin_seguridad:', error.message);
    }
    
    return { pool, remotePool, securityPool };
  } catch (error) {
    console.error('\n❌ Error al inicializar las conexiones a las bases de datos:');
    console.error(`📝 Detalles: ${error.message}`);
    throw error;
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Local database not initialized. Call initializeDatabase first.');
  }
  return pool;
}

function getRemotePool() {
  if (!remotePool) {
    throw new Error('Remote database not initialized. Call initializeDatabase first.');
  }
  return remotePool;
}

function getSecurityPool() {
  if (!securityPool) {
    throw new Error('Security database not initialized. Call initializeDatabase first.');
  }
  return securityPool;
}

module.exports = {
  initializeDatabase,
  getPool,
  getRemotePool,
  getSecurityPool
};
