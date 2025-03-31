const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

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
const checkRole = (allowedRoles) => (req, res, next) => {
  // Verificamos que el usuario tenga el objeto 'user' y su rol esté presente
  if (!req.user || !req.user.rolId) {
    return res.status(401).json({ success: false, message: 'No estás autenticado o no tienes rol asignado' });
  }

  const userRole = req.user.rolId; // rolId viene del token

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ success: false, message: 'No tienes permiso para acceder a este recurso' });
  }

  next(); // Si el rol es válido, continuamos con la solicitud
};

module.exports = { verifyToken, checkRole };
