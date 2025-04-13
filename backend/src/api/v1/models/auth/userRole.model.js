const { getPool } = require('../../../../db');

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
    const [rows] = await pool.query(
      `SELECT ur.id, ur.user_id, r.NOMBRE_ROL as role_name, ur.rol_id
       FROM users_roles ur
       JOIN ROLES r ON ur.rol_id = r.ID`
    );
    return rows;
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
