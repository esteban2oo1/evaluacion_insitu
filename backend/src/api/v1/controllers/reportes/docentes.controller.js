const {
    getDocentesAsignaturasModel,
    getEstudiantesEvaluadosModel,
    getAspectosPuntajeModel,
    getComentariosModel
} = require('../../models/reportes/docentes.model');

const getDocentesAsignaturasController = async (req, res) => {
    try {
        const {
            idConfiguracion,
            periodo,
            nombreSede,
            nomPrograma,
            semestre,
            grupo
        } = req.query;

        // Todos los filtros son opcionales
        const docentes = await getDocentesAsignaturasModel({
            idConfiguracion,
            periodo,
            nombreSede,
            nomPrograma,
            semestre,
            grupo
        });

        res.json({
            success: true,
            data: docentes || [],
        });
    } catch (error) {
        console.error('Error en getDocentesAsignaturasController:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la lista de docentes y asignaturas',
            detalle: error.message
        });
    }
};

const getEstudiantesEvaluadosController = async (req, res) => {
    try {
        const { idDocente, codAsignatura, grupo } = req.params;
        
        if (!idDocente || !codAsignatura || !grupo) {
            return res.status(400).json({ 
                error: 'Faltan parámetros requeridos: idDocente, codAsignatura y grupo' 
            });
        }

        const estudiantes = await getEstudiantesEvaluadosModel(idDocente, codAsignatura, grupo);
        if (!estudiantes) {
            return res.status(404).json({ 
                error: 'No se encontraron estudiantes evaluados para los parámetros proporcionados' 
            });
        }
        
        res.json(estudiantes);
    } catch (error) {
        console.error('Error en getEstudiantesEvaluadosController:', error);
        res.status(500).json({ 
            error: 'Error al obtener el listado de estudiantes evaluados',
            detalle: error.message 
        });
    }
};

const getAspectosPuntajeController = async (req, res) => {
    try {
        const { idDocente } = req.params;
        
        if (!idDocente) {
            return res.status(400).json({ 
                error: 'El parámetro idDocente es requerido' 
            });
        }

        const aspectos = await getAspectosPuntajeModel(idDocente);
        if (!aspectos || aspectos.length === 0) {
            return res.status(404).json({ 
                error: 'No se encontraron aspectos y puntajes para el docente especificado' 
            });
        }
        
        res.json(aspectos);
    } catch (error) {
        console.error('Error en getAspectosPuntajeController:', error);
        res.status(500).json({ 
            error: 'Error al obtener los aspectos y puntajes',
            detalle: error.message 
        });
    }
};

const getComentariosController = async (req, res) => {
    try {
        const { idDocente } = req.params;
        
        if (!idDocente) {
            return res.status(400).json({ 
                error: 'El parámetro idDocente es requerido' 
            });
        }

        const comentarios = await getComentariosModel(idDocente);
        if (!comentarios || comentarios.length === 0) {
            return res.status(404).json({ 
                error: 'No se encontraron comentarios para el docente especificado' 
            });
        }
        
        res.json(comentarios);
    } catch (error) {
        console.error('Error en getComentariosController:', error);
        res.status(500).json({ 
            error: 'Error al obtener los comentarios',
            detalle: error.message 
        });
    }
};

module.exports = {
    getDocentesAsignaturasController,
    getEstudiantesEvaluadosController,
    getAspectosPuntajeController,
    getComentariosController
}; 