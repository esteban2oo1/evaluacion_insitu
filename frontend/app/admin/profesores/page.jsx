"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight, ChevronDown, MessageSquare } from "lucide-react"
import { PROGRAMAS, PROFESORES, ASPECTOS_NOMBRES } from "@/lib/data"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Datos simulados de semestres
const SEMESTRES = [
  { id: "2025-1", nombre: "2025-1" },
  { id: "2024-2", nombre: "2024-2" },
  { id: "2024-1", nombre: "2024-1" },
  { id: "2023-2", nombre: "2023-2" },
]

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
    // Otros aspectos...
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

export default function ProfesoresPage() {
  const [programaFiltro, setProgramaFiltro] = useState("")
  const [semestreFiltro, setSemestreFiltro] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [selectedAspecto, setSelectedAspecto] = useState(null)

  const filtrarProfesores = () => {
    let profesoresFiltrados = [...PROFESORES]

    if (programaFiltro && programaFiltro !== "todos") {
      profesoresFiltrados = profesoresFiltrados.filter((p) => p.programa === programaFiltro)
    }

    // Aquí iría el filtro por semestre en un caso real
    // En este ejemplo simulado, simplemente mantenemos todos los profesores
    // ya que no tenemos datos de semestre en nuestro modelo de datos

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase()
      profesoresFiltrados = profesoresFiltrados.filter((p) =>
        p.nombre.toLowerCase().includes(busquedaLower) ||
        p.materias.some((m) => m.toLowerCase().includes(busquedaLower)))
    }

    return profesoresFiltrados
  }

  const profesoresFiltrados = filtrarProfesores()

  // Obtener comentarios para el aspecto seleccionado
  const getComentariosAspecto = (profesorId, aspecto) => {
    return (COMENTARIOS_ASPECTOS[profesorId]?.[
      aspecto
    ] || []);
  }

  const handleAspectoClick = (profesorId, aspecto) => {
    setSelectedAspecto({ profesorId, aspecto })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profesores</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar profesor o materia..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        <Select value={programaFiltro} onValueChange={setProgramaFiltro}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por programa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los programas</SelectItem>
            {PROGRAMAS.map((prog) => (
              <SelectItem key={prog.id} value={prog.id}>
                {prog.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={semestreFiltro} onValueChange={setSemestreFiltro}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Filtrar por semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los semestres</SelectItem>
            {SEMESTRES.map((sem) => (
              <SelectItem key={sem.id} value={sem.id}>
                {sem.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {profesoresFiltrados.map((profesor) => {
          const programaNombre = PROGRAMAS.find((p) => p.id === profesor.programa)?.nombre || "No asignado"

          return (
            <Card key={profesor.id} className="overflow-hidden">
              <Collapsible>
                <CollapsibleTrigger className="w-full text-left">
                  <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{profesor.nombre}</CardTitle>
                        <CardDescription>
                          {programaNombre} • {profesor.materias.join(", ")}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold">{Math.round(profesor.promedioGeneral * 100)}%</div>
                        <ChevronDown
                          className="h-5 w-5 text-muted-foreground data-[state=open]:rotate-180 transition-transform" />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="mb-4">
                      <ProgressBar value={profesor.promedioGeneral} label="Promedio General" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {profesor.evaluaciones.map((evaluacion) => (
                        <div key={evaluacion.aspecto} className="space-y-1">
                          <ProgressBar
                            value={evaluacion.promedio}
                            label={
                              ASPECTOS_NOMBRES[evaluacion.aspecto] ||
                              evaluacion.aspecto
                            }
                            onClick={() => handleAspectoClick(profesor.id, evaluacion.aspecto)} />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Basado en {profesor.totalEvaluaciones} evaluaciones
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/comentarios?profesor=${profesor.id}`}>
                          Ver todos los comentarios
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
              {/* Diálogo para mostrar comentarios del aspecto */}
              {selectedAspecto && selectedAspecto.profesorId === profesor.id && (
                <ComentariosAspecto
                  isOpen={!!selectedAspecto}
                  onClose={() => setSelectedAspecto(null)}
                  aspecto={selectedAspecto.aspecto}
                  comentarios={getComentariosAspecto(profesor.id, selectedAspecto.aspecto)} />
              )}
            </Card>
          );
        })}

        {profesoresFiltrados.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron profesores con los filtros aplicados
          </div>
        )}
      </div>
      {/* Mostrar comentarios del aspecto seleccionado */}
      {selectedAspecto && (
        <ComentariosAspecto
          isOpen={!!selectedAspecto}
          onClose={() => setSelectedAspecto(null)}
          aspecto={selectedAspecto.aspecto}
          comentarios={getComentariosAspecto(selectedAspecto.profesorId, selectedAspecto.aspecto)} />
      )}
    </div>
  );
}

