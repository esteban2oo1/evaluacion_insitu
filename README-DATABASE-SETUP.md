# Database Setup for Evaluación Docente

Este archivo contiene las instrucciones para configurar la base de datos para el sistema de evaluación docente.

## Estructura de la base de datos

La base de datos `evaluacion_docente_v2` tiene las siguientes tablas:

- `Usuarios`: Almacena información de login (email, password_hash)
- `Programas`: Programas académicos
- `Profesores`: Información de los profesores
- `Materias`: Materias académicas
- `Evaluaciones`: Evaluaciones de los profesores

## Script de configuración

Ejecuta el siguiente script SQL para crear la base de datos y sus tablas:

```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS evaluacion_docente_v2;
USE evaluacion_docente_v2;

-- Tabla de Usuarios (para login)
CREATE TABLE Usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

-- Tabla de Programas Académicos
CREATE TABLE Programas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

-- Tabla de Profesores
CREATE TABLE Profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  programa_id INT,
  FOREIGN KEY (programa_id) REFERENCES Programas(id) ON DELETE SET NULL
);

-- Tabla de Materias
CREATE TABLE Materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  profesor_id INT,
  semestre INT CHECK (semestre BETWEEN 1 AND 10),
  FOREIGN KEY (profesor_id) REFERENCES Profesores(id) ON DELETE SET NULL
);

-- Tabla de Evaluaciones
CREATE TABLE Evaluaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profesor_id INT,
  materia_id INT,
  criterio VARCHAR(255) NOT NULL,
  calificacion DECIMAL(3,1) CHECK (calificacion BETWEEN 0 AND 10),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profesor_id) REFERENCES Profesores(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES Materias(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX idx_profesor_id ON Evaluaciones(profesor_id);
CREATE INDEX idx_materia_id ON Evaluaciones(materia_id);

-- Vista consolidada para reportes de evaluación
CREATE VIEW Reporte_Evaluaciones AS
SELECT 
  p.nombre AS Profesor,
  m.nombre AS Materia,
  m.semestre,
  e.criterio,
  AVG(e.calificacion) AS Promedio_Calificacion,
  COUNT(e.id) AS Total_Evaluaciones
FROM Evaluaciones e
JOIN Profesores p ON e.profesor_id = p.id
JOIN Materias m ON e.materia_id = m.id
GROUP BY p.nombre, m.nombre, m.semestre, e.criterio;

-- Procedimiento para obtener evaluación de un profesor específico
DELIMITER $$
CREATE PROCEDURE ObtenerEvaluacionProfesor(IN prof_id INT)
BEGIN
  SELECT 
    p.nombre AS Profesor,
    m.nombre AS Materia,
    e.criterio,
    e.calificacion,
    e.comentario,
    e.fecha
  FROM Evaluaciones e
  JOIN Profesores p ON e.profesor_id = p.id
  JOIN Materias m ON e.materia_id = m.id
  WHERE e.profesor_id = prof_id
  ORDER BY e.fecha DESC;
END $$
DELIMITER ;

-- Insertar un usuario para login (contraseña encriptada)
INSERT INTO Usuarios (email, password_hash) 
VALUES ('estudiante@estudiante.edu', SHA2('123456', 256));

-- Verificación del login (consulta de prueba)
SELECT * FROM Usuarios 
WHERE email = 'estudiante@estudiante.edu' 
AND password_hash = SHA2('123456', 256);
```

## Credenciales de usuario de demostración

- Email: estudiante@estudiante.edu
- Contraseña: 123456

## Conexión a la base de datos

Actualiza las credenciales en el archivo `.env` del backend:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin
DB_NAME=evaluacion_docente_v2