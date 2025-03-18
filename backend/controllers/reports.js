const { pool } = require('../config/database');

/**
 * Get teacher performance report
 * Returns performance metrics and feedback for a specific teacher
 */
const getTeacherPerformanceReport = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get teacher info
    const [teachers] = await pool.execute(`
      SELECT d.id, u.nombre_completo, u.email
      FROM docentes d
      JOIN usuarios u ON d.id_usuario = u.id
      WHERE d.id = ?
    `, [id]);
    
    if (teachers.length === 0) {
      return res.status(404).json({ message: 'Docente no encontrado' });
    }
    
    const teacher = teachers[0];
    
    // Get evaluations summary
    const [summary] = await pool.execute(`
      SELECT 
        p.nombre AS periodo,
        COUNT(e.id) AS total_evaluaciones,
        AVG((
          SELECT AVG(ev.puntaje) 
          FROM valoraciones v
          JOIN escala_valoracion ev ON v.valor = ev.valor
          WHERE v.id_evaluacion = e.id
        )) AS promedio_general
      FROM evaluaciones e
      JOIN asignaciones a ON e.id_asignacion = a.id
      JOIN periodos p ON a.id_periodo = p.id
      WHERE a.id_docente = ? AND (e.estado = 'enviada' OR e.estado = 'revisada')
      GROUP BY p.id
      ORDER BY p.fecha_inicio DESC
    `, [id]);
    
    // Get aspect averages
    const [aspectAverages] = await pool.execute(`
      SELECT 
        ae.id AS id_aspecto,
        ae.nombre AS aspecto,
        AVG(ev.puntaje) AS promedio
      FROM valoraciones v
      JOIN escala_valoracion ev ON v.valor = ev.valor
      JOIN aspectos_evaluacion ae ON v.id_aspecto = ae.id
      JOIN evaluaciones e ON v.id_evaluacion = e.id
      JOIN asignaciones a ON e.id_asignacion = a.id
      WHERE a.id_docente = ? AND (e.estado = 'enviada' OR e.estado = 'revisada')
      GROUP BY ae.id
      ORDER BY ae.orden
    `, [id]);
    
    // Get recent comments (anonymized)
    const [comments] = await pool.execute(`
      SELECT 
        v.comentario,
        ae.nombre AS aspecto,
        DATE_FORMAT(e.fecha_evaluacion, '%d/%m/%Y') AS fecha
      FROM valoraciones v
      JOIN aspectos_evaluacion ae ON v.id_aspecto = ae.id
      JOIN evaluaciones e ON v.id_evaluacion = e.id
      JOIN asignaciones a ON e.id_asignacion = a.id
      WHERE a.id_docente = ? AND (e.estado = 'enviada' OR e.estado = 'revisada')
        AND v.comentario IS NOT NULL AND v.comentario != ''
      ORDER BY e.fecha_evaluacion DESC
      LIMIT 10
    `, [id]);
    
    res.json({
      docente: teacher,
      resumen: summary,
      promedios_aspectos: aspectAverages,
      comentarios_recientes: comments
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Get notifications
 * Returns the user's notifications
 */
const getNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.execute(`
      SELECT id, tipo, mensaje, leida, fecha_creacion
      FROM notificaciones
      WHERE id_usuario = ?
      ORDER BY fecha_creacion DESC
      LIMIT 20
    `, [req.user.id]);
    
    res.json(notifications);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Mark notification as read
 * Updates a notification to mark it as read
 */
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.execute(`
      UPDATE notificaciones 
      SET leida = TRUE, fecha_lectura = NOW()
      WHERE id = ? AND id_usuario = ?
    `, [id, req.user.id]);
    
    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getTeacherPerformanceReport,
  getNotifications,
  markNotificationAsRead
};