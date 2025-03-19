"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MessageSquare } from "lucide-react"
import { PROFESORES } from "@/lib/data"

// Datos simulados de semestres
const SEMESTRES = [
  { id: "2025-1", nombre: "2025-1" },
  { id: "2024-2", nombre: "2024-2" },
  { id: "2024-1", nombre: "2024-1" },
  { id: "2023-2", nombre: "2023-2" },
]

// Datos simulados de comentarios
const COMENTARIOS = [
  {
    id: "1",
    profesorId: "1",
    materiaId: "Programación I",
    estudiante: "Estudiante Anónimo",
    fecha: "2025-03-15",
    texto: "Excelente dominio del tema. Sus explicaciones son claras y siempre está dispuesto a resolver dudas.",
    calificacion: 0.9,
    semestre: "2025-1",
  },
  {
    id: "2",
    profesorId: "1",
    materiaId: "Bases de Datos",
    estudiante: "Estudiante Anónimo",
    fecha: "2025-03-10",
    texto: "Muy buen profesor, sus métodos de enseñanza son efectivos y las evaluaciones son justas.",
    calificacion: 0.85,
    semestre: "2025-1",
  },
  {
    id: "3",
    profesorId: "1",
    materiaId: "Programación I",
    estudiante: "Estudiante Anónimo",
    fecha: "2024-11-20",
    texto: "Buen profesor, aunque a veces las clases podrían ser más dinámicas. El material de apoyo es muy útil.",
    calificacion: 0.75,
    semestre: "2024-2",
  },
  {
    id: "4",
    profesorId: "2",
    materiaId: "Algoritmos",
    estudiante: "Estudiante Anónimo",
    fecha: "2025-03-18",
    texto:
      "Excelente profesora, explica con mucha claridad y paciencia. Sus ejemplos son muy útiles para entender los conceptos.",
    calificacion: 0.95,
    semestre: "2025-1",
  },
  {
    id: "5",
    profesorId: "2",
    materiaId: "Estructuras de Datos",
    estudiante: "Estudiante Anónimo",
    fecha: "2025-03-05",
    texto: "Muy buena profesora, sus clases son dinámicas y se nota que domina los temas. Las evaluaciones son justas.",
    calificacion: 0.9,
    semestre: "2025-1",
  },
  {
    id: "6",
    profesorId: "3",
    materiaId: "Administración Financiera",
    estudiante: "Estudiante Anónimo",
    fecha: "2025-03-12",
    texto:
      "El profesor necesita mejorar su metodología de enseñanza. A veces es difícil seguir el hilo de las explicaciones.",
    calificacion: 0.6,
    semestre: "2025-1",
  },
  {
    id: "7",
    profesorId: "3",
    materiaId: "Contabilidad",
    estudiante: "Estudiante Anónimo",
    fecha: "2024-10-28",
    texto:
      "Las clases son un poco monótonas y el material de apoyo es insuficiente. Debería actualizar los contenidos.",
    calificacion: 0.55,
    semestre: "2024-2",
  },
  {
    id: "8",
    profesorId: "4",
    materiaId: "Marketing",
    estudiante: "Estudiante Anónimo",
    fecha: "2024-05-20",
    texto:
      "Buena profesora, sus clases son interesantes y los trabajos prácticos son útiles para aplicar los conocimientos.",
    calificacion: 0.8,
    semestre: "2024-1",
  },
  {
    id: "9",
    profesorId: "5",
    materiaId: "Psicología Clínica",
    estudiante: "Estudiante Anónimo",
    fecha: "2023-11-15",
    texto:
      "Excelente profesor, muy comprometido con la enseñanza. Sus explicaciones son claras y los casos prácticos muy útiles.",
    calificacion: 0.9,
    semestre: "2023-2",
  },
  {
    id: "10",
    profesorId: "5",
    materiaId: "Neuropsicología",
    estudiante: "Estudiante Anónimo",
    fecha: "2024-03-08",
    texto: "Buen profesor, aunque a veces los temas son muy complejos y sería útil más material de apoyo.",
    calificacion: 0.75,
    semestre: "2024-1",
  },
]

