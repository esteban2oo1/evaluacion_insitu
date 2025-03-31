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

  PUNTAJE: Joi.number()
    .precision(2) 
    .min(0)
    .max(5)
    .required()
    .messages({
      'number.base': 'El puntaje debe ser un número válido.',
      'number.min': 'El puntaje debe ser mayor o igual a 0.',
      'number.max': 'El puntaje no puede ser mayor que 5.',
    }),

  ORDEN: Joi.number()
    .precision(2)
    .min(1)
    .required()
    .messages({
      'any.required': 'El orden es obligatorio.',
      'number.base': 'El orden debe ser un número válido.',
      'number.min': 'El orden debe ser mayor o igual a 1.'
    }),

  ACTIVO: Joi.number()
    .valid(0, 1)  // Solo se permite 0 o 1
    .required()
    .messages({
      'any.required': 'El estado es obligatorio.',
      'number.base': 'El estado debe ser un número (0 o 1).',
      'any.only': 'El estado solo puede ser (0 o 1).'
    }),
});

module.exports = { escalaValoracionSchema };
