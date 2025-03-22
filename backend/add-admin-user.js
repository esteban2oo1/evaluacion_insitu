/**
 * Script to add admin user to the real database
 * 
 * This script adds the following user:
 * Email: admin@institucion.edu
 * Password: 123456
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function addAdminUser() {
  console.log('Adding admin user to the real database...');
  
  // Get database configuration from environment variables
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'evaluacion_docente'
  };
  
  console.log(`Connecting to database ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}...`);
  
  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');

    // First check if the usuarios table exists
    try {
      console.log('Checking if usuarios table exists...');
      await connection.query('SELECT 1 FROM usuarios LIMIT 1');
      console.log('usuarios table exists');
    } catch (error) {
      console.log('usuarios table does not exist, creating it...');
      // Create the usuarios table with the minimal required fields
      await connection.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          nombre_completo VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          rol ENUM('admin', 'estudiante', 'profesor', 'evaluador') NOT NULL,
          activo BOOLEAN DEFAULT TRUE,
          fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          ultimo_acceso DATETIME
        )
      `);
      console.log('usuarios table created');
    }

    // Check if the admin user already exists
    const [users] = await connection.query(
      'SELECT * FROM usuarios WHERE username = ? OR email = ?',
      ['admin@institucion.edu', 'admin@institucion.edu']
    );
    
    if (users.length > 0) {
      console.log('Admin user already exists, updating password...');
      
      // Generate bcrypt hash for the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash('123456', saltRounds);
      
      // Update user password
      await connection.query(
        'UPDATE usuarios SET password = ? WHERE username = ? OR email = ?',
        [passwordHash, 'admin@institucion.edu', 'admin@institucion.edu']
      );
      
      console.log('Admin user password updated successfully');
    } else {
      console.log('Admin user does not exist, creating...');
      
      // Generate bcrypt hash for the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash('123456', saltRounds);
      
      // Insert new user
      await connection.query(
        'INSERT INTO usuarios (username, password, nombre_completo, email, rol, activo) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin@institucion.edu', passwordHash, 'Administrador del Sistema', 'admin@institucion.edu', 'admin', true]
      );
      
      console.log('Admin user created successfully');
    }
    
    // Close connection
    await connection.end();
    console.log('Database connection closed');
    console.log('');
    console.log('=============================');
    console.log('Admin user details:');
    console.log('Email/Username: admin@institucion.edu');
    console.log('Password: 123456');
    console.log('Role: admin');
    console.log('=============================');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
addAdminUser();