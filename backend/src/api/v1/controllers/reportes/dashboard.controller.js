const dashboardModel = require('../../models/reportes/dashboard.model');

const getDashboardStats = async (req, res) => {
    try {
        const { idConfiguracion } = req.params;
        const stats = await dashboardModel.getDashboardStats(idConfiguracion);
        res.json(stats);
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getAspectosPromedio = async (req, res) => {
    try {
        const aspectos = await dashboardModel.getAspectosPromedio();
        res.json(aspectos);
    } catch (error) {
        console.error('Error al obtener promedios por aspecto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getRankingDocentes = async (req, res) => {
    try {
        const ranking = await dashboardModel.getRankingDocentes();
        res.json(ranking);
    } catch (error) {
        console.error('Error al obtener ranking de docentes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getPodioDocentes = async (req, res) => {
    try {
        const podio = await dashboardModel.getPodioDocentes();
        res.json(podio);
    } catch (error) {
        console.error('Error al obtener podio de docentes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getDashboardStats,
    getAspectosPromedio,
    getRankingDocentes,
    getPodioDocentes
}; 