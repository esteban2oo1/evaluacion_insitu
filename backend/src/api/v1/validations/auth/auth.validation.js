const Joi = require('joi');

// Esquema de validación para login
const loginSchema = Joi.object({
  user_username: Joi.string()
    .pattern(/^[0-9]{7,10}$/)
    .required()
    .messages({
      'string.pattern.base': 'El nombre de usuario debe ser un número de entre 8 y 10 dígitos.',
      'any.required': 'El nombre de usuario es requerido.',
    }),

  user_password: Joi.string()
    .min(5) 
    .max(20) 
    .pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ!@#$%^&*()_+\-=\[\]{}|;:'",.<>?]*$/)
    .required()
    .messages({
      'string.base': 'La contraseña debe ser una cadena de caracteres.',
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'string.max': 'La contraseña no puede tener más de 20 caracteres.',
      'string.pattern.base': 'La contraseña solo puede contener letras y números.',
      'any.required': 'La contraseña es requerida.',
    }),
});


module.exports = {
  loginSchema
};
