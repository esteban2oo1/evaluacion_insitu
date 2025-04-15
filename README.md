# 🎓 Sistema de Evaluación Docente

## 📝 Descripción

Sistema integral para la evaluación del desempeño docente. La plataforma permite realizar evaluaciones objetivas y gestionar el proceso de retroalimentación.

## 🏗️ Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Backend (`/backend`)
API REST construida con Node.js y Express que maneja la lógica de negocio, autenticación y gestión de datos.

### Frontend (`/frontend`)
Aplicación web moderna construida con React y Vite que proporciona una interfaz de usuario intuitiva y responsiva.

## ✨ Características Principales

- 🔐 Sistema de autenticación seguro
- 👥 Gestión de roles y permisos
- 📊 Evaluaciones de desempeño docente
- 📈 Generación de reportes y estadísticas
- 📱 Interfaz responsiva y moderna
- 🔄 Actualización en tiempo real

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js (v14+)
- Express.js
- MySQL (v5.7+)
- JWT para autenticación

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

## 🚀 Guía de Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/esteban2oo1/evaluacion_insitu.git
cd evaluacion_insitu
```

2. **Configurar el Backend**
```bash
cd backend
npm install
# Configurar variables de entorno en .env
# Importar esquema de base de datos
```

3. **Configurar el Frontend**
```bash
cd frontend
npm install
# Configurar variables de entorno si es necesario
```

4. **Iniciar los Servidores**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```