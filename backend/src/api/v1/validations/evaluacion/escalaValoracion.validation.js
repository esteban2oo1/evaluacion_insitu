const Joi = require('joi');

const escalaValoracionSchema = Joi.object({
  VALOR: Joi.string()
    .pattern(/^[A-Z]$/)
    .length(1)
    .required()
    .messages({
      'string.empty': 'El valor es obligatorio.',
      'string.length': 'El valor debe tener exactamente un carácter.',
    }),

  ETIQUETA: Joi.string()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'La etiqueta es obligatoria.',
      'string.min': 'La descripción debe tener al menos 3 caracteres.',
      'string.max': 'La etiqueta no puede tener más de 50 caracteres.',
    }),

  DESCRIPCION: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'La descripción no puede tener más de 500 caracteres.',
    }),
});

module.exports = { escalaValoracionSchema };