// Función para obtener el color según la calificación
const getColorForCalificacion = (calificacion) => {
  if (calificacion >= 0.9) return "bg-green-50 border-green-100 text-green-800"
  if (calificacion >= 0.8) return "bg-blue-50 border-blue-100 text-blue-800"
  if (calificacion >= 0.7) return "bg-yellow-50 border-yellow-100 text-yellow-800"
  if (calificacion >= 0.6) return "bg-orange-50 border-orange-100 text-orange-800"
  return "bg-red-50 border-red-100 text-red-800"
}

export default function ComentariosPage() {
  const searchParams = useSearchParams()
  const [profesorFiltro, setProfesorFiltro] = useState(searchParams.get("profesor") || "")
  const [materiaFiltro, setMateriaFiltro] = useState("")
  const [semestreFiltro, setSemestreFiltro] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [comentariosFiltrados, setComentariosFiltrados] = useState(COMENTARIOS)
  const [materiasDisponibles, setMateriasDisponibles] = useState([])

  useEffect(() => {
    let filtrados = [...COMENTARIOS]

    if (profesorFiltro && profesorFiltro !== "todos") {
      filtrados = filtrados.filter((c) => c.profesorId === profesorFiltro)

      // Obtener materias del profesor seleccionado
      const profesor = PROFESORES.find((p) => p.id === profesorFiltro)
      if (profesor) {
        setMateriasDisponibles(profesor.materias)
      } else {
        setMateriasDisponibles([])
      }
    } else {
      setMateriasDisponibles([])
    }

    if (materiaFiltro && materiaFiltro !== "todas") {
      filtrados = filtrados.filter((c) => c.materiaId === materiaFiltro)
    }

    // Filtro por semestre
    if (semestreFiltro && semestreFiltro !== "todos") {
      filtrados = filtrados.filter((c) => c.semestre === semestreFiltro)
    }

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase()
      filtrados = filtrados.filter((c) => c.texto.toLowerCase().includes(busquedaLower))
    }

    setComentariosFiltrados(filtrados)
  }, [profesorFiltro, materiaFiltro, semestreFiltro, busqueda])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comentarios de Evaluaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en comentarios..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        <Select value={profesorFiltro} onValueChange={setProfesorFiltro}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por profesor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los profesores</SelectItem>
            {PROFESORES.map((profesor) => (
              <SelectItem key={profesor.id} value={profesor.id}>
                {profesor.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={materiaFiltro}
          onValueChange={setMateriaFiltro}
          disabled={!profesorFiltro || profesorFiltro === "todos" || materiasDisponibles.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por materia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las materias</SelectItem>
            {materiasDisponibles.map((materia) => (
              <SelectItem key={materia} value={materia}>
                {materia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={semestreFiltro} onValueChange={setSemestreFiltro}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los semestres</SelectItem>
            {SEMESTRES.map((semestre) => (
              <SelectItem key={semestre.id} value={semestre.id}>
                {semestre.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {comentariosFiltrados.length > 0 ? (
        <div className="space-y-4">
          {comentariosFiltrados.map((comentario) => {
            const profesor = PROFESORES.find((p) => p.id === comentario.profesorId)
            const colorClass = getColorForCalificacion(comentario.calificacion)

            return (
              <Card key={comentario.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{profesor?.nombre || "Profesor"}</CardTitle>
                      <CardDescription>
                        {comentario.materiaId} • Semestre {comentario.semestre}
                      </CardDescription>
                    </div>
                    <div className="text-sm font-medium">{new Date(comentario.fecha).toLocaleDateString()}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`p-3 border rounded-md ${colorClass}`}>
                    <p className="text-sm">"{comentario.texto}"</p>
                    <div className="mt-2 text-xs opacity-80">{comentario.estudiante}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay comentarios disponibles</h3>
            <p className="text-muted-foreground">No se encontraron comentarios con los filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

