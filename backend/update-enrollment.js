/**
 * Script to update enrollment status for both student and admin users
 * 
 * This script ensures both users have:
 * - matriculado = TRUE (enrolled status)
 * - matricula (enrollment number)
 */
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function updateEnrollment() {
  console.log('Starting enrollment update process...');
  
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

    // 1. Ensure student user has correct enrollment info
    console.log('Checking student user enrollment...');
    const [studentUser] = await connection.query(
      'SELECT id FROM usuarios WHERE username = ? OR email = ?',
      ['estudiante@estudiante.edu', 'estudiante@estudiante.edu']
    );

    if (studentUser.length > 0) {
      const studentId = studentUser[0].id;
      console.log(`Student user found with ID: ${studentId}`);

      // Check if student has enrollment info
      const [studentEnrollment] = await connection.query(
        'SELECT id, matriculado FROM estudiantes WHERE id_usuario = ?',
        [studentId]
      );

      if (studentEnrollment.length > 0) {
        console.log('Student enrollment info found, updating to ensure it is marked as enrolled');
        // Update to ensure matriculado is TRUE
        await connection.query(
          'UPDATE estudiantes SET matriculado = TRUE, semestre = 4, id_programa = 1 WHERE id_usuario = ?',
          [studentId]
        );
        console.log('Student enrollment updated - Now marked as enrolled');
      } else {
        console.log('No student enrollment info found, creating new record');
        // Insert new enrollment info
        await connection.query(
          'INSERT INTO estudiantes (id_usuario, matricula, matriculado, semestre, id_programa) VALUES (?, ?, TRUE, ?, ?)',
          [studentId, 'EST2023-789', 4, 1]
        );
        console.log('Student enrollment info created');
      }
    } else {
      console.log('Student user not found');
    }

    // 2. Add enrollment info for admin user
    console.log('Checking admin user enrollment...');
    const [adminUser] = await connection.query(
      'SELECT id FROM usuarios WHERE username = ? OR email = ?',
      ['admin@institucion.edu', 'admin@institucion.edu']
    );

    if (adminUser.length > 0) {
      const adminId = adminUser[0].id;
      console.log(`Admin user found with ID: ${adminId}`);

      // Check if admin has enrollment info
      const [adminEnrollment] = await connection.query(
        'SELECT id FROM estudiantes WHERE id_usuario = ?',
        [adminId]
      );

      if (adminEnrollment.length > 0) {
        console.log('Admin enrollment info found, updating to ensure it is marked as enrolled');
        // Update to ensure matriculado is TRUE
        await connection.query(
          'UPDATE estudiantes SET matriculado = TRUE, matricula = ?, semestre = 6, id_programa = 1 WHERE id_usuario = ?',
          ['ADMIN2023-123', adminId]
        );
        console.log('Admin enrollment updated - Now marked as enrolled');
      } else {
        console.log('No admin enrollment info found, creating new record');
        // Insert new enrollment info
        await connection.query(
          'INSERT INTO estudiantes (id_usuario, matricula, matriculado, semestre, id_programa) VALUES (?, ?, TRUE, ?, ?)',
          [adminId, 'ADMIN2023-123', 6, 1]
        );
        console.log('Admin enrollment info created');
      }

      // Ensure admin has access to asignaturas (subjects) by linking to assignments
      // First, check if admin user already has associated asignaturas
      const [adminStudentId] = await connection.query(
        'SELECT id FROM estudiantes WHERE id_usuario = ?',
        [adminId]
      );

      if (adminStudentId.length > 0) {
        const studentId = adminStudentId[0].id;
        
        // Link admin to subjects (all available subjects)
        const [subjects] = await connection.query('SELECT id FROM asignaturas');
        
        for (const subject of subjects) {
          // Check if the link already exists
          const [existingLink] = await connection.query(
            'SELECT 1 FROM estudiante_asignatura WHERE id_estudiante = ? AND id_asignatura = ?',
            [studentId, subject.id]
          );
          
          if (existingLink.length === 0) {
            await connection.query(
              'INSERT INTO estudiante_asignatura (id_estudiante, id_asignatura) VALUES (?, ?)',
              [studentId, subject.id]
            );
            console.log(`Linked admin to subject ID ${subject.id}`);
          }
        }
      }
    } else {
      console.log('Admin user not found');
    }

    // Close connection
    await connection.end();
    console.log('Database connection closed');
    console.log('');
    console.log('=============================');
    console.log('Enrollment status updated!');
    console.log('Both student and admin users should now appear as enrolled');
    console.log('=============================');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
updateEnrollment();