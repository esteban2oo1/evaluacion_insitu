-- Create demo users for testing
-- This script adds demo users to the database for testing purposes

-- Check if the usuarios table exists, create it if it doesn't
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  rol ENUM('admin', 'estudiante', 'profesor', 'evaluador') NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso DATETIME
);

-- Check if the sesiones_usuario table exists, create it if it doesn't
CREATE TABLE IF NOT EXISTS sesiones_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATETIME NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Check if the registro_actividades table exists, create it if it doesn't
CREATE TABLE IF NOT EXISTS registro_actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  tipo_actividad VARCHAR(50) NOT NULL,
  descripcion TEXT,
  ip_address VARCHAR(45),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Insert new student user (if it doesn't exist)
INSERT INTO usuarios (username, password, nombre_completo, email, rol)
SELECT 'estudiante@estudiante.edu', '$2b$10$XFxlJV9zkGYpb.jN3YBqAOEZvuJ7giA0EMh.Ro5OH1aBGUAwG1PYm', 'Estudiante', 'estudiante@estudiante.edu', 'estudiante'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE username = 'estudiante@estudiante.edu'
);

-- Insert demo non-enrolled student user (if it doesn't exist)
INSERT INTO usuarios (username, password, nombre_completo, email, rol)
SELECT 'nomastriculado@estudiante.edu', '$2b$10$XFxlJV9zkGYpb.jN3YBqAOEZvuJ7giA0EMh.Ro5OH1aBGUAwG1PYm', 'Ana Gómez', 'nomastriculado@estudiante.edu', 'estudiante'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE username = 'nomastriculado@estudiante.edu'
);

-- Insert demo admin user (if it doesn't exist)
INSERT INTO usuarios (username, password, nombre_completo, email, rol)
SELECT 'admin@institucion.edu', '$2b$10$XFxlJV9zkGYpb.jN3YBqAOEZvuJ7giA0EMh.Ro5OH1aBGUAwG1PYm', 'Administrador del Sistema', 'admin@institucion.edu', 'admin'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE username = 'admin@institucion.edu'
);

-- Note: The password hash above corresponds to '123456'
-- It was generated using bcrypt with 10 rounds

-- Create a table for student information if it doesn't exist
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  matriculado BOOLEAN DEFAULT TRUE,
  semestre INT,
  id_programa INT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Create a table for programs if it doesn't exist
CREATE TABLE IF NOT EXISTS programas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Insert demo programs if they don't exist
INSERT INTO programas (id, nombre, descripcion)
SELECT 1, 'Ingeniería de Sistemas', 'Programa de Ingeniería de Sistemas'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM programas WHERE id = 1
);

INSERT INTO programas (id, nombre, descripcion)
SELECT 2, 'Administración de Empresas', 'Programa de Administración de Empresas'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM programas WHERE id = 2
);

-- Link students to their information
INSERT INTO estudiantes (id_usuario, matricula, matriculado, semestre, id_programa)
SELECT 
  (SELECT id FROM usuarios WHERE username = 'estudiante@estudiante.edu'),
  'EST2023-789',
  TRUE,
  4,
  1
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM estudiantes WHERE matricula = 'EST2023-789'
);

INSERT INTO estudiantes (id_usuario, matricula, matriculado, semestre, id_programa)
SELECT 
  (SELECT id FROM usuarios WHERE username = 'nomastriculado@estudiante.edu'),
  'EST2023-456',
  FALSE,
  3,
  2
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM estudiantes WHERE matricula = 'EST2023-456'
);

-- Create a table for teachers if it doesn't exist
CREATE TABLE IF NOT EXISTS profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE
);

-- Insert demo teachers if they don't exist
INSERT INTO profesores (id, nombre, email)
SELECT 1, 'Juan Pérez', 'juan.perez@institucion.edu'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM profesores WHERE id = 1
);

INSERT INTO profesores (id, nombre, email)
SELECT 2, 'María López', 'maria.lopez@institucion.edu'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM profesores WHERE id = 2
);

-- Create a table for subjects if it doesn't exist
CREATE TABLE IF NOT EXISTS asignaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  id_profesor INT,
  id_programa INT,
  FOREIGN KEY (id_profesor) REFERENCES profesores(id),
  FOREIGN KEY (id_programa) REFERENCES programas(id)
);

-- Insert demo subjects if they don't exist
INSERT INTO asignaturas (id, nombre, id_profesor, id_programa)
SELECT 1, 'Programación I', 1, 1
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM asignaturas WHERE id = 1
);

INSERT INTO asignaturas (id, nombre, id_profesor, id_programa)
SELECT 2, 'Bases de Datos', 1, 1
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM asignaturas WHERE id = 2
);

INSERT INTO asignaturas (id, nombre, id_profesor, id_programa)
SELECT 3, 'Algoritmos', 2, 1
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM asignaturas WHERE id = 3
);

-- Create a table for student-subject relationships if it doesn't exist
CREATE TABLE IF NOT EXISTS estudiante_asignatura (
  id_estudiante INT,
  id_asignatura INT,
  PRIMARY KEY (id_estudiante, id_asignatura),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id),
  FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id)
);

-- Link enrolled student to subjects
INSERT INTO estudiante_asignatura (id_estudiante, id_asignatura)
SELECT 
  (SELECT id FROM estudiantes WHERE matricula = 'EST2023-789'),
  1
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM estudiante_asignatura 
  WHERE id_estudiante = (SELECT id FROM estudiantes WHERE matricula = 'EST2023-789')
  AND id_asignatura = 1
);

INSERT INTO estudiante_asignatura (id_estudiante, id_asignatura)
SELECT 
  (SELECT id FROM estudiantes WHERE matricula = 'EST2023-789'),
  2
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM estudiante_asignatura 
  WHERE id_estudiante = (SELECT id FROM estudiantes WHERE matricula = 'EST2023-789')
  AND id_asignatura = 2
);

INSERT INTO estudiante_asignatura (id_estudiante, id_asignatura)
SELECT 
  (SELECT id FROM estudiantes WHERE matricula = 'EST2023-789'),
  3
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM estudiante_asignatura 
  WHERE id_estudiante = (SELECT id FROM estudiantes WHERE matricula = 'EST2023-789')
  AND id_asignatura = 3
);

-- Create a table for evaluation aspects if it doesn't exist
CREATE TABLE IF NOT EXISTS aspectos_evaluacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Insert demo evaluation aspects if they don't exist
INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 1, 'Dominio del tema', 'Conocimiento y dominio del contenido de la asignatura'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 1
);

INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 2, 'Cumplimiento', 'Cumplimiento del programa y asistencia a clases'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 2
);

INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 3, 'Calidad', 'Calidad de la enseñanza y claridad en las explicaciones'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 3
);

INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 4, 'Puntualidad', 'Puntualidad en el inicio y finalización de las clases'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 4
);

INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 5, 'Metodología', 'Metodología y métodos en enseñanza'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 5
);

INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 6, 'Recursos', 'Recursos usados para la enseñanza'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 6
);

INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 7, 'Evaluación', 'Proceso de evaluación'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 7
);

INSERT INTO aspectos_evaluacion (id, nombre, descripcion)
SELECT 8, 'Motivación', 'Aspectos motivacionales'
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM aspectos_evaluacion WHERE id = 8
);
