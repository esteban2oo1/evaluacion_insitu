// Tipos para el sistema de evaluación

export interface User {
  id: string
  name: string
  role: "estudiante" | "docente" | "admin"
  email: string
}

export interface Student extends User {
  matricula: string
  estado: "Matriculado" | "No Matriculado"
  semestre: string
  programa: string
}

export interface Teacher extends User {
  department: string
  courses: Course[]
}

export interface Course {
  id: number
  name: string
  semester: string
  program: string
  teacherId: string
}

export interface Enrollment {
  studentId: string
  courseId: number
  evaluated: boolean
}

export interface EvaluationAspect {
  id: number
  name: string
  active: boolean
}

export interface Evaluation {
  id: string
  studentId: string
  teacherId: string
  courseId: number
  date: Date
  aspects: EvaluationResult[]
}

export interface EvaluationResult {
  aspectId: number
  rating: "E" | "B" | "A" | "D"
  comment?: string
}

