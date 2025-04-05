const { getPool } = require('../../../../db');

const UserAuth = {
  getUserByDocument: async (documento) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM USER_AUTH WHERE DOCUMENTO_USUARIO = ?', [documento]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM USER_AUTH WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserAuth;