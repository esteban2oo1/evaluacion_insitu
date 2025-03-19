"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BarChart3, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { PROGRAMAS, PROFESORES, ASPECTOS_NOMBRES } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Datos simulados de comentarios por aspecto
const COMENTARIOS_ASPECTOS = {
  "1": {
    // ID del profesor
    dominio: [
      { id: "1", texto: "Excelente dominio del tema. Sus explicaciones son claras y precisas.", calificacion: 0.95 },
      {
        id: "2",
        texto: "Conoce muy bien la materia y resuelve todas las dudas con ejemplos prácticos.",
        calificacion: 0.9,
      },
    ],
    cumplimiento: [
      {
        id: "3",
        texto: "Siempre cumple con el programa establecido y entrega calificaciones a tiempo.",
        calificacion: 0.85,
      },
      { id: "4", texto: "Buen cumplimiento del programa, aunque a veces se atrasa un poco.", calificacion: 0.8 },
    ],
    calidad: [
      {
        id: "5",
        texto: "Las clases son de muy buena calidad, con contenido actualizado y relevante.",
        calificacion: 0.88,
      },
      { id: "6", texto: "El material de estudio es excelente y muy bien organizado.", calificacion: 0.9 },
    ],
    puntualidad: [
      { id: "7", texto: "Siempre llega a tiempo y respeta los horarios de clase.", calificacion: 0.95 },
      { id: "8", texto: "Muy puntual, nunca ha llegado tarde a una clase.", calificacion: 0.98 },
    ],
    metodologia: [
      {
        id: "9",
        texto: "Su metodología es buena, aunque podría incluir más actividades prácticas.",
        calificacion: 0.82,
      },
      { id: "10", texto: "Explica bien, pero a veces va muy rápido con los temas complejos.", calificacion: 0.78 },
    ],
    recursos: [
      { id: "11", texto: "Los recursos que utiliza son buenos, pero podrían ser más variados.", calificacion: 0.78 },
      {
        id: "12",
        texto: "Utiliza buenas presentaciones, aunque el material complementario es escaso.",
        calificacion: 0.75,
      },
    ],
    evaluacion: [
      { id: "13", texto: "Las evaluaciones son justas y acordes con lo visto en clase.", calificacion: 0.86 },
      {
        id: "14",
        texto: "Los exámenes están bien diseñados y evalúan correctamente el conocimiento.",
        calificacion: 0.88,
      },
    ],
    motivacion: [
      {
        id: "15",
        texto: "Motiva mucho a los estudiantes y genera un buen ambiente de aprendizaje.",
        calificacion: 0.92,
      },
      { id: "16", texto: "Sus clases son motivadoras y despierta interés por la materia.", calificacion: 0.9 },
    ],
    relaciones: [
      { id: "17", texto: "Excelente trato con los estudiantes, siempre respetuoso y accesible.", calificacion: 0.94 },
      { id: "18", texto: "Mantiene muy buenas relaciones con todos los estudiantes.", calificacion: 0.92 },
    ],
  },
  "2": {
    dominio: [
      { id: "19", texto: "Domina perfectamente la materia y explica con mucha claridad.", calificacion: 0.95 },
      {
        id: "20",
        texto: "Conocimiento excepcional del tema, responde todas las dudas con precisión.",
        calificacion: 0.97,
      },
    ],
    cumplimiento: [
      { id: "21", texto: "Cumple con todo lo establecido en el programa y es muy organizada.", calificacion: 0.92 },
      { id: "22", texto: "Siempre entrega las calificaciones a tiempo y cumple con el cronograma.", calificacion: 0.9 },
    ],
    // Otros aspectos para el profesor 2...
  },
  // Otros profesores...
}

