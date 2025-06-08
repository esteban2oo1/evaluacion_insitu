const Joi = require('joi');
const moment = require('moment');

const configuracionEvaluacionSchema = Joi.object({
  TIPO_EVALUACION_ID: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del tipo de evaluación debe ser un número',
      'number.integer': 'El ID del tipo de evaluación debe ser un número entero',
      'number.positive': 'El ID del tipo de evaluación debe ser un número positivo',
      'any.required': 'El ID del tipo de evaluación es obligatorio'
    }),

  FECHA_INICIO: Joi.date()
    .required()
    .custom((value, helpers) => {
      const today = moment.utc().startOf('day');
      const inicio = moment.utc(value).startOf('day');

      console.log('HOY (UTC):', today.format('YYYY-MM-DD'));
      console.log('FECHA_INICIO (UTC):', inicio.format('YYYY-MM-DD'));

      if (inicio.isBefore(today)) {
        return helpers.message('La fecha de inicio no puede ser menor a la fecha actual');
      }

      return value;
    })
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida',
      'any.required': 'La fecha de inicio es obligatoria',
    }),

  FECHA_FIN: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha fin debe ser una fecha válida',
      'any.required': 'La fecha fin es obligatoria',
    }),

  ACTIVO: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El campo ACTIVO debe ser verdadero o falso',
    }),

}).custom((obj, helpers) => {
  const inicio = moment.utc(obj.FECHA_INICIO).startOf('day');
  const fin = moment.utc(obj.FECHA_FIN).startOf('day');

  if (inicio.isSameOrAfter(fin)) {
    return helpers.message('La fecha de inicio debe ser menor a la fecha fin');
  }

  return obj;
});

module.exports = configuracionEvaluacionSchema;
