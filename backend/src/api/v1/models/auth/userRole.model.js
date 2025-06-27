const { getPool, getSecurityPool } = require('../../../../db');

const UserRoleModel = {
  getUserRoles: async (userId) => {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT ur.id, ur.user_id, r.NOMBRE_ROL as role_name
       FROM users_roles ur
       JOIN ROLES r ON ur.rol_id = r.ID
       WHERE ur.user_id = ?`,
      [userId]
    );
    return rows;
  },

  getAllUserRoles: async () => {
    const pool = await getPool();
    const securityPool = await getSecurityPool();

    // Paso 1: Traer roles con user_id
    const [roleRows] = await pool.query(
      `SELECT ur.id, ur.user_id, r.NOMBRE_ROL as role_name, ur.rol_id
      FROM users_roles ur
      JOIN ROLES r ON ur.rol_id = r.ID`
    );

    // Extraer user_ids únicos
    const userIds = [...new Set(roleRows.map(row => row.user_id))];

    if (userIds.length === 0) {
      return [];
    }

    // Paso 2: Traer usernames desde datalogin
    const [userRows] = await securityPool.query(
      `SELECT user_id, user_name FROM datalogin WHERE user_id IN (?)`,
      [userIds]
    );

    // Crear un diccionario para búsqueda rápida
    const userMap = {};
    userRows.forEach(user => {
      userMap[user.user_id] = user.user_name;
    });

    // Paso 3: Mezclar los datos
    const result = roleRows.map(row => ({
      ...row,
      user_name: userMap[row.user_id] || null,
    }));

    return result;
  },


  searchUser: async (username) => {
    const pool = await getSecurityPool();
    const [rows] = await pool.query(
        'SELECT user_id, user_name, user_username, user_email, role_name FROM datalogin WHERE user_username = ?',
        [username]
    );
    return rows[0];
  },

  assignRole: async (userId, roleId) => {
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO users_roles (user_id, rol_id) VALUES (?, ?)',
      [userId, roleId]
    );

    // Obtener el rol recién creado
    const [rows] = await pool.query(
      'SELECT ur.id, ur.user_id, r.NOMBRE_ROL as role_name FROM users_roles ur JOIN ROLES r ON ur.rol_id = r.ID WHERE ur.id = ?',
      [result.insertId]
    );

    return rows[0];
  },

  updateRoleAssignment: async (id, roleId) => {
    const pool = await getPool();
    const [result] = await pool.query(
      'UPDATE users_roles SET rol_id = ?, UPDATED_AT = NOW() WHERE id = ?',
      [roleId, id]
    );
    return result;
  },

  removeRole: async (id) => {
    const pool = await getPool();
    const [result] = await pool.query(
      'DELETE FROM users_roles WHERE id = ?',
      [id]
    );
    return result;
  },

  hasRole: async (userId, roleId) => {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT 1 FROM users_roles WHERE user_id = ? AND rol_id = ?',
      [userId, roleId]
    );
    return rows.length > 0;
  }
};

module.exports = UserRoleModel;
