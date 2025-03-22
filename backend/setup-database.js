const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Get database configuration from environment variables
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'evaluacion_docente',
    multipleStatements: true // Important for executing multiple SQL statements
  };
  
  console.log(`Connecting to database ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}...`);
  
  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'setup-demo-users.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing SQL script...');
    
    // Execute SQL script
    await connection.query(sqlScript);
    
    console.log('SQL script executed successfully');
    
    // Close connection
    await connection.end();
    console.log('Database connection closed');
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();