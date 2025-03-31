const express = require('express');
const { getEstudiantes, getEstudianteById } = require('../../controllers/vista/vistaEstudiante.controller');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       properties:
 *         SEMESTRE_MATRICULA:
 *           type: string
 *           example: 2021-2
 *         SEDE:
 *           type: string
 *           example: BOG
 *         CODIGO_ESTUDIANTE:
 *           type: string
 *           example: 20211001
 *         COD_PROGRAMA:
 *           type: string
 *           example: 1001
 *         DOBLE_PROGRAMA:
 *           type: string
 *           enum: [SI, NO]
 *           example: NO
 *         SEMESTRE_INGRESO:
 *           type: string
 *           example: 2021-1
 *         PERIODO_INGRESO:
 *           type: string
 *           example: 202101
 *         SEMESTRE_CREDITOS:
 *           type: integer
 *           example: 18
 *         PRIMER_APELLIDO:
 *           type: string
 *           example: Pérez
 *         SEGUNDO_APELLIDO:
 *           type: string
 *           example: Gómez
 *         PRIMER_NOMBRE:
 *           type: string
 *           example: Juan
 *         SEGUNDO_NOMBRE:
 *           type: string
 *           example: Carlos
 *         TIPO_DOC:
 *           type: string
 *           example: CC
 *         DOCUMENTO_ESTUDIANTE:
 *           type: string
 *           example: 1234567890
 *         FECHA_NACIMIENTO:
 *           type: string
 *           format: date
 *           example: 2000-05-15
 *         SEXO:
 *           type: string
 *           enum: [M, F]
 *           example: M
 *         TELEFONO:
 *           type: string
 *           example: 1234567
 *         CELULAR:
 *           type: string
 *           example: 3001234567
 *         EMAIL_PNAL:
 *           type: string
 *           example: juanperez@gmail.com
 *         EMAIL_IES:
 *           type: string
 *           example: juan.perez@universidad.edu
 *         DIRECCION:
 *           type: string
 *           example: Calle 123 #45-67
 *         ESTADO_CIVIL:
 *           type: string
 *           example: Soltero
 *         JORNADA:
 *           type: string
 *           enum: [DIURNA, NOCTURNA, VIRTUAL]
 *           example: DIURNA
 *         PERSONA_CONTACTO:
 *           type: string
 *           example: María Pérez
 *         NUMERO_CONTACTO:
 *           type: string
 *           example: 3012345678
 *         ESTADO_MATRICULA:
 *           type: string
 *           enum: [MATRICULADO, RETIRADO, GRADUADO]
 *           example: MATRICULADO
 *         ESTADO_ACADEMICO:
 *           type: string
 *           example: Regular
 *         PROMEDIO_ACUMULADO:
 *           type: number
 *           format: float
 *           example: 4.25
 *         CREDITOS_CURSADOS:
 *           type: integer
 *           example: 90
 *         CREDITOS_PROGRAMA:
 *           type: integer
 *           example: 140
 */

/**
 * @swagger
 * /estudiantes:
 *   get:
 *     summary: Get all estudiantes
 *     tags: [Estudiantes]
 *     responses:
 *       200:
 *         description: List of estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Estudiante'
 *       500:
 *         description: Server error
 */
router.get('/', getEstudiantes);

/**
 * @swagger
 * /estudiantes/{documentoEstudiante}:
 *   get:
 *     summary: Get estudiante by DOCUMENTO_ESTUDIANTE
 *     tags: [Estudiantes]
 *     parameters:
 *       - in: path
 *         name: documentoEstudiante
 *         schema:
 *           type: string
 *         required: true
 *         description: Documento del estudiante
 *     responses:
 *       200:
 *         description: Estudiante data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante not found
 *       500:
 *         description: Server error
 */
router.get('/:documentoEstudiante', getEstudianteById);

module.exports = router;
