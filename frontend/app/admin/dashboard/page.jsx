"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PROGRAMAS, PROFESORES, ASPECTOS_NOMBRES } from "@/lib/data"

// Función para obtener el color según el valor (0-1)
const getColorForValue = (value) => {
  if (value >= 0.9) return "bg-green-500"
  if (value >= 0.8) return "bg-green-400"
  if (value >= 0.7) return "bg-yellow-400"
  if (value >= 0.6) return "bg-yellow-500"
  if (value >= 0.5) return "bg-orange-500"
  return "bg-red-500"
}

// Componente de barra de progreso
const ProgressBar = ({
  value,
  label
}) => {
  const percentage = Math.round(value * 100)
  const colorClass = getColorForValue(value)

  return (
    <div className="space-y-1 w-full">
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

// Componente de tarjeta de profesor
const ProfesorCard = ({
  profesor
}) => {
  const programaNombre = PROGRAMAS.find((p) => p.id === profesor.programa)?.nombre || "No asignado"

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle>{profesor.nombre}</CardTitle>
        <CardDescription>
          {programaNombre} • {profesor.materias.join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <ProgressBar value={profesor.promedioGeneral} label="Promedio General" />
        </div>
        <div className="text-sm text-muted-foreground">Basado en {profesor.totalEvaluaciones} evaluaciones</div>
      </CardContent>
    </Card>
  );
}

// Componente de detalle de profesor
const ProfesorDetalle = ({
  profesor
}) => {
  const programaNombre = PROGRAMAS.find((p) => p.id === profesor.programa)?.nombre || "No asignado"

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{profesor.nombre}</h2>
          <p className="text-muted-foreground">{programaNombre}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {profesor.materias.map((materia) => (
              <span
                key={materia}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {materia}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">{Math.round(profesor.promedioGeneral * 100)}%</div>
          <div className="text-sm text-muted-foreground">Promedio General</div>
          <div className="text-xs mt-1">({profesor.totalEvaluaciones} evaluaciones)</div>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Evaluación por Aspectos</CardTitle>
          <CardDescription>Desglose de calificaciones por cada aspecto evaluado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profesor.evaluaciones.map((evaluacion) => (
              <div key={evaluacion.aspecto} className="space-y-1">
                <ProgressBar
                  value={evaluacion.promedio}
                  label={ASPECTOS_NOMBRES[evaluacion.aspecto] || evaluacion.aspecto} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Comentarios Destacados</CardTitle>
          <CardDescription>Comentarios cualitativos de los estudiantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-100 rounded-md">
              <p className="text-sm text-green-800">
                "Excelente dominio del tema. Sus explicaciones son claras y siempre está dispuesto a resolver dudas."
              </p>
              <div className="mt-2 text-xs text-green-600">Programación I • Semestre 2025-1</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm text-blue-800">
                "Muy buen profesor, sus métodos de enseñanza son efectivos y las evaluaciones son justas."
              </p>
              <div className="mt-2 text-xs text-blue-600">Bases de Datos • Semestre 2025-1</div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
              <p className="text-sm text-yellow-800">
                "Buen profesor, aunque a veces las clases podrían ser más dinámicas. El material de apoyo es muy útil."
              </p>
              <div className="mt-2 text-xs text-yellow-600">Programación I • Semestre 2024-2</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("profesores")
  const [programaFiltro, setProgramaFiltro] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null)

  const filtrarProfesores = () => {
    let profesoresFiltrados = [...PROFESORES]

    if (programaFiltro) {
      profesoresFiltrados = profesoresFiltrados.filter((p) => p.programa === programaFiltro)
    }

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase()
      profesoresFiltrados = profesoresFiltrados.filter((p) =>
        p.nombre.toLowerCase().includes(busquedaLower) ||
        p.materias.some((m) => m.toLowerCase().includes(busquedaLower)))
    }

    return profesoresFiltrados
  }

  const profesoresFiltrados = filtrarProfesores()
  const mejorProfesor = [...PROFESORES].sort((a, b) => b.promedioGeneral - a.promedioGeneral)[0]
  const peorProfesor = [...PROFESORES].sort((a, b) => a.promedioGeneral - b.promedioGeneral)[0]
  const promedioGeneral = PROFESORES.reduce((sum, p) => sum + p.promedioGeneral, 0) / PROFESORES.length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Evaluaciones Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{PROFESORES.reduce((sum, p) => sum + p.totalEvaluaciones, 0)}</div>
            <p className="text-muted-foreground">Evaluaciones realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Promedio General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(promedioGeneral * 100)}%</div>
            <ProgressBar value={promedioGeneral} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profesores Evaluados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{PROFESORES.length}</div>
            <p className="text-muted-foreground">Docentes con evaluaciones</p>
          </CardContent>
        </Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profesores">Profesores</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="profesores" className="mt-4">
          <div>
            {profesorSeleccionado ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setProfesorSeleccionado(null)}
                  className="mb-4">
                  ← Volver a la lista
                </Button>
                <ProfesorDetalle profesor={profesorSeleccionado} />
              </>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                      <SelectItem value="all">Todos los programas</SelectItem>
                      {PROGRAMAS.map((prog) => (
                        <SelectItem key={prog.id} value={prog.id}>
                          {prog.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profesoresFiltrados.map((profesor) => (
                    <div
                      key={profesor.id}
                      onClick={() => setProfesorSeleccionado(profesor)}
                      className="cursor-pointer">
                      <ProfesorCard profesor={profesor} />
                    </div>
                  ))}

                  {profesoresFiltrados.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No se encontraron profesores con los filtros aplicados
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="estadisticas" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mejor Desempeño</CardTitle>
                <CardDescription>Profesor con la mejor evaluación promedio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 text-xl font-bold">
                      {Math.round(mejorProfesor.promedioGeneral * 100)}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{mejorProfesor.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      {PROGRAMAS.find((p) => p.id === mejorProfesor.programa)?.nombre}
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={() => {
                          setProfesorSeleccionado(mejorProfesor)
                          setActiveTab("profesores")
                        }}>
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menor Desempeño</CardTitle>
                <CardDescription>Profesor con la evaluación promedio más baja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-700 text-xl font-bold">
                      {Math.round(peorProfesor.promedioGeneral * 100)}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{peorProfesor.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      {PROGRAMAS.find((p) => p.id === peorProfesor.programa)?.nombre}
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={() => {
                          setProfesorSeleccionado(peorProfesor)
                          setActiveTab("profesores")
                        }}>
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Aspectos Mejor Evaluados</CardTitle>
                <CardDescription>Promedio general por cada aspecto evaluado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(ASPECTOS_NOMBRES).map(([key, label]) => {
                    // Calcular promedio para este aspecto entre todos los profesores
                    const promedioAspecto =
                      PROFESORES.reduce((sum, prof) => {
                        const aspecto = prof.evaluaciones.find((e) => e.aspecto === key)
                        return sum + (aspecto ? aspecto.promedio : 0)
                      }, 0) / PROFESORES.length

                    return <ProgressBar key={key} value={promedioAspecto} label={label} />;
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Evaluaciones por Programa</CardTitle>
                <CardDescription>Promedio de evaluaciones por programa académico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PROGRAMAS.map((programa) => {
                    const profesoresPrograma = PROFESORES.filter((p) => p.programa === programa.id)
                    const promedioPrograma =
                      profesoresPrograma.length > 0
                        ? profesoresPrograma.reduce((sum, p) => sum + p.promedioGeneral, 0) / profesoresPrograma.length
                        : 0

                    return <ProgressBar key={programa.id} value={promedioPrograma} label={programa.nombre} />;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

