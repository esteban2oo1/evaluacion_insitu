const { getPool } = require('../../../../db');

const TiposEvaluacion = {

  getConfiguracionDetalles: async (configuracionId) => {
    try {
      const pool = getPool();
      
      // Retrieve the evaluation configuration
      const [configuracion] = await pool.query(
        'SELECT ce.ID, te.NOMBRE AS NOMBRE, ce.FECHA_INICIO, ce.FECHA_FIN, ce.ACTIVO ' +
        'FROM CONFIGURACION_EVALUACION ce ' +
        'JOIN TIPOS_EVALUACIONES te ON ce.TIPO_EVALUACION_ID = te.ID ' +
        'WHERE ce.ID = ?',
        [configuracionId]
      );
      
      if (configuracion.length === 0) {
        throw new Error('Configuración no encontrada');
      }
      
      // Retrieve the aspects associated with the configuration
      const [aspectos] = await pool.query(
        'SELECT ae.ID, ae.ETIQUETA, ae.DESCRIPCION, ca.ORDEN ' +
        'FROM CONFIGURACION_ASPECTO ca ' +
        'JOIN ASPECTOS_EVALUACION ae ON ca.ASPECTO_ID = ae.ID ' +
        'WHERE ca.CONFIGURACION_EVALUACION_ID = ? AND ca.ACTIVO = TRUE ' +
        'ORDER BY ca.ORDEN',
        [configuracionId]
      );
      
      // Retrieve the evaluations for this configuration
      const [valoraciones] = await pool.query(
        'SELECT ev.ID, ev.ETIQUETA, ev.VALOR, cv.PUNTAJE ' +
        'FROM CONFIGURACION_VALORACION cv ' +
        'JOIN ESCALA_VALORACION ev ON cv.VALORACION_ID = ev.ID ' +
        'WHERE cv.CONFIGURACION_EVALUACION_ID = ? AND cv.ACTIVO = TRUE ' +
        'ORDER BY cv.ORDEN',
        [configuracionId]
      );
      
      return {
        configuracion: configuracion[0],
        aspectos,
        valoraciones
      };
    } catch (error) {
      throw error;
    }
  },


  // Get all tipos de evaluacion
  getAllTipos: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM TIPOS_EVALUACIONES');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a tipo de evaluacion by ID
  getTipoById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM TIPOS_EVALUACIONES WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create a new tipo de evaluacion
  createTipo: async (tipoData) => {
    try {
      const pool = getPool();
      const { NOMBRE, DESCRIPCION, ACTIVO } = tipoData;
      const [result] = await pool.query(
        'INSERT INTO TIPOS_EVALUACIONES (NOMBRE, DESCRIPCION, ACTIVO) VALUES (?, ?, ?)',
        [NOMBRE, DESCRIPCION, ACTIVO ?? true]
      );
      return { id: result.insertId, ...tipoData };
    } catch (error) {
      throw error;
    }
  },

  // Update an existing tipo de evaluacion
  updateTipo: async (id, tipoData) => {
    try {
      const pool = getPool();
      const { NOMBRE, DESCRIPCION, ACTIVO } = tipoData;
      await pool.query(
        'UPDATE TIPOS_EVALUACIONES SET NOMBRE = ?, DESCRIPCION = ?, ACTIVO = ? WHERE ID = ?',
        [NOMBRE, DESCRIPCION, ACTIVO, id]
      );
      return { id, ...tipoData };
    } catch (error) {
      throw error;
    }
  },

  // Delete a tipo de evaluacion
  deleteTipo: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM TIPOS_EVALUACIONES WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = TiposEvaluacion;
