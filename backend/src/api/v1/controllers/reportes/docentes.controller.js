const {
    getDocentesAsignaturasModel,
    getEstudiantesEvaluadosModel,
    getAspectosPuntajeModel,
    getComentariosModel
} = require('../../models/reportes/docentes.model');

const getDocentesAsignaturasController = async (req, res) => {
    try {
        const docentes = await getDocentesAsignaturasModel();
        res.json(docentes);
    } catch (error) {
        console.error('Error en getDocentesAsignaturasController:', error);
        res.status(500).json({ error: 'Error al obtener la lista de docentes y asignaturas' });
    }
};

const getEstudiantesEvaluadosController = async (req, res) => {
    try {
        const { idDocente, codAsignatura, grupo } = req.params;
        const estudiantes = await getEstudiantesEvaluadosModel(idDocente, codAsignatura, grupo);
        res.json(estudiantes);
    } catch (error) {
        console.error('Error en getEstudiantesEvaluadosController:', error);
        res.status(500).json({ error: 'Error al obtener el listado de estudiantes evaluados' });
    }
};

const getAspectosPuntajeController = async (req, res) => {
    try {
        const { idDocente } = req.params;
        const aspectos = await getAspectosPuntajeModel(idDocente);
        res.json(aspectos);
    } catch (error) {
        console.error('Error en getAspectosPuntajeController:', error);
        res.status(500).json({ error: 'Error al obtener los aspectos y puntajes' });
    }
};

const getComentariosController = async (req, res) => {
    try {
        const { idDocente } = req.params;
        const comentarios = await getComentariosModel(idDocente);
        res.json(comentarios);
    } catch (error) {
        console.error('Error en getComentariosController:', error);
        res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
};

module.exports = {
    getDocentesAsignaturasController,
    getEstudiantesEvaluadosController,
    getAspectosPuntajeController,
    getComentariosController
}; 