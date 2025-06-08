// src/config/db_config.js
require('dotenv').config();

module.exports = {
  // Configuración para la base de datos local
  dbConfig: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  
  // Configuración para la base de datos remota sigedin_ies
  dbRemoteConfig: {
    host: process.env.DB_REMOTE_HOST,
    port: process.env.DB_REMOTE_PORT,
    user: process.env.DB_REMOTE_USER,
    password: process.env.DB_REMOTE_PASSWORD,
    database: process.env.DB_REMOTE_NAME
  },
  
  // Configuración para la base de datos remota sigedin_seguridad
  dbSecurityConfig: {
    host: process.env.DB_REMOTE_HOST,
    port: process.env.DB_REMOTE_PORT,
    user: process.env.DB_REMOTE_USER,
    password: process.env.DB_REMOTE_PASSWORD,
    database: process.env.DB_SECURITY_NAME
  }
};

