const Joi = require('joi');

const aspectoEvaluacionSchema = Joi.object({
  ETIQUETA: Joi.string()
  .min(10)
  .max(500)
  .required()
  .messages({
    'string.empty': 'La descripción es obligatoria.',
    'string.min': 'La descripción debe tener al menos 10 caracteres.',
    'string.max': 'La descripción no puede tener más de 500 caracteres.',
  }),
  DESCRIPCION: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.empty': 'La descripción es obligatoria.',
      'string.min': 'La descripción debe tener al menos 10 caracteres.',
      'string.max': 'La descripción no puede tener más de 500 caracteres.',
    }),
});

module.exports = { aspectoEvaluacionSchema };
