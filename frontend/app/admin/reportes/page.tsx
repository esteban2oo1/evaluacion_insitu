"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, ChevronDown, ChevronRight, MessageSquare } from "lucide-react"

// Datos simulados para la demostración
const programsData = [
  {
    id: 1,
    name: "Ingeniería de Sistemas",
    semesters: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      teachers: [
        {
          id: 101,
          name: "Juan Pérez",
          department: "Ingeniería de Sistemas",
          score: 85,
          subject: "Programación I",
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
              name: "Metodología",
              score: 80,
              comments: [
                "Buenas técnicas de enseñanza",
                "Podría mejorar la dinámica de las clases",
                "A veces va muy rápido con los temas",
              ],
            },
            {
              id: 3,
              name: "Puntualidad",
              score: 95,
              comments: ["Siempre llega a tiempo", "Muy responsable con los horarios"],
            },
            {
              id: 4,
              name: "Evaluación",
              score: 75,
              comments: [
                "Los exámenes son muy difíciles",
                "Las evaluaciones corresponden con lo enseñado",
                "Debería dar más retroalimentación",
              ],
            },
          ],
        },
        {
          id: 102,
          name: "María López",
          department: "Ingeniería de Sistemas",
          score: 91,
          subject: "Algoritmos",
          aspects: [
            {
              id: 1,
              name: "Dominio del tema",
              score: 95,
              comments: ["Domina perfectamente la materia", "Conocimiento excepcional del tema"],
            },
            {
              id: 2,
              name: "Metodología",
              score: 88,
              comments: ["Excelente metodología", "Clases muy dinámicas y participativas"],
            },
            {
              id: 3,
              name: "Puntualidad",
              score: 90,
              comments: ["Muy puntual", "Respeta los horarios establecidos"],
            },
            {
              id: 4,
              name: "Evaluación",
              score: 92,
              comments: ["Evaluaciones justas", "Buena retroalimentación después de cada evaluación"],
            },
          ],
        },
        {
          id: 103,
          name: "Carlos Rodríguez",
          department: "Ingeniería de Sistemas",
          score: 74,
          subject: "Bases de Datos",
          aspects: [
            {
              id: 1,
              name: "Dominio del tema",
              score: 80,
              comments: ["Conoce la materia", "A veces duda en algunos temas específicos"],
            },
            {
              id: 2,
              name: "Metodología",
              score: 68,
              comments: ["Debe mejorar su metodología", "Las clases son monótonas", "No fomenta la participación"],
            },
            {
              id: 3,
              name: "Puntualidad",
              score: 75,
              comments: ["A veces llega tarde", "Ha cancelado clases sin previo aviso"],
            },
            {
              id: 4,
              name: "Evaluación",
              score: 72,
              comments: [
                "Evaluaciones muy teóricas",
                "Poca retroalimentación",
                "Los criterios de evaluación no son claros",
              ],
            },
          ],
        },
      ],
    })),
  },
  {
    id: 2,
    name: "Administración de Empresas",
    semesters: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      teachers: [
        {
          id: 201,
          name: "Ana Gómez",
          department: "Administración de Empresas",
          score: 88,
          subject: "Administración I",
          aspects: [
            {
              id: 1,
              name: "Dominio del tema",
              score: 90,
              comments: ["Excelente conocimiento", "Amplia experiencia en el campo"],
            },
            {
              id: 2,
              name: "Metodología",
              score: 85,
              comments: ["Buena metodología", "Clases interesantes"],
            },
          ],
        },
      ],
    })),
  },
  {
    id: 3,
    name: "Contaduría Pública",
    semesters: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      teachers: [
        {
          id: 301,
          name: "Pedro Martínez",
          department: "Contaduría Pública",
          score: 82,
          subject: "Contabilidad I",
          aspects: [
            {
              id: 1,
              name: "Dominio del tema",
              score: 85,
              comments: ["Buen conocimiento de la materia", "Explica bien los conceptos básicos"],
            },
            {
              id: 2,
              name: "Metodología",
              score: 80,
              comments: ["Metodología adecuada", "Podría incluir más ejercicios prácticos"],
            },
          ],
        },
      ],
    })),
  },
]

