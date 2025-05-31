const Joi = require('joi');

const aspectoEvaluacionSchema = Joi.object({
  ETIQUETA: Joi.string()
  .min(10)
  .max(500)
  .required()
  .messages({
    'string.empty': 'La etiqueta es obligatoria.',
    'string.min': 'La etiqueta debe tener al menos 3 caracteres.',
    'string.max': 'La etiqueta no puede tener más de 50 caracteres.',
  }),
  DESCRIPCION: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.empty': 'La descripción es obligatoria.',
      'string.min': 'La descripción debe tener al menos 6 caracteres.',
      'string.max': 'La descripción no puede tener más de 100 caracteres.',
    }),
});

module.exports = { aspectoEvaluacionSchema };
