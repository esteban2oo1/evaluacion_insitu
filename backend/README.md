# Sistema de Evaluación - Backend

## 📝 Descripción

API backend para el Sistema de Evaluación Docente, una plataforma diseñada para gestionar y realizar evaluaciones de desempeño docente en instituciones educativas. El sistema permite una evaluación integral y objetiva del trabajo de los docentes, facilitando el proceso de retroalimentación y mejora continua.

## ✨ Características Principales

- 🔐 Autenticación de usuarios (login/logout)
- 👥 Control de acceso basado en roles
- 📊 Gestión de evaluaciones
- 📈 Reportes de desempeño

## 🛠️ Tecnologías Utilizadas

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- Express.js
- JWT para autenticación

## 📁 Estructura del Proyecto

```
backend/
├── config/             # Archivos de configuración
│   └── database.js     # Configuración de conexión a base de datos
├── controllers/        # Controladores de rutas
│   ├── auth.js         # Controlador de autenticación
│   ├── evaluations.js  # Controlador de evaluaciones
│   └── reports.js      # Controlador de reportes
├── middleware/         # Middleware personalizado
│   └── auth.js         # Middleware de autenticación
├── routes/             # Rutas de la API
│   ├── auth.js         # Rutas de autenticación
│   ├── evaluations.js  # Rutas de evaluaciones
│   └── reports.js      # Rutas de reportes
├── sql/                # Scripts SQL y migraciones
│   ├── schema.sql      # Esquema de la base de datos
│   └── migrations/     # Scripts de migración
├── utils/              # Funciones de utilidad
│   └── logger.js       # Utilidad de registro
├── .env                # Variables de entorno
├── package.json        # Dependencias del proyecto
├── README.md           # Documentación del proyecto
└── server.js           # Archivo principal del servidor
```

## 🚀 Guía de Instalación

### Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/esteban2oo1/evaluacion_insitu.git
cd evaluation-system/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la base de datos**
```sql
CREATE DATABASE evaluacion_docente;
```

4. **Configurar variables de entorno**
   - Copiar el archivo `.env.example` a `.env`
   - Actualizar las credenciales y configuraciones en el archivo `.env`:
   ```
   PORT=tu_port
   DB_HOST=tu_host
   DB_USER=tu_user
   DB_PASSWORD=tu_contraseña
   DB_NAME=tu_db
   JWT_SECRET=tu_clave_secreta
   ```

5. **Configurar la base de datos**
   - Los scripts SQL se encuentran en el directorio `sql/`
   - Importar el esquema:
   ```bash
   mysql -u tu_usuario -p evaluacion_docente < sql/schema.sql
   ```
   > **Nota**: El directorio `sql/` no está incluido en el control de versiones por contener datos sensibles o configuraciones locales.

6. **Iniciar el servidor**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```
