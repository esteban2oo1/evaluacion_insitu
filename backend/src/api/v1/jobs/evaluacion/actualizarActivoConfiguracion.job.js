const cron = require('node-cron');
const moment = require('moment');
const { getPool } = require('../../../../db'); // Traemos getPool

// Programa el job para que corra todos los días a la medianoche
cron.schedule('0 0 * * *', async () => {  // Cada minuto (solo para pruebas)
  console.log('⏰ Ejecutando job para actualizar ACTIVO...');

  const today = moment.utc().format('YYYY-MM-DD');

  try {
    const pool = getPool(); // 👈🏻 Aquí obtenemos el pool

    // Actualizar ACTIVO = 1 si hoy es igual a FECHA_INICIO
    await pool.query(`
      UPDATE configuracion_evaluacion
      SET ACTIVO = 1
      WHERE DATE(FECHA_INICIO) = ?
    `, [today]);

    // Desactivar ACTIVO = 0 si hoy es igual o mayor a FECHA_FIN
    await pool.query(`
      UPDATE configuracion_evaluacion
      SET ACTIVO = 0
      WHERE DATE(FECHA_FIN) <= ?
    `, [today]);

    console.log('✅ Job completado: ACTIVO actualizado correctamente.');
  } catch (error) {
    console.error('❌ Error actualizando ACTIVO:', error.message);
  }
});
