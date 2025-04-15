# 🚀 Sistema de Evaluación - Frontend

## 📝 Descripción

Frontend de la aplicación de Evaluación, una plataforma diseñada para gestionar y realizar evaluaciones de desempeño docente. La aplicación está construida con React y utiliza Vite como bundler, ofreciendo una experiencia de usuario moderna y eficiente.

## ✨ Características Principales

- 🎨 Interfaz moderna y responsiva
- 🔐 Autenticación segura
- 📱 Diseño adaptable a diferentes dispositivos
- 📊 Visualización de datos y estadísticas
- 🔄 Actualización en tiempo real

## 🛠️ Tecnologías Utilizadas

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/     # 🧩 Componentes reutilizables
│   ├── pages/         # 📄 Páginas principales
│   ├── services/      # 🔌 Servicios y llamadas a API
│   ├── utils/         # 🛠️ Utilidades y helpers
│   ├── App.jsx        # 🎯 Componente principal
│   └── main.jsx       # ⚡ Punto de entrada
├── public/            # 📦 Archivos estáticos
└── package.json       # 📦 Dependencias y scripts
```

## 🚀 Guía de Instalación

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/esteban2oo1/evaluacion_insitu.git
cd evaluation-system/frontend
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

## 💻 Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
# o
yarn build
```

Los archivos generados se encontrarán en el directorio `dist/`

## 📜 Scripts Disponibles

- `npm run dev` - 🚀 Inicia el servidor de desarrollo
- `npm run build` - 🏗️ Construye la aplicación para producción
- `npm run preview` - 👀 Previsualiza la versión de producción
- `npm run lint` - 🔍 Ejecuta el linter
- `npm run test` - ✅ Ejecuta las pruebas
