const jwt = require('jsonwebtoken');
const md5 = require('md5');
const UserAuthModel = require('../../models/auth/userAuth.model');
const VistaProfileModel = require('../../models/vista/vistaProfile.model');
const { JWT_SECRET } = process.env;
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

const login = async (req, res, next) => {
  try {
    const { user_username, user_password } = req.body;
    
    if (!user_username || !user_password) {
      return errorResponse(res, {
        code: 400,
        message: MESSAGES.GENERAL.MISSING_FIELDS,
        error: 'Usuario y contraseña son requeridos'
      });
    }
    
    // Buscar usuario por username
    const user = await UserAuthModel.getUserByUsername(user_username);
    if (!user) {
      return errorResponse(res, {
        code: 401,
        message: MESSAGES.AUTH.INVALID_CREDENTIALS,
        error: 'Usuario no encontrado'
      });
    }
    
    // Verificar contraseña encriptada en MD5
    const hashedPassword = md5(user_password);
    if (user.user_password !== hashedPassword) {
      return errorResponse(res, {
        code: 401,
        message: MESSAGES.AUTH.INVALID_CREDENTIALS,
        error: 'Contraseña incorrecta'
      });
    }
    
    // Verificar si el usuario está activo
    if (user.user_statusid !== '1') {
      return errorResponse(res, {
        code: 403,
        message: MESSAGES.AUTH.USER_INACTIVE,
        error: 'Usuario inactivo'
      });
    }
    
    // Obtener roles adicionales del usuario
    const additionalRoles = await VistaProfileModel.getRolesAdicionales(user.user_id);
    
    // Preparar array de nombres de roles adicionales
    const additionalRoleNames = additionalRoles.map(role => role.NOMBRE_ROL);
    
    // Generar JWT incluyendo roles adicionales
    const token = jwt.sign(
      { 
        userId: user.user_id,
        username: user.user_username,
        roleId: user.user_idrole,
        roleName: user.role_name,
        additionalRoles: additionalRoleNames
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const userName = user.user_name
      .split(' ') // Divide el nombre completo en partes
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palabra
      .join(' '); // Vuelve a juntar las palabras con un espacio
    
    // Responder con éxito incluyendo roles adicionales
    return successResponse(res, {
      code: 200,
      message: `${userName} 👋`,
      data: { 
        token,
        user: {
          id: user.user_id,
          name: userName,
          username: user.user_username,
          primaryRole: user.role_name,
          additionalRoles: additionalRoleNames
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(res, {
      code: 500,
      message: MESSAGES.GENERAL.ERROR,
      error: error.message
    });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { userId, roleId, roleName } = req.user;

    // Obtener información básica del usuario desde DATALOGIN
    const userInfo = await UserAuthModel.getUserById(userId);
    if (!userInfo) {
      return errorResponse(res, {
        code: 404,
        message: MESSAGES.USER.USER_NOT_FOUND,
        error: 'Usuario no encontrado'
      });
    }

    let profileData = {
      user_id: userInfo.user_id,
      user_name: userInfo.user_name,
      user_email: userInfo.user_email,
      roles: {
        principal: {
          id: userInfo.user_idrole,
          nombre: userInfo.role_name
        },
        adicionales: []
      }
    };

    // Si es estudiante (user_idrole = 1)
    if (userInfo.user_idrole === 1) {
      const estudianteInfo = await VistaProfileModel.getEstudianteInfo(userInfo.user_username);
      if (!estudianteInfo || estudianteInfo.length === 0) {
        return errorResponse(res, {
          code: 404,
          message: MESSAGES.USER.USER_NOT_FOUND,
          error: 'Información del estudiante no encontrada'
        });
      }

      const materias = await VistaProfileModel.getMateriasEstudiante(userInfo.user_username);

      // Procesar roles adicionales
      const rolesAdicionales = new Map();
      estudianteInfo.forEach(info => {
        if (info.ROL_ADICIONAL) {
          rolesAdicionales.set(info.ID_ROL_ADICIONAL, {
            id: info.ID_ROL_ADICIONAL,
            nombre: info.ROL_ADICIONAL
          });
        }
      });

      // Usar la primera fila para la información básica
      const infoBase = estudianteInfo[0];
      profileData = {
        tipo: 'estudiante',
        sede: infoBase.SEDE,
        nombre_completo: infoBase.user_name,
        tipo_doc: infoBase.TIPO_DOC,
        documento: infoBase.DOCUMENTO_ESTUDIANTE,
        estado_matricula: infoBase.ESTADO_MATRICULA,
        programa: infoBase.NOM_PROGRAMA,
        periodo: infoBase.SEMESTRE_MATRICULA,
        semestre: infoBase.SEMESTRE,
        grupo: infoBase.GRUPO,
        materias: materias.map((materia, index) => ({
          id: index + 1,
          codigo: materia.CODIGO_MATERIA,
          nombre: materia.NOMBRE_MATERIA,
          docente: {
            documento: materia.DOCUMENTO_DOCENTE,
            nombre: materia.NOMBRE_DOCENTE
          }
        })),
        roles: {
          principal: {
            id: infoBase.user_idrole,
            nombre: infoBase.ROL_PRINCIPAL
          },
          adicionales: Array.from(rolesAdicionales.values())
        }
      };
    }
    // Si es docente (user_idrole = 2)
    else if (userInfo.user_idrole === 2) {
      const docenteInfo = await VistaProfileModel.getDocenteInfo(userInfo.user_username);
      if (!docenteInfo || docenteInfo.length === 0) {
        return errorResponse(res, {
          code: 404,
          message: MESSAGES.USER.USER_NOT_FOUND,
          error: 'Información del docente no encontrada'
        });
      }

      const materias = await VistaProfileModel.getMateriasDocente(userInfo.user_username);

      // Procesar roles adicionales
      const rolesAdicionales = new Map();
      docenteInfo.forEach(info => {
        if (info.ROL_ADICIONAL) {
          rolesAdicionales.set(info.ID_ROL_ADICIONAL, {
            id: info.ID_ROL_ADICIONAL,
            nombre: info.ROL_ADICIONAL
          });
        }
      });

      // Usar la primera fila para la información básica
      const infoBase = docenteInfo[0];
      profileData = {
        tipo: 'docente',
        email: userInfo.user_email,
        documento: infoBase.DOCUMENTO_DOCENTE,
        nombre_completo: infoBase.NOMBRE_DOCENTE,
        sede: infoBase.SEDE,
        periodo: infoBase.PERIODO,
        materias: materias.map((materia, index) => ({
          id: index + 1,
          codigo: materia.COD_ASIGNATURA,
          nombre: materia.ASIGNATURA,
          semestre: materia.SEMESTRE_PREDOMINANTE,
          programa: materia.PROGRAMA_PREDOMINANTE
        })),
        roles: {
          principal: {
            id: infoBase.user_idrole,
            nombre: infoBase.ROL_PRINCIPAL
          },
          adicionales: Array.from(rolesAdicionales.values())
        }
      };
    }

    return successResponse(res, {
      code: 200,
      message: MESSAGES.USER.PROFILE_FETCHED,
      data: profileData
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    return errorResponse(res, {
      code: 500,
      message: MESSAGES.GENERAL.ERROR,
      error: error.message
    });
  }
};

module.exports = {
  login,
  getProfile,
};