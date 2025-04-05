// src/config/index.js
const dbConfig = require('./db_config');
const jwtConfig = require('./jwt_config');
const swaggerConfig = require('./swagger_config');

module.exports = {
  dbConfig,
  jwtConfig,
  swaggerConfig
};
