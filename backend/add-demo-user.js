/**
 * Script to add the demo student user
 * This script ensures the required tables exist and adds the demo user
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

async function addDemoUser() {
  console.log('Starting demo user addition process...');
  
  // Get database configuration from environment variables
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'evaluacion_docente',
    multipleStatements: true
  };
  
  console.log(`Connecting to database ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}...`);
  
  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');

    // Check if usuarios table exists
    console.log('Checking if usuarios table exists...');
    const [tableCheck] = await connection.query(`
      SELECT COUNT(*) as tableExists 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'usuarios'
    `, [dbConfig.database]);
    
    if (tableCheck[0].tableExists === 0) {
      console.log('usuarios table does not exist. Creating required tables...');
      // Read SQL file for table creation
      const sqlFilePath = path.join(__dirname, 'setup-demo-users.sql');
      const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
      
      // Execute SQL script to create tables and insert demo users
      console.log('Executing SQL script to create tables...');
      await connection.query(sqlScript);
      console.log('Tables created and basic users inserted');
    } else {
      console.log('usuarios table already exists.');
      
      // Check if the demo student user already exists
      const [userCheck] = await connection.query(`
        SELECT COUNT(*) as userExists 
        FROM usuarios 
        WHERE username = ? OR email = ?
      `, ['estudiante@estudiante.edu', 'estudiante@estudiante.edu']);
      
      if (userCheck[0].userExists === 0) {
        console.log('Demo student user does not exist. Creating demo student user...');
        
        // Create bcrypt hash for password
        const saltRounds = 10;
        const plainPassword = '123456';
        const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
        
        // Insert new user
        await connection.query(`
          INSERT INTO usuarios (username, password, nombre_completo, email, rol, activo)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['estudiante@estudiante.edu', passwordHash, 'Estudiante Matriculado', 'estudiante@estudiante.edu', 'estudiante', true]);
        
        console.log('Demo student user created successfully');
        
        // Check if estudiantes table exists
        const [studentTableCheck] = await connection.query(`
          SELECT COUNT(*) as tableExists 
          FROM information_schema.tables 
          WHERE table_schema = ? AND table_name = 'estudiantes'
        `, [dbConfig.database]);
        
        if (studentTableCheck[0].tableExists > 0) {
          // Get the user ID
          const [userId] = await connection.query(`
            SELECT id FROM usuarios WHERE username = ?
          `, ['estudiante@estudiante.edu']);
          
          if (userId.length > 0) {
            // Check if programas table exists and has at least one program
            const [programExists] = await connection.query(`
              SELECT COUNT(*) as exists_count, 
                     (SELECT id FROM programas LIMIT 1) as program_id 
              FROM information_schema.tables 
              WHERE table_schema = ? AND table_name = 'programas'
            `, [dbConfig.database]);
            
            let programId = 1; // Default
            if (programExists[0].exists_count > 0 && programExists[0].program_id) {
              programId = programExists[0].program_id;
            }
            
            // Insert student information
            await connection.query(`
              INSERT INTO estudiantes (id_usuario, matricula, matriculado, semestre, id_programa)
              VALUES (?, ?, ?, ?, ?)
            `, [userId[0].id, 'EST2023-789', true, 4, programId]);
            
            console.log('Student information added');
          }
        }
      } else {
        console.log('Demo student user already exists.');
      }
    }
    
    // Close connection
    await connection.end();
    console.log('Database connection closed');
    
    console.log('Demo user setup completed successfully');
  } catch (error) {
    console.error('Error setting up demo user:', error);
    process.exit(1);
  }
}

// Run the setup
addDemoUser();