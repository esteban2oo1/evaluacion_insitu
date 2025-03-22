"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, ChevronDown, ChevronRight, MessageSquare, Check, X, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFormContext } from "@/lib/form-context"

// Datos simulados
const programsData = [
  { id: 1, name: "Ingeniería de Sistemas" },
  { id: 2, name: "Administración de Empresas" },
  { id: 3, name: "Contaduría Pública" },
  { id: 4, name: "Ingeniería Civil" },
  { id: 5, name: "Psicología" },
]

const semestersData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
}))

const teachersData = [
  {
    id: 1,
    name: "Juan Pérez",
    department: "Ingeniería de Sistemas",
    program: "Ingeniería de Sistemas",
    semester: 4,
    score: 85,
    evaluations: 18,
    totalStudents: 25,
    hasAccess: true,
    courses: [
      {
        id: 101,
        name: "Programación I",
        evaluatedStudents: 10,
        totalStudents: 15,
        semester: 4,
      },
      {
        id: 102,
        name: "Bases de Datos",
        evaluatedStudents: 8,
        totalStudents: 10,
        semester: 4,
      },
    ],
    aspects: [
      {
        id: 1,
        name: "Dominio del tema",
        score: 90,
        comments: [
          "Excelente conocimiento de la materia",
          "Explica con claridad temas complejos",
          "Muy preparado en todos los temas",
        ],
      },
      {
        id: 2,
        name: "Cumplimiento",
        score: 80,
        comments: [
          "Buenas técnicas de enseñanza",
          "Podría mejorar la dinámica de las clases",
          "A veces va muy rápido con los temas",
        ],
      },
      {
        id: 3,
        name: "Calidad",
        score: 95,
        comments: ["Siempre llega a tiempo", "Muy responsable con los horarios"],
      },
      {
        id: 4,
        name: "Puntualidad",
        score: 75,
        comments: [
          "Los exámenes son muy difíciles",
          "Las evaluaciones corresponden con lo enseñado",
          "Debería dar más retroalimentación",
        ],
      },
      {
        id: 5,
        name: "Metodología y métodos en enseñanza",
        score: 88,
        comments: ["Buena metodología de enseñanza", "Explica con ejemplos prácticos"],
      },
      {
        id: 6,
        name: "Recursos usados para la enseñanza",
        score: 82,
        comments: ["Utiliza buenos recursos didácticos", "Podría actualizar algunas presentaciones"],
      },
      {
        id: 7,
        name: "Proceso de evaluación",
        score: 78,
        comments: ["Evaluaciones justas", "A veces las instrucciones no son claras"],
      },
      {
        id: 8,
        name: "Aspectos motivacionales",
        score: 85,
        comments: ["Motiva a los estudiantes", "Crea un buen ambiente de aprendizaje"],
      },
      {
        id: 9,
        name: "Relaciones interpersonales",
        score: 92,
        comments: ["Excelente trato con los estudiantes", "Siempre dispuesto a ayudar"],
      },
    ],
  },
  {
    id: 2,
    name: "María López",
    department: "Ingeniería de Sistemas",
    program: "Ingeniería de Sistemas",
    semester: 4,
    score: 91,
    evaluations: 22,
    totalStudents: 30,
    hasAccess: true,
    courses: [
      {
        id: 201,
        name: "Algoritmos",
        evaluatedStudents: 12,
        totalStudents: 15,
        semester: 4,
      },
      {
        id: 202,
        name: "Estructuras de Datos",
        evaluatedStudents: 10,
        totalStudents: 15,
        semester: 4,
      },
      {
        id: 203,
        name: "Programación Avanzada",
        evaluatedStudents: 8,
        totalStudents: 12,
        semester: 6,
      },
    ],
    aspects: [
      {
        id: 1,
        name: "Dominio del tema",
        score: 95,
        comments: ["Domina perfectamente la materia", "Conocimiento excepcional del tema"],
      },
      {
        id: 2,
        name: "Cumplimiento",
        score: 88,
        comments: ["Excelente metodología", "Clases muy dinámicas y participativas"],
      },
      {
        id: 3,
        name: "Calidad",
        score: 92,
        comments: ["Excelente calidad de enseñanza", "Material didáctico de primer nivel"],
      },
      {
        id: 4,
        name: "Puntualidad",
        score: 90,
        comments: ["Siempre puntual", "Respeta los horarios"],
      },
      {
        id: 5,
        name: "Metodología y métodos en enseñanza",
        score: 94,
        comments: ["Metodología innovadora", "Facilita el aprendizaje"],
      },
    ],
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    department: "Administración de Empresas",
    program: "Administración de Empresas",
    semester: 2,
    score: 74,
    evaluations: 15,
    totalStudents: 28,
    hasAccess: false,
    courses: [
      {
        id: 301,
        name: "Administración I",
        evaluatedStudents: 8,
        totalStudents: 15,
        semester: 2,
      },
      {
        id: 302,
        name: "Gestión de Proyectos",
        evaluatedStudents: 7,
        totalStudents: 13,
        semester: 2,
      },
    ],
    aspects: [
      {
        id: 1,
        name: "Dominio del tema",
        score: 80,
        comments: ["Conoce la materia", "A veces duda en algunos temas específicos"],
      },
      {
        id: 2,
        name: "Cumplimiento",
        score: 68,
        comments: ["Debe mejorar su metodología", "Las clases son monótonas", "No fomenta la participación"],
      },
      {
        id: 3,
        name: "Calidad",
        score: 72,
        comments: ["Calidad aceptable", "Podría mejorar el material"],
      },
      {
        id: 4,
        name: "Puntualidad",
        score: 65,
        comments: ["A veces llega tarde", "Ha cancelado clases sin previo aviso"],
      },
    ],
  },
  {
    id: 4,
    name: "Ana Gómez",
    department: "Contaduría Pública",
    program: "Contaduría Pública",
    semester: 3,
    score: 88,
    evaluations: 20,
    totalStudents: 25,
    hasAccess: true,
    courses: [
      {
        id: 401,
        name: "Contabilidad I",
        evaluatedStudents: 12,
        totalStudents: 15,
        semester: 3,
      },
      {
        id: 402,
        name: "Finanzas",
        evaluatedStudents: 8,
        totalStudents: 10,
        semester: 3,
      },
    ],
    aspects: [
      {
        id: 1,
        name: "Dominio del tema",
        score: 90,
        comments: ["Excelente conocimiento", "Amplia experiencia en el campo"],
      },
      {
        id: 2,
        name: "Cumplimiento",
        score: 85,
        comments: ["Buena metodología", "Clases interesantes"],
      },
      {
        id: 5,
        name: "Metodología y métodos en enseñanza",
        score: 88,
        comments: ["Buena metodología", "Explica con claridad"],
      },
      {
        id: 6,
        name: "Recursos usados para la enseñanza",
        score: 86,
        comments: ["Buenos recursos", "Material actualizado"],
      },
    ],
  },
  {
    id: 5,
    name: "Pedro Martínez",
    department: "Ingeniería Civil",
    program: "Ingeniería Civil",
    semester: 5,
    score: 82,
    evaluations: 17,
    totalStudents: 22,
    hasAccess: false,
    courses: [
      {
        id: 501,
        name: "Cálculo",
        evaluatedStudents: 10,
        totalStudents: 12,
        semester: 5,
      },
      {
        id: 502,
        name: "Física",
        evaluatedStudents: 7,
        totalStudents: 10,
        semester: 5,
      },
    ],
    aspects: [
      {
        id: 1,
        name: "Dominio del tema",
        score: 85,
        comments: ["Buen conocimiento de la materia", "Explica bien los conceptos básicos"],
      },
      {
        id: 2,
        name: "Cumplimiento",
        score: 80,
        comments: ["Metodología adecuada", "Podría incluir más ejercicios prácticos"],
      },
      {
        id: 7,
        name: "Proceso de evaluación",
        score: 78,
        comments: ["Evaluaciones justas", "Podría dar más retroalimentación"],
      },
      {
        id: 8,
        name: "Aspectos motivacionales",
        score: 82,
        comments: ["Motiva a los estudiantes", "Buen ambiente de clase"],
      },
    ],
  },
]

