const Joi = require('joi');

const aspectoEvaluacionSchema = Joi.object({
  ETIQUETA: Joi.string()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'La etiqueta es obligatoria.',
      'string.min': 'La etiqueta debe tener al menos 3 caracteres.',
      'string.max': 'La etiqueta no puede tener más de 200 caracteres.',
      'string.pattern.base': 'La etiqueta solo puede contener letras y espacios, sin números ni símbolos.',
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

module.exports = { aspectoEvaluacionSchema };
