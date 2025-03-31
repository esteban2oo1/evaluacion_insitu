const { getPool } = require('../../../../db');

const Roles = {
  getAllRoles: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM ROLES');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getRolById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM ROLES WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  getRol: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT NOMBRE_ROL FROM ROLES WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createRol: async (rolData) => {
    try {
      const pool = getPool();
      const { NOMBRE_ROL } = rolData;
      const [result] = await pool.query(
        'INSERT INTO ROLES (NOMBRE_ROL) VALUES (?)',
        [NOMBRE_ROL]
      );
      return { id: result.insertId, ...rolData };
    } catch (error) {
      throw error;
    }
  },

  updateRol: async (id, rolData) => {
    try {
      const pool = getPool();
      const { NOMBRE_ROL } = rolData;
      await pool.query(
        'UPDATE ROLES SET NOMBRE_ROL = ? WHERE ID = ?',
        [NOMBRE_ROL, id]
      );
      return { id, ...rolData };
    } catch (error) {
      throw error;
    }
  },

  deleteRol: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM ROLES WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Roles;