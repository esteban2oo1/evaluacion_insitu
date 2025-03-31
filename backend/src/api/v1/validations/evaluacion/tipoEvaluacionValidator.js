const Joi = require('joi');

// Esquema para la validación de la creación y actualización de un Tipo de Evaluación
const tipoEvaluacionSchema = Joi.object({
  NOMBRE: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': '"NOMBRE" debe ser una cadena de texto',
      'string.empty': '"NOMBRE" no puede estar vacío',
      'string.min': '"NOMBRE" debe tener al menos 3 caracteres',
      'string.max': '"NOMBRE" no puede tener más de 100 caracteres',
      'any.required': '"NOMBRE" es un campo obligatorio'
    }),
  
  DESCRIPCION: Joi.string()
    .optional()
    .max(500)
    .messages({
      'string.base': '"DESCRIPCION" debe ser una cadena de texto',
      'string.max': '"DESCRIPCION" no puede tener más de 500 caracteres'
    }),
  
  ACTIVO: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': '"ACTIVO" debe ser un valor booleano'
    }),
  
  FECHA_CREACION: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': '"FECHA_CREACION" debe ser una fecha válida en formato ISO'
    }),
  
  FECHA_ACTUALIZACION: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.base': '"FECHA_ACTUALIZACION" debe ser una fecha válida en formato ISO'
    })
});

// Esquema para la validación de un parámetro ID en la ruta
const tipoEvaluacionIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': '"id" debe ser un número',
      'number.integer': '"id" debe ser un número entero',
      'number.positive': '"id" debe ser un número positivo',
      'any.required': '"id" es un campo obligatorio'
    })
});

// Función para validar los datos de la creación y actualización de un tipo de evaluación
const validateTipoEvaluacion = (data) => tipoEvaluacionSchema.validate(data);

// Función para validar el ID de un tipo de evaluación
const validateTipoEvaluacionId = (data) => tipoEvaluacionIdSchema.validate(data);

module.exports = {
  validateTipoEvaluacion,
  validateTipoEvaluacionId
};