export default function ReportesPage() {
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null)
  const [expandedTeachers, setExpandedTeachers] = useState<number[]>([])
  const [selectedAspect, setSelectedAspect] = useState<{ teacherId: number; aspectId: number } | null>(null)

  // Función para manejar la expansión/contracción de profesores
  const toggleTeacher = (teacherId: number) => {
    setExpandedTeachers((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId],
    )
    // Cerrar el aspecto seleccionado si se contrae el profesor
    if (selectedAspect?.teacherId === teacherId) {
      setSelectedAspect(null)
    }
  }

  // Función para manejar la selección de aspectos
  const toggleAspect = (teacherId: number, aspectId: number) => {
    if (selectedAspect?.teacherId === teacherId && selectedAspect?.aspectId === aspectId) {
      setSelectedAspect(null)
    } else {
      setSelectedAspect({ teacherId, aspectId })
    }
  }

  // Obtener el color según la puntuación
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Obtener el color de texto según la puntuación
  const getScoreTextColor = (score: number) => {
    if (score >= 90) return "text-green-700"
    if (score >= 80) return "text-blue-700"
    if (score >= 70) return "text-yellow-700"
    return "text-red-700"
  }

  // Obtener el color de fondo según la puntuación
  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 80) return "bg-blue-100"
    if (score >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <>
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Reportes</h1>
        <p className="text-sm text-gray-500">Análisis de evaluaciones por programa y semestre</p>
      </header>

      <main className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Programas Académicos</CardTitle>
            <CardDescription>Seleccione un programa para ver sus semestres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programsData.map((program) => (
                <div key={program.id} className="border rounded-lg overflow-hidden">
                  <div
                    className={`p-4 cursor-pointer flex justify-between items-center ${
                      selectedProgram === program.id ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedProgram((prev) => (prev === program.id ? null : program.id))}
                  >
                    <h3 className="font-medium">{program.name}</h3>
                    {selectedProgram === program.id ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>

                  {selectedProgram === program.id && (
                    <div className="p-4 bg-gray-50 border-t">
                      <h4 className="font-medium mb-3">Semestres</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {program.semesters.map((semester) => (
                          <Button
                            key={semester.id}
                            variant={selectedSemester === semester.id ? "default" : "outline"}
                            className="w-full"
                            onClick={() => setSelectedSemester((prev) => (prev === semester.id ? null : semester.id))}
                          >
                            {semester.number}
                          </Button>
                        ))}
                      </div>

                      {selectedSemester !== null && (
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">Docentes del Semestre {selectedSemester}</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Excel
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {program.semesters[selectedSemester - 1].teachers.map((teacher) => (
                              <div key={teacher.id} className="border rounded-lg overflow-hidden">
                                <div
                                  className={`p-4 cursor-pointer ${
                                    expandedTeachers.includes(teacher.id) ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                                  }`}
                                  onClick={() => toggleTeacher(teacher.id)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="flex items-center">
                                        {expandedTeachers.includes(teacher.id) ? (
                                          <ChevronDown className="h-5 w-5 mr-2" />
                                        ) : (
                                          <ChevronRight className="h-5 w-5 mr-2" />
                                        )}
                                        <h5 className="font-medium">{teacher.name}</h5>
                                      </div>
                                      <p className="text-sm text-gray-500 ml-7">{teacher.subject}</p>
                                    </div>
                                    <div className="flex items-center">
                                      <div
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(teacher.score)} ${getScoreTextColor(teacher.score)}`}
                                      >
                                        {teacher.score}%
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {expandedTeachers.includes(teacher.id) && (
                                  <div className="p-4 bg-gray-50 border-t">
                                    <h6 className="font-medium mb-3 text-sm">Aspectos Evaluados</h6>
                                    <div className="space-y-3">
                                      {teacher.aspects.map((aspect) => (
                                        <div key={aspect.id}>
                                          <div
                                            className={`cursor-pointer ${
                                              selectedAspect?.teacherId === teacher.id &&
                                              selectedAspect?.aspectId === aspect.id
                                                ? "bg-blue-50 p-2 rounded-lg border border-blue-200"
                                                : "hover:bg-gray-100 p-2 rounded-lg"
                                            }`}
                                            onClick={() => toggleAspect(teacher.id, aspect.id)}
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
                                              <span
                                                className={`text-sm font-medium ${getScoreTextColor(aspect.score)}`}
                                              >
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
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