export default function ProfesoresPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState<string>("")
  const [selectedSemester, setSelectedSemester] = useState<string>("")
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)
  const [showEvaluations, setShowEvaluations] = useState<number | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<{ teacherId: number; aspectId: number } | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<{ teacherId: number; courseId: number } | null>(null)
  const [teachers, setTeachers] = useState(teachersData)

  // Usar el contexto para los aspectos
  const { activeAspectIds } = useFormContext()

  // Filtrar profesores cuando cambian los criterios de búsqueda
  const filteredTeachers = useMemo(() => {
    let result = teachers

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por programa
    if (selectedProgram) {
      result = result.filter((teacher) => teacher.program === selectedProgram)
    }

    // Filtrar por semestre
    if (selectedSemester) {
      result = result.filter((teacher) => teacher.semester === Number.parseInt(selectedSemester))
    }

    return result
  }, [teachers, searchTerm, selectedProgram, selectedSemester])

  // Función para manejar la selección de un profesor
  const handleSelectTeacher = useCallback((id: number) => {
    setSelectedTeacher((prevId) => (prevId === id ? null : id))
    // Cerrar evaluaciones si se contrae el profesor
    setShowEvaluations((prevId) => (prevId === id ? null : prevId))
    // Cerrar aspecto seleccionado
    setSelectedAspect(null)
    // Cerrar curso seleccionado
    setSelectedCourse(null)
  }, [])

  // Función para mostrar/ocultar evaluaciones
  const toggleEvaluations = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se propague al clic del profesor
    setShowEvaluations((prevId) => (prevId === id ? null : id))
    // Cerrar aspecto seleccionado
    setSelectedAspect(null)
  }, [])

  // Función para mostrar/ocultar comentarios de un aspecto
  const toggleAspect = useCallback((teacherId: number, aspectId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se propague
    setSelectedAspect((prev) =>
      prev?.teacherId === teacherId && prev?.aspectId === aspectId ? null : { teacherId, aspectId },
    )
  }, [])

  // Función para mostrar/ocultar detalles de un curso
  const toggleCourse = useCallback((teacherId: number, courseId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se propague
    setSelectedCourse((prev) =>
      prev?.teacherId === teacherId && prev?.courseId === courseId ? null : { teacherId, courseId },
    )
  }, [])

  // Función para cambiar el acceso de un profesor
  const toggleAccess = useCallback(
    (id: number, e: React.MouseEvent) => {
      e.stopPropagation() // Evitar que se propague al clic del profesor

      // Actualizar el estado de los profesores
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) => (teacher.id === id ? { ...teacher, hasAccess: !teacher.hasAccess } : teacher)),
      )

      // Mostrar notificación
      const teacher = teachers.find((t) => t.id === id)
      if (teacher) {
        toast({
          title: `Acceso ${!teacher.hasAccess ? "concedido" : "revocado"}`,
          description: `${teacher.name} ahora ${!teacher.hasAccess ? "tiene" : "no tiene"} acceso al rol de docente.`,
          variant: !teacher.hasAccess ? "default" : "destructive",
        })
      }
    },
    [teachers, toast],
  )

  // Funciones de utilidad memoizadas para evitar recálculos
  const getScoreColor = useCallback((score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }, [])

  const getScoreTextColor = useCallback((score: number) => {
    if (score >= 90) return "text-green-700"
    if (score >= 80) return "text-blue-700"
    if (score >= 70) return "text-yellow-700"
    return "text-red-700"
  }, [])

  const getScoreBgColor = useCallback((score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 80) return "bg-blue-100"
    if (score >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }, [])

  // Calcular el total de estudiantes para un profesor
  const calculateTotalStudents = useCallback((teacher: (typeof teachersData)[0]) => {
    return teacher.courses.reduce((total, course) => total + course.totalStudents, 0)
  }, [])

  // Calcular el total de estudiantes que han evaluado para un profesor
  const calculateTotalEvaluatedStudents = useCallback((teacher: (typeof teachersData)[0]) => {
    return teacher.courses.reduce((total, course) => total + course.evaluatedStudents, 0)
  }, [])

  // Filtrar los aspectos de un profesor para mostrar solo los activos
  const getFilteredAspects = useCallback(
    (teacher: (typeof teachersData)[0]) => {
      return teacher.aspects.filter((aspect) => activeAspectIds.includes(aspect.id))
    },
    [activeAspectIds],
  )

  return (
    <>
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Profesores</h1>
        <p className="text-sm text-gray-500">Gestión y evaluación de docentes</p>
      </header>

      <main className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lista de Profesores</CardTitle>
            <CardDescription>Evaluaciones y desempeño de los docentes</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar profesor..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/4">
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                >
                  <option value="">Todos los programas</option>
                  {programsData.map((program) => (
                    <option key={program.id} value={program.name}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/4">
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <option value="">Todos los semestres</option>
                  {semestersData.map((semester) => (
                    <option key={semester.id} value={semester.number.toString()}>
                      Semestre {semester.number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de profesores */}
            <div className="space-y-4">
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron profesores con los criterios de búsqueda.
                </div>
              ) : (
                filteredTeachers.map((teacher) => {
                  // Calcular valores una sola vez para evitar recálculos durante el renderizado
                  const totalStudents = calculateTotalStudents(teacher)
                  const totalEvaluatedStudents = calculateTotalEvaluatedStudents(teacher)
                  const evaluationPercentage =
                    totalStudents > 0 ? Math.round((totalEvaluatedStudents / totalStudents) * 100) : 0

                  // Filtrar aspectos activos para este profesor
                  const filteredAspects = getFilteredAspects(teacher)

                  return (
                    <div
                      key={teacher.id}
                      className={`border rounded-lg overflow-hidden transition-colors ${
                        selectedTeacher === teacher.id ? "border-blue-500" : "hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`p-4 cursor-pointer ${
                          selectedTeacher === teacher.id ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectTeacher(teacher.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {selectedTeacher === teacher.id ? (
                              <ChevronDown className="h-5 w-5 mr-2" />
                            ) : (
                              <ChevronRight className="h-5 w-5 mr-2" />
                            )}
                            <div>
                              <h3 className="font-medium">{teacher.name}</h3>
                              <p className="text-sm text-gray-500">{teacher.department}</p>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(teacher.score)} ${getScoreTextColor(teacher.score)}`}
                          >
                            {teacher.score}%
                          </div>
                        </div>
                      </div>

                      {selectedTeacher === teacher.id && (
                        <div className="bg-gray-50 border-t p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Programa</p>
                              <p>{teacher.program}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Semestre</p>
                              <p>{teacher.semester}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Evaluaciones Totales</p>
                              <p>
                                {totalEvaluatedStudents} de {totalStudents} estudiantes
                              </p>
                            </div>
                          </div>

                          {/* Asignaturas */}
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Asignaturas</h4>
                            <div className="space-y-2">
                              {teacher.courses.map((course) => {
                                const coursePercentage =
                                  course.totalStudents > 0
                                    ? Math.round((course.evaluatedStudents / course.totalStudents) * 100)
                                    : 0

                                return (
                                  <div
                                    key={course.id}
                                    className={`border rounded-lg overflow-hidden ${
                                      selectedCourse?.teacherId === teacher.id && selectedCourse?.courseId === course.id
                                        ? "border-blue-300 bg-blue-50"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    <div
                                      className="p-3 cursor-pointer flex justify-between items-center hover:bg-gray-100"
                                      onClick={(e) => toggleCourse(teacher.id, course.id, e)}
                                    >
                                      <div className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{course.name}</span>
                                        <span className="ml-2 text-xs text-gray-500">Semestre {course.semester}</span>
                                      </div>
                                      <div className="flex items-center">
                                        {selectedCourse?.teacherId === teacher.id &&
                                        selectedCourse?.courseId === course.id ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </div>
                                    </div>

                                    {selectedCourse?.teacherId === teacher.id &&
                                      selectedCourse?.courseId === course.id && (
                                        <div className="p-3 bg-blue-50 border-t border-blue-200">
                                          <div className="grid grid-cols-2 gap-4 mb-2">
                                            <div>
                                              <p className="text-xs text-gray-500">Estudiantes que han evaluado</p>
                                              <p className="font-medium">
                                                {course.evaluatedStudents} de {course.totalStudents}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-gray-500">Estudiantes pendientes</p>
                                              <p className="font-medium">
                                                {course.totalStudents - course.evaluatedStudents} de{" "}
                                                {course.totalStudents}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="mt-2">
                                            <div className="flex justify-between text-xs mb-1">
                                              <span>Progreso de evaluaciones</span>
                                              <span>{coursePercentage}%</span>
                                            </div>
                                            <Progress
                                              value={coursePercentage}
                                              className="h-1.5"
                                              indicatorClassName={getScoreColor(coursePercentage)}
                                            />
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progreso total de evaluaciones</span>
                              <span>{evaluationPercentage}%</span>
                            </div>
                            <Progress
                              value={evaluationPercentage}
                              className="h-2"
                              indicatorClassName={getScoreColor(evaluationPercentage)}
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`teacher-access-${teacher.id}`}
                                checked={teacher.hasAccess}
                                onCheckedChange={() => {}}
                                onClick={(e) => toggleAccess(teacher.id, e)}
                              />
                              <Label htmlFor={`teacher-access-${teacher.id}`} className="cursor-pointer">
                                {teacher.hasAccess ? (
                                  <span className="flex items-center text-green-600">
                                    <Check size={16} className="mr-1" /> Acceso concedido
                                  </span>
                                ) : (
                                  <span className="flex items-center text-red-600">
                                    <X size={16} className="mr-1" /> Sin acceso
                                  </span>
                                )}
                              </Label>
                            </div>

                            <Button
                              size="sm"
                              onClick={(e) => toggleEvaluations(teacher.id, e)}
                              variant={showEvaluations === teacher.id ? "default" : "outline"}
                            >
                              {showEvaluations === teacher.id ? "Ocultar Evaluaciones" : "Ver Evaluaciones"}
                            </Button>
                          </div>

                          {showEvaluations === teacher.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Aspectos Evaluados</h4>
                                <div className="text-sm text-gray-500">Total de estudiantes: {totalStudents}</div>
                              </div>
                              <div className="space-y-4">
                                {filteredAspects.length > 0 ? (
                                  filteredAspects.map((aspect) => (
                                    <div key={aspect.id}>
                                      <div
                                        className={`cursor-pointer p-2 rounded-lg ${
                                          selectedAspect?.teacherId === teacher.id &&
                                          selectedAspect?.aspectId === aspect.id
                                            ? "bg-blue-50 border border-blue-200"
                                            : "hover:bg-gray-100"
                                        }`}
                                        onClick={(e) => toggleAspect(teacher.id, aspect.id, e)}
                                      >
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center">
                                            {selectedAspect?.teacherId === teacher.id &&
                                            selectedAspect?.aspectId === aspect.id ? (
                                              <ChevronDown className="h-4 w-4 mr-2" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4 mr-2" />
                                            )}
                                            <span>{aspect.name}</span>
                                          </div>
                                          <span className={`text-sm font-medium ${getScoreTextColor(aspect.score)}`}>
                                            {aspect.score}%
                                          </span>
                                        </div>
                                        <div className="mt-1 pl-6">
                                          <Progress
                                            value={aspect.score}
                                            className="h-2"
                                            indicatorClassName={getScoreColor(aspect.score)}
                                          />
                                        </div>
                                      </div>

                                      {selectedAspect?.teacherId === teacher.id &&
                                        selectedAspect?.aspectId === aspect.id &&
                                        aspect.comments.length > 0 && (
                                          <div className="mt-2 ml-6 p-3 bg-white rounded-lg border">
                                            <div className="flex items-center mb-2">
                                              <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                                              <h6 className="text-sm font-medium">Comentarios</h6>
                                            </div>
                                            <ul className="space-y-2">
                                              {aspect.comments.map((comment, index) => (
                                                <li key={index} className="text-sm pl-2 border-l-2 border-gray-300">
                                                  {comment}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    No hay aspectos activos para mostrar.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

