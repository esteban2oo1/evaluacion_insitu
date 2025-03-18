/**
 * Simple logger utility for consistent logging across the application
 */

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Current log level (can be set via environment variable)
const currentLogLevel = process.env.LOG_LEVEL || LOG_LEVELS.INFO;

// Check if a log level should be displayed based on current log level
const shouldLog = (level) => {
  const levels = Object.values(LOG_LEVELS);
  const currentIndex = levels.indexOf(currentLogLevel);
  const levelIndex = levels.indexOf(level);
  
  return levelIndex <= currentIndex;
};

// Format log message
const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

// Logger methods
const logger = {
  error: (message, meta = {}) => {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      console.error(formatMessage(LOG_LEVELS.ERROR, message, meta));
    }
  },
  
  warn: (message, meta = {}) => {
    if (shouldLog(LOG_LEVELS.WARN)) {
      console.warn(formatMessage(LOG_LEVELS.WARN, message, meta));
    }
  },
  
  info: (message, meta = {}) => {
    if (shouldLog(LOG_LEVELS.INFO)) {
      console.info(formatMessage(LOG_LEVELS.INFO, message, meta));
    }
  },
  
  debug: (message, meta = {}) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.debug(formatMessage(LOG_LEVELS.DEBUG, message, meta));
    }
  },
  
  // Log database queries (useful for debugging)
  logQuery: (query, params = []) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.debug(formatMessage(LOG_LEVELS.DEBUG, `SQL Query: ${query}`, { params }));
    }
  }
};

module.exports = {
  logger,
  LOG_LEVELS
};