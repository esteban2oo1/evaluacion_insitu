const jwt = require('jsonwebtoken');
const md5 = require('md5');
const UserAuthModel = require('../../models/auth/userAuth.model');
const VistaAcademicaModel = require('../../models/vista/vistaAcademica.model');
const VistaEstudianteModel = require('../../models/vista/vistaEstudiante.model'); 
const RolesModel = require('../../models/auth/roles.model'); 
const { JWT_SECRET } = process.env;

const login = async (req, res, next) => {
  try {
    const { DOCUMENTO_USUARIO, CONTRASEÑA } = req.body;

    // Buscar usuario por documento
    const user = await UserAuthModel.getUserByDocument(DOCUMENTO_USUARIO);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Verificar contraseña encriptada en MD5
    const hashedPassword = md5(CONTRASEÑA);
    if (user.CONTRASEÑA !== hashedPassword) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Verificar si el usuario está activo
    if (!user.ACTIVO) {
      return res.status(403).json({ success: false, message: 'Usuario inactivo' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.ID, documento: user.DOCUMENTO_USUARIO, rolId: user.ROL_ID },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { documento, rolId } = req.user; // Obtener el documento y el rol del usuario desde el token
    console.log('Documento:', documento);
    console.log('Rol ID:', rolId);

    // Obtener el nombre del rol
    const nombreRol = await RolesModel.getRol(rolId);
    if (!nombreRol) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    let profileData = {};

    if (rolId === 2) { // Si es estudiante (ROL_ID = 2)
      const estudianteInfo = await VistaEstudianteModel.getEstudianteByDocumento(documento);
      if (!estudianteInfo || estudianteInfo.length === 0) {
        return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
      }

      // Construir el objeto profileData con la información del estudiante
      profileData = {
        NOMBRE_ESTUDIANTE: estudianteInfo[0].NOMBRE_ESTUDIANTE,
        DOCUMENTO_ESTUDIANTE: documento,
        SEMESTRE_MATRICULA: estudianteInfo[0].SEMESTRE_MATRICULA,
        NOMBRE_PROGRAMA: estudianteInfo[0].NOMBRE_PROGRAMA,
        MATERIAS: estudianteInfo.map((info, index) => ({
          AI: index + 1,  // O asigna un ID de curso real si lo tienes
          CODIGO_MATERIA: info.CODIGO_MATERIA,
          NOMBRE_MATERIA: info.NOMBRE_MATERIA,
          docente: {
            DOCUMENTO_DOCENTE: info.DOCUMENTO_DOCENTE,
            NOMBRE_DOCENTE: info.NOMBRE_DOCENTE,
          },
        })),
        ESTADO_MATRICULA: estudianteInfo[0].ESTADO_MATRICULA,
      };
      

    } else { // Para cualquier otro rol (Docente, Director de Programa, etc.)
      const docenteInfo = await VistaAcademicaModel.getDocenteByDocumento(documento);
      if (!docenteInfo || docenteInfo.length === 0) {
        return res.status(404).json({ success: false, message: 'Docente no encontrado' });
      }

      // Construir el objeto profileData con la información del docente
      profileData = {
        NOMBRE_DOCENTE: docenteInfo[0].NOMBRE_DOCENTE,
        DOCUMENTO_DOCENTE: documento,
        MATERIAS: docenteInfo.map(info => ({
          NOMBRE_MATERIA: info.NOMBRE_MATERIA, // Mapear las materias de cada registro
        })),
      };
    }

    // Agregar el rol como un objeto
    profileData.ROL = nombreRol;

    return res.status(200).json({ success: true, data: profileData });
  } catch (error) {
    console.error('Error en getProfile:', error); // Registrar el error en la consola
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

module.exports = {
  login,
  getProfile,
};