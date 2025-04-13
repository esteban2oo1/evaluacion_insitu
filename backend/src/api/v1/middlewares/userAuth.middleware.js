const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getPool } = require('../../../db');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ success: false, message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ success: false, message: 'Formato de token inválido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }

    req.user = decoded;
    next();
  });
};

// Middleware para verificar roles permitidos
const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'No estás autenticado' });
    }

    const userId = req.user.userId;
    const pool = await getPool();

    // Primero verificamos en DATALOGIN
    const [dataloginRows] = await pool.query(
      `SELECT user_idrole, role_name 
       FROM DATALOGIN 
       WHERE user_id = ?`,
      [userId]
    );

    if (dataloginRows.length > 0) {
      const userRoleId = dataloginRows[0].user_idrole;
      const roleName = dataloginRows[0].role_name;
      
      // Verificar si el ID del rol está permitido (para roles de DATALOGIN)
      if (allowedRoles.includes(userRoleId.toString())) {
        return next();
      }
      // Verificar si el nombre del rol está permitido
      if (allowedRoles.includes(roleName)) {
        return next();
      }
    }

    // Verificamos en users_roles
    const [userRolesRows] = await pool.query(
      `SELECT r.ID, r.NOMBRE_ROL 
       FROM users_roles ur 
       JOIN roles r ON ur.rol_id = r.ID 
       WHERE ur.user_id = ?`,
      [userId]
    );

    if (userRolesRows.length > 0) {
      // Verificar si alguno de los IDs o nombres de roles adicionales está permitido
      const hasAllowedRole = userRolesRows.some(row => {
        const roleId = row.ID.toString();
        const roleName = row.NOMBRE_ROL;
        return allowedRoles.includes(roleId) || allowedRoles.includes(roleName);
      });
      
      if (hasAllowedRole) {
        return next();
      }
    }

    return res.status(403).json({ 
      success: false, 
      message: 'No tienes permiso para acceder a este recurso' 
    });

  } catch (error) {
    console.error('Error en checkRole:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al verificar roles' 
    });
  }
};

module.exports = { verifyToken, checkRole };
