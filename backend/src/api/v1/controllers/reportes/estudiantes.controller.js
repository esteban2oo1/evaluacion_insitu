const { getEstudianteEvaluaciones, getEstudiantesEvaluaciones, getEstudiantesByDocenteMateriaGrupo } = require('../../models/reportes/estudiantes.model');

const getEstudianteEvaluacionesController = async (req, res) => {
    try {
        const { idEstudiante, idConfiguracion } = req.params;
        const stats = await getEstudianteEvaluaciones(idEstudiante, idConfiguracion);
        console.log(`Estadísticas obtenidas para el estudiante: ${idEstudiante} con configuración: ${idConfiguracion}`, stats);
        res.json(stats);
    } catch (error) {
        console.error('Error en getEstudianteEvaluacionesController:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas del estudiante' });
    }
};

const getEstudiantesEvaluacionesController = async (req, res) => {
    try {
        const estudiantes = await getEstudiantesEvaluaciones();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error en getEstudiantesEvaluacionesController:', error);
        res.status(500).json({ error: 'Error al obtener lista de estudiantes' });
    }
};

const getEstudiantesByDocenteMateriaGrupoController = async (req, res) => {
    try {
        const { idDocente, codAsignatura, grupo } = req.params;
        const estudiantes = await getEstudiantesByDocenteMateriaGrupo(idDocente, codAsignatura, grupo);
        res.json(estudiantes);
    } catch (error) {
        console.error('Error en getEstudiantesByDocenteMateriaGrupoController:', error);
        res.status(500).json({ error: 'Error al obtener estudiantes por docente, materia y grupo' });
    }
};

module.exports = {
    getEstudianteEvaluacionesController,
    getEstudiantesEvaluacionesController,
    getEstudiantesByDocenteMateriaGrupoController
}; 