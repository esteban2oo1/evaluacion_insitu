const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const { getDocentesAsignaturasModel } = require('../../models/reportes/docentes.model');

const generarInformeDocentes = async (filtros) => {
  try {
    // Leer el template
    const content = fs.readFileSync(path.join(__dirname, '../../templates/docentes.docx'), 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Obtener los datos del modelo
    const docentesData = await getDocentesAsignaturasModel(filtros);

    // Verificar que tenemos datos
    if (!docentesData || !Array.isArray(docentesData)) {
      throw new Error('No se obtuvieron datos válidos del modelo');
    }

    // Extraer un solo programa, semestre y sede (asumiendo que son iguales para todos)
    const primerRegistro = docentesData[0];
    const programa = primerRegistro.PROGRAMA_PREDOMINANTE;
    const semestre = primerRegistro.SEMESTRE_PREDOMINANTE;
    const sede = primerRegistro.NOMBRE_SEDE;

    // Preparar los datos para Docxtemplater
    const templateData = {
      // Datos globales (nivel raíz)
      PROGRAMA_PREDOMINANTE: programa,
      SEMESTRE_PREDOMINANTE: semestre,
      NOMBRE_SEDE: sede,

      // Datos por docente/asignatura
      docentes: docentesData.map(item => ({
        COD_ASIGNATURA: item.COD_ASIGNATURA,
        ASIGNATURA: item.ASIGNATURA,
        DOCENTE: item.DOCENTE,
        GRUPO: item.GRUPO,
        total_evaluaciones_esperadas: item.total_evaluaciones_esperadas,
        evaluaciones_completadas: item.evaluaciones_completadas,
        porcentaje_completado: item.porcentaje_completado,
        estado_evaluacion: item.estado_evaluacion
      })),

      // Información adicional (opcional)
      totalDocentes: docentesData.length,
      resumen: {
        totalCompletadas: docentesData.reduce((sum, doc) => sum + doc.evaluaciones_completadas, 0),
        totalEsperadas: docentesData.reduce((sum, doc) => sum + doc.total_evaluaciones_esperadas, 0),
        promedioCompletado: docentesData.length > 0 
          ? Math.round((docentesData.reduce((sum, doc) => sum + doc.porcentaje_completado, 0) / docentesData.length) * 100) / 100 
          : 0
      }
    };

    // Establecer los datos en el documento
    doc.setData(templateData);

    // Renderizar el documento
    doc.render();

    // Retornar el buffer del documento generado
    return doc.getZip().generate({ type: 'nodebuffer' });

  } catch (error) {
    console.error('Error en generarInformeDocentes:', error);
    throw new Error(`Error al generar el documento: ${error.message}`);
  }
};

module.exports = {
  generarInformeDocentes,
};