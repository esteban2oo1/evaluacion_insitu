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

-- Insertar un usuario administrador
INSERT INTO Usuarios (email, password_hash) 
VALUES ('admin@institucion.edu', SHA2('123456', 256));

-- Insertar algunos programas académicos
INSERT INTO Programas (nombre) VALUES ('Ingeniería de Sistemas');
INSERT INTO Programas (nombre) VALUES ('Administración de Empresas');

-- Insertar profesores de ejemplo
INSERT INTO Profesores (nombre, programa_id) VALUES ('Juan Pérez', 1);
INSERT INTO Profesores (nombre, programa_id) VALUES ('María López', 1);
INSERT INTO Profesores (nombre, programa_id) VALUES ('Carlos Rodríguez', 2);

-- Insertar materias
INSERT INTO Materias (nombre, profesor_id, semestre) VALUES ('Programación I', 1, 1);
INSERT INTO Materias (nombre, profesor_id, semestre) VALUES ('Bases de Datos', 1, 3);
INSERT INTO Materias (nombre, profesor_id, semestre) VALUES ('Algoritmos', 2, 2);
INSERT INTO Materias (nombre, profesor_id, semestre) VALUES ('Gestión Empresarial', 3, 4);