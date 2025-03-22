const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Login controller with enhanced debugging
 * Authenticates user credentials and returns a JWT token
 * Includes detailed logging for troubleshooting authentication issues
 */
const login = async (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Request IP:', req.ip);
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  
  const { username, password } = req.body;
  
  console.log('Login attempt for username:', username);
  console.log('Password provided:', password ? '********' : 'No password provided');
  
  if (!username || !password) {
    console.log('Login failed: Missing credentials');
    return res.status(400).json({ message: 'Se requiere nombre de usuario y contraseña' });
  }
  
  try {
    console.log('Querying database for user:', username);
    
    // Use the original table and column names
    const [rows] = await pool.execute(
      'SELECT id, username, password, nombre_completo, email, rol FROM usuarios WHERE username = ? AND activo = TRUE',
      [username]
    );
    
    console.log('Database query result count:', rows.length);
    
    if (rows.length === 0) {
      console.log('Login failed: User not found or not active');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const user = rows[0];
    console.log('User found:', {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
      password_hash_length: user.password ? user.password.length : 0
    });
    
    console.log('Comparing password with bcrypt...');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', validPassword);
    
    if (!validPassword) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    console.log('Password validation successful');
    
    // Update last access
    await pool.execute(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
      [user.id]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '8h' }
    );
    
    // Register session
    try {
      await pool.execute(
        'INSERT INTO sesiones_usuario (id_usuario, token, ip_address, fecha_expiracion) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 8 HOUR))',
        [user.id, token, req.ip]
      );
      
      // Log activity
      await pool.execute(
        'INSERT INTO registro_actividades (id_usuario, tipo_actividad, descripcion, ip_address) VALUES (?, ?, ?, ?)',
        [user.id, 'login', 'Inicio de sesión exitoso', req.ip]
      );
    } catch (error) {
      // Continue even if session registration fails (tables might not exist)
      console.log('Session registration skipped:', error.message);
    }
    
    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nombre_completo: user.nombre_completo,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Logout controller
 * Invalidates the user's session
 */
const logout = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  try {
    // Try to invalidate session, but continue if it fails
    try {
      await pool.execute(
        'UPDATE sesiones_usuario SET activa = FALSE WHERE token = ?',
        [token]
      );
      
      // Log activity
      await pool.execute(
        'INSERT INTO registro_actividades (id_usuario, tipo_actividad, descripcion, ip_address) VALUES (?, ?, ?, ?)',
        [req.user.id, 'logout', 'Cierre de sesión', req.ip]
      );
    } catch (error) {
      // Continue even if session invalidation fails (tables might not exist)
      console.log('Session invalidation skipped:', error.message);
    }
    
    res.json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Get user profile controller
 * Returns the authenticated user's profile information
 */
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, nombre_completo, email, rol FROM usuarios WHERE id = ?',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  login,
  logout,
  getProfile
};