const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Login controller
 * Authenticates user credentials and returns a JWT token
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, password, nombre_completo, email, rol FROM usuarios WHERE username = ? AND activo = TRUE',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
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
    const [session] = await pool.execute(
      'INSERT INTO sesiones_usuario (id_usuario, token, ip_address, fecha_expiracion) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 8 HOUR))',
      [user.id, token, req.ip]
    );
    
    // Log activity
    await pool.execute(
      'INSERT INTO registro_actividades (id_usuario, tipo_actividad, descripcion, ip_address) VALUES (?, ?, ?, ?)',
      [user.id, 'login', 'Inicio de sesión exitoso', req.ip]
    );
    
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
    // Invalidate session
    await pool.execute(
      'UPDATE sesiones_usuario SET activa = FALSE WHERE token = ?',
      [token]
    );
    
    // Log activity
    await pool.execute(
      'INSERT INTO registro_actividades (id_usuario, tipo_actividad, descripcion, ip_address) VALUES (?, ?, ?, ?)',
      [req.user.id, 'logout', 'Cierre de sesión', req.ip]
    );
    
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