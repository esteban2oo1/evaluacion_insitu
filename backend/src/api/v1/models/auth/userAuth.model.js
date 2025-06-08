const { getPool } = require('../../../../db');

const UserAuthModel = {
  getUserByUsername: async (username) => {
    try {
      const pool = await getPool();
      const [rows] = await pool.query(
        `SELECT user_id, user_name, user_username, user_password, user_email, 
                user_idrole, user_statusid, role_name
         FROM DATALOGIN 
         WHERE user_username = ?`,
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('Error en getUserByUsername:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const pool = await getPool();
      const [rows] = await pool.query(
        `SELECT user_id, user_name, user_username, user_email, 
                user_idrole, user_statusid, role_name
         FROM DATALOGIN 
         WHERE user_id = ?`,
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  },
};

module.exports = UserAuthModel;