// Componente de barra de progreso
const ProgressBar = ({
  value,
  label,
  onClick
}) => {
  const percentage = Math.round(value * 100)

  // Función para obtener el color según el valor (0-1)
  const getColorForValue = (value) => {
    if (value >= 0.9) return "bg-green-500"
    if (value >= 0.8) return "bg-green-400"
    if (value >= 0.7) return "bg-yellow-400"
    if (value >= 0.6) return "bg-yellow-500"
    if (value >= 0.5) return "bg-orange-500"
    return "bg-red-500"
  }

  const colorClass = getColorForValue(value)

  return (
    <div
      className={`space-y-1 w-full ${onClick ? "cursor-pointer hover:opacity-90" : ""}`}
      onClick={onClick}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

// Componente para mostrar comentarios de un aspecto
const ComentariosAspecto = ({
  isOpen,
  onClose,
  aspecto,
  comentarios
}) => {
  // Función para obtener el color según la calificación
  const getColorForCalificacion = (calificacion) => {
    if (calificacion >= 0.9) return "bg-green-50 border-green-100 text-green-800"
    if (calificacion >= 0.8) return "bg-blue-50 border-blue-100 text-blue-800"
    if (calificacion >= 0.7) return "bg-yellow-50 border-yellow-100 text-yellow-800"
    if (calificacion >= 0.6) return "bg-orange-50 border-orange-100 text-orange-800"
    return "bg-red-50 border-red-100 text-red-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentarios sobre {ASPECTOS_NOMBRES[aspecto] || aspecto}
          </DialogTitle>
          <DialogDescription>Comentarios de los estudiantes que justifican la calificación</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {comentarios && comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <div
                key={comentario.id}
                className={`p-3 border rounded-md ${getColorForCalificacion(comentario.calificacion)}`}>
                <p className="text-sm">"{comentario.texto}"</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay comentarios disponibles para este aspecto
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componente de tarjeta de profesor
const ProfesorCard = ({
  profesor
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedAspecto, setSelectedAspecto] = useState(null)

  // Obtener comentarios para el aspecto seleccionado
  const getComentariosAspecto = (profesorId, aspecto) => {
    return (COMENTARIOS_ASPECTOS[profesorId]?.[
      aspecto
    ] || []);
  }

  const handleAspectoClick = (aspecto) => {
    setSelectedAspecto(aspecto)
  }

  return (
    <Card key={profesor.id} className="overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">{profesor.nombre}</CardTitle>
                <CardDescription>{profesor.materias.join(", ")}</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold">{Math.round(profesor.promedioGeneral * 100)}%</div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="mb-4">
              <ProgressBar value={profesor.promedioGeneral} label="Promedio General" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {profesor.evaluaciones.map((evaluacion) => (
                <div key={evaluacion.aspecto} className="space-y-1">
                  <ProgressBar
                    value={evaluacion.promedio}
                    label={ASPECTOS_NOMBRES[evaluacion.aspecto] || evaluacion.aspecto}
                    onClick={() => handleAspectoClick(evaluacion.aspecto)} />
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/comentarios?profesor=${profesor.id}`}>Ver todos los comentarios</Link>
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
      {/* Diálogo para mostrar comentarios del aspecto */}
      {selectedAspecto && (
        <ComentariosAspecto
          isOpen={!!selectedAspecto}
          onClose={() => setSelectedAspecto(null)}
          aspecto={selectedAspecto}
          comentarios={getComentariosAspecto(profesor.id, selectedAspecto)} />
      )}
    </Card>
  );
}

// Datos simulados de profesores por semestre
const getProfesoresPorSemestre = (programaId, semestreId) => {
  // En un caso real, esto vendría de una base de datos
  // Aquí simulamos que algunos profesores dan clases en ciertos semestres
  return PROFESORES.filter((profesor) => {
    return profesor.programa === programaId && Number.parseInt(profesor.id) % 10 === Number.parseInt(semestreId) % 5; // Lógica simulada
  });
}

export default function SemestrePage() {
  const params = useParams()
  const router = useRouter()
  const [programa, setPrograma] = useState(null)
  const [semestre, setSemestre] = useState("")
  const [profesores, setProfesores] = useState([])

  // Modificar el useEffect para evitar problemas con el manejo de estados
  useEffect(() => {
    const fetchData = () => {
      const programaEncontrado = PROGRAMAS.find((p) => p.id === params.programaId)
      if (!programaEncontrado) {
        router.push("/admin/reportes")
        return
      }
      setPrograma(programaEncontrado)
      setSemestre(params.semestreId)

      // Obtener profesores para este programa y semestre
      const profesoresFiltrados = getProfesoresPorSemestre(params.programaId, params.semestreId)
      setProfesores(profesoresFiltrados)
    }

    fetchData()
  }, [params.programaId, params.semestreId, router])

  if (!programa) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  // Calcular promedio general de todos los profesores del semestre
  const promedioGeneral =
    profesores.length > 0 ? profesores.reduce((sum, p) => sum + p.promedioGeneral, 0) / profesores.length : 0

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/reportes/${programa.id}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a {programa.nombre}
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-2">
        {programa.nombre} - Semestre {semestre}
      </h1>
      <p className="text-muted-foreground mb-6">Consolidado de evaluaciones de docentes</p>
      {profesores.length > 0 ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumen del Semestre</CardTitle>
              <CardDescription>Promedio general de evaluaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 text-xl font-bold">{Math.round(promedioGeneral * 100)}%</span>
                </div>
                <div>
                  <h3 className="font-medium">Promedio General del Semestre</h3>
                  <p className="text-sm text-muted-foreground">Basado en {profesores.length} profesores</p>
                </div>
              </div>

              <ProgressBar value={promedioGeneral} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-medium mb-2">Aspectos Destacados</h4>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(ASPECTOS_NOMBRES)
                      .slice(0, 3)
                      .map(([key, label]) => (
                        <li key={key} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          {label}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Aspectos a Mejorar</h4>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(ASPECTOS_NOMBRES)
                      .slice(5, 8)
                      .map(([key, label]) => (
                        <li key={key} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                          {label}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Docentes del Semestre</h2>

          <div className="space-y-4">
            {profesores.map((profesor) => (
              <ProfesorCard key={profesor.id} profesor={profesor} />
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
            <p className="text-muted-foreground">No se encontraron evaluaciones de docentes para este semestre.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

