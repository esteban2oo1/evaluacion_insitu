// validations/configuracionEvaluacion.validation.js
const Joi = require('joi');
const moment = require('moment');

const configuracionEvaluacionSchema = Joi.object({
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

  // Aquí agregamos el campo ACTIVO que no vendrá en el request, pero lo generamos
  ACTIVO: Joi.any().custom((value, helpers) => {
    const { FECHA_INICIO } = helpers.state.ancestors[0]; // Obtenemos el inicio
    const inicio = moment.utc(FECHA_INICIO).startOf('day');
    const today = moment.utc().startOf('day');

    // Si es igual, activamos
    if (inicio.isSame(today)) {
      return 1;
    } else {
      return 0;
    }
  }),
})
.custom((obj, helpers) => {
  const inicio = moment.utc(obj.FECHA_INICIO).startOf('day');
  const fin = moment.utc(obj.FECHA_FIN).startOf('day');

  if (inicio.isSameOrAfter(fin)) {
    return helpers.message('La fecha de inicio debe ser menor a la fecha fin');
  }

  return obj;
});


module.exports = configuracionEvaluacionSchema;
