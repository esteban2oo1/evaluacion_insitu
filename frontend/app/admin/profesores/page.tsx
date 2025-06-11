"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, ChevronDown, ChevronRight, MessageSquare, Check, X, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFormContext } from "@/lib/form-context"
import { profesoresService } from "@/lib/services/profesores"
import { AsignaturaDocente, AspectoPuntaje, ProfesoresParams } from "@/lib/types/profesores"
import Filtros from "@/app/admin/components/filters" // Ajustar la ruta según tu estructura

// Interfaz para el estado de filtros
interface FiltrosState {
  configuracionSeleccionada: number | null
  periodoSeleccionado: string
  sedeSeleccionada: string
  programaSeleccionado: string
  semestreSeleccionado: string
  grupoSeleccionado: string
}

export default function ProfesoresPage() {
  const { toast } = useToast()
  
  // Estados para filtros
  const [filtros, setFiltros] = useState<FiltrosState>({
    configuracionSeleccionada: null,
    periodoSeleccionado: "",
    sedeSeleccionada: "",
    programaSeleccionado: "",
    semestreSeleccionado: "",
    grupoSeleccionado: ""
  })
  
  // Estados existentes
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [showEvaluations, setShowEvaluations] = useState<string | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<{ teacherId: string; aspectId: string } | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<{ teacherId: string; courseId: number } | null>(null)
  const [asignaturas, setAsignaturas] = useState<AsignaturaDocente[]>([])
  const [loading, setLoading] = useState(true)
  const [aspectosEvaluados, setAspectosEvaluados] = useState<Record<string, AspectoPuntaje[]>>({})
  const [loadingAspectos, setLoadingAspectos] = useState<Record<string, boolean>>({})

  // Usar el contexto para los aspectos
  const { activeAspectIds } = useFormContext()

  // Función para convertir filtros a parámetros del endpoint
  const convertirFiltrosAParams = useCallback((filtros: FiltrosState): ProfesoresParams => {
    const params: ProfesoresParams = {}
    
    if (filtros.configuracionSeleccionada) {
      params.idConfiguracion = filtros.configuracionSeleccionada
    }
    if (filtros.periodoSeleccionado) {
      params.periodo = filtros.periodoSeleccionado
    }
    if (filtros.sedeSeleccionada) {
      params.nombreSede = filtros.sedeSeleccionada
    }
    if (filtros.programaSeleccionado) {
      params.nomPrograma = filtros.programaSeleccionado
    }
    if (filtros.semestreSeleccionado) {
      params.semestre = filtros.semestreSeleccionado
    }
    if (filtros.grupoSeleccionado) {
      params.grupo = filtros.grupoSeleccionado
    }
    
    return params
  }, [])

  // Función para cargar datos desde el endpoint
  const cargarDatos = useCallback(async (filtrosActuales: FiltrosState) => {
    setLoading(true)
    try {
      const params = convertirFiltrosAParams(filtrosActuales)
      const data = await profesoresService.getAsignaturas(params)
      setAsignaturas(data)
      
      // Limpiar estados relacionados cuando cambian los datos
      setSelectedTeacher(null)
      setShowEvaluations(null)
      setSelectedAspect(null)
      setSelectedCourse(null)
      setAspectosEvaluados({})
      
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de los profesores",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [convertirFiltrosAParams, toast])

  // Funciones para manejar filtros
  const handleFiltrosChange = useCallback((nuevosFiltros: FiltrosState) => {
    setFiltros(nuevosFiltros)
    // Cargar datos automáticamente cuando cambian los filtros
    cargarDatos(nuevosFiltros)
  }, [cargarDatos])

  const limpiarFiltros = useCallback(() => {
    const filtrosLimpiados = {
      configuracionSeleccionada: filtros.configuracionSeleccionada, // Mantener la configuración seleccionada
      periodoSeleccionado: "",
      sedeSeleccionada: "",
      programaSeleccionado: "",
      semestreSeleccionado: "",
      grupoSeleccionado: ""
    }
    setFiltros(filtrosLimpiados)
    cargarDatos(filtrosLimpiados)
  }, [filtros.configuracionSeleccionada, cargarDatos])

  // Agrupar asignaturas por docente (ya no necesitamos filtrar aquí porque viene filtrado del endpoint)
  const asignaturasPorDocente = useMemo(() => {
    const agrupadas: Record<string, Record<string, AsignaturaDocente[]>> = {}
    
    asignaturas.forEach(asig => {
      if (!agrupadas[asig.ID_DOCENTE]) {
        agrupadas[asig.ID_DOCENTE] = {}
      }
      if (!agrupadas[asig.ID_DOCENTE][asig.SEMESTRE_PREDOMINANTE]) {
        agrupadas[asig.ID_DOCENTE][asig.SEMESTRE_PREDOMINANTE] = []
      }
      agrupadas[asig.ID_DOCENTE][asig.SEMESTRE_PREDOMINANTE].push(asig)
    })

    return agrupadas
  }, [asignaturas])

  // Obtener docentes únicos de las asignaturas
  const docentes = useMemo(() => {
    const docentesSet = new Set(asignaturas.map(asig => asig.ID_DOCENTE))
    return Array.from(docentesSet).map(id => {
      const docente = asignaturas.find(asig => asig.ID_DOCENTE === id)
      return {
        ID_DOCENTE: id,
        DOCENTE: docente?.DOCENTE || '',
        PROGRAMA_PREDOMINANTE: docente?.PROGRAMA_PREDOMINANTE || ''
      }
    })
  }, [asignaturas])

  // Filtrar docentes cuando cambian los criterios de búsqueda (solo búsqueda local)
  const filteredTeachers = useMemo(() => {
    let result = docentes

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (teacher) =>
          teacher.DOCENTE.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.PROGRAMA_PREDOMINANTE.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return result
  }, [docentes, searchTerm])

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos(filtros)
  }, []) // Solo al montar el componente

  // Función para cargar aspectos evaluados
  const cargarAspectosEvaluados = useCallback(async (idDocente: string) => {
    if (aspectosEvaluados[idDocente]) return

    setLoadingAspectos(prev => ({ ...prev, [idDocente]: true }))
    try {
      const aspectos = await profesoresService.getAspectosPuntaje(idDocente)
      setAspectosEvaluados(prev => ({ ...prev, [idDocente]: aspectos }))
    } catch (error) {
      console.error('Error al cargar aspectos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los aspectos evaluados",
        variant: "destructive",
      })
    } finally {
      setLoadingAspectos(prev => ({ ...prev, [idDocente]: false }))
    }
  }, [aspectosEvaluados, toast])

  // Función para manejar la selección de un profesor
  const handleSelectTeacher = useCallback((id: string) => {
    setSelectedTeacher((prevId) => (prevId === id ? null : id))
    setShowEvaluations((prevId) => (prevId === id ? null : prevId))
    setSelectedAspect(null)
    setSelectedCourse(null)
  }, [])

  // Función para mostrar/ocultar evaluaciones
  const toggleEvaluations = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEvaluations((prevId) => {
      const newId = prevId === id ? null : id
      if (newId) {
        cargarAspectosEvaluados(newId)
      }
      return newId
    })
    setSelectedAspect(null)
  }, [cargarAspectosEvaluados])

  // Función para mostrar/ocultar comentarios de un aspecto
  const toggleAspect = useCallback((teacherId: string, aspectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedAspect((prev) =>
      prev?.teacherId === teacherId && prev?.aspectId === aspectId ? null : { teacherId, aspectId },
    )
  }, [])

  // Función para mostrar/ocultar detalles de un curso
  const toggleCourse = useCallback((teacherId: string, courseId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCourse((prev) =>
      prev?.teacherId === teacherId && prev?.courseId === courseId ? null : { teacherId, courseId },
    )
  }, [])

  // Funciones de utilidad para colores
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

  // Verificar si hay filtros aplicados
  const hayFiltrosAplicados = useMemo(() => {
    return filtros.periodoSeleccionado || 
           filtros.sedeSeleccionada || 
           filtros.programaSeleccionado || 
           filtros.semestreSeleccionado || 
           filtros.grupoSeleccionado
  }, [filtros])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Profesores</h1>
        <p className="text-sm text-gray-500">Gestión y evaluación de docentes</p>
      </header>

      <main className="p-6">
        {/* Componente de Filtros */}
        <Filtros 
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpiarFiltros={limpiarFiltros}
          loading={loading}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lista de Profesores</CardTitle>
            <CardDescription>
              Evaluaciones y desempeño de los docentes
              {hayFiltrosAplicados && (
                <span className="ml-2 text-blue-600">
                  (Filtros aplicados)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Búsqueda */}
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
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900">Total Profesores</h3>
                <p className="text-2xl font-bold text-blue-700">{filteredTeachers.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-900">Programas</h3>
                <p className="text-2xl font-bold text-green-700">
                  {new Set(filteredTeachers.map(t => t.PROGRAMA_PREDOMINANTE)).size}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-900">Asignaturas</h3>
                <p className="text-2xl font-bold text-purple-700">{asignaturas.length}</p>
              </div>
            </div>

            {/* Lista de profesores */}
            <div className="space-y-4">
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {asignaturas.length === 0 && hayFiltrosAplicados ? 
                    "No se encontraron profesores con los filtros aplicados." :
                    "No se encontraron profesores con los criterios de búsqueda."
                  }
                </div>
              ) : (
                filteredTeachers.map((teacher) => {
                  const asignaturasDocente = asignaturasPorDocente[teacher.ID_DOCENTE] || {}
                  const isSelected = selectedTeacher === teacher.ID_DOCENTE
                  const showEvals = showEvaluations === teacher.ID_DOCENTE

                  return (
                    <div
                      key={teacher.ID_DOCENTE}
                      className={`border rounded-lg overflow-hidden transition-colors ${
                        isSelected ? "border-blue-500" : "hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`p-4 cursor-pointer ${
                          isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectTeacher(teacher.ID_DOCENTE)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {isSelected ? (
                              <ChevronDown className="h-5 w-5 mr-2" />
                            ) : (
                              <ChevronRight className="h-5 w-5 mr-2" />
                            )}
                            <div>
                              <h3 className="font-medium">{teacher.DOCENTE}</h3>
                              <p className="text-sm text-gray-500">{teacher.PROGRAMA_PREDOMINANTE}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="bg-gray-50 border-t p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Programa</p>
                              <p>{teacher.PROGRAMA_PREDOMINANTE}</p>
                            </div>
                          </div>

                          {/* Asignaturas por semestre */}
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Asignaturas</h4>
                            <div className="space-y-4">
                              {Object.entries(asignaturasDocente).map(([semestre, asignaturas]) => (
                                <div key={semestre} className="border rounded-lg overflow-hidden">
                                  <div className="p-3 bg-gray-100">
                                    <h5 className="font-medium">{semestre}</h5>
                                  </div>
                                  <div className="divide-y">
                                    {asignaturas.map((asig) => {
                                      const porcentaje = parseFloat(asig.porcentaje_completado)
                                      const isSelected = selectedCourse?.teacherId === teacher.ID_DOCENTE && 
                                                       selectedCourse?.courseId === asig.COD_ASIGNATURA

                                      return (
                                        <div
                                          key={asig.COD_ASIGNATURA}
                                          className={`p-3 cursor-pointer hover:bg-gray-50 ${
                                            isSelected ? "bg-blue-50" : ""
                                          }`}
                                          onClick={(e) => toggleCourse(teacher.ID_DOCENTE, asig.COD_ASIGNATURA, e)}
                                        >
                                          <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                              <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                                              <span>{asig.ASIGNATURA}</span>
                                            </div>
                                            <div className={`text-sm font-medium ${getScoreTextColor(porcentaje)}`}>
                                              {porcentaje}%
                                            </div>
                                          </div>
                                          <div className="mt-2">
                                            <Progress
                                              value={porcentaje}
                                              className="h-1.5"
                                              indicatorClassName={getScoreColor(porcentaje)}
                                            />
                                          </div>
                                          {isSelected && (
                                            <div className="mt-2 text-sm text-gray-600">
                                              <p>Evaluaciones completadas: {asig.evaluaciones_completadas} de {asig.total_evaluaciones_esperadas}</p>
                                              <p>Estado: {asig.estado_evaluacion}</p>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={(e) => toggleEvaluations(teacher.ID_DOCENTE, e)}
                                variant={showEvals ? "default" : "outline"}
                              >
                                {showEvals ? "Ocultar Evaluaciones" : "Ver Evaluaciones"}
                              </Button>
                            </div>
                          </div>

                          {showEvals && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Aspectos Evaluados</h4>
                                <div className="text-sm text-gray-500">
                                  Total de estudiantes: {asignaturasPorDocente[teacher.ID_DOCENTE]?.[Object.keys(asignaturasPorDocente[teacher.ID_DOCENTE] || {})[0]]?.[0]?.total_evaluaciones_esperadas || 0}
                                </div>
                              </div>
                              <div className="space-y-4">
                                {loadingAspectos[teacher.ID_DOCENTE] ? (
                                  <div className="text-center py-4 text-gray-500">
                                    Cargando aspectos evaluados...
                                  </div>
                                ) : aspectosEvaluados[teacher.ID_DOCENTE]?.length > 0 ? (
                                  aspectosEvaluados[teacher.ID_DOCENTE].map((aspecto) => {
                                    const puntaje = parseFloat(aspecto.PUNTAJE_PROMEDIO) * 100
                                    const isSelected = selectedAspect?.teacherId === teacher.ID_DOCENTE && 
                                                     selectedAspect?.aspectId === aspecto.ASPECTO

                                    return (
                                      <div key={aspecto.ASPECTO}>
                                        <div
                                          className={`cursor-pointer p-2 rounded-lg ${
                                            isSelected
                                              ? "bg-blue-50 border border-blue-200"
                                              : "hover:bg-gray-100"
                                          }`}
                                          onClick={(e) => toggleAspect(teacher.ID_DOCENTE, aspecto.ASPECTO, e)}
                                        >
                                          <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                              {isSelected ? (
                                                <ChevronDown className="h-4 w-4 mr-2" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4 mr-2" />
                                              )}
                                              <span>{aspecto.ASPECTO}</span>
                                            </div>
                                            <span className={`text-sm font-medium ${getScoreTextColor(puntaje)}`}>
                                              {puntaje.toFixed(1)}%
                                            </span>
                                          </div>
                                          <div className="mt-1 pl-6">
                                            <Progress
                                              value={puntaje}
                                              className="h-2"
                                              indicatorClassName={getScoreColor(puntaje)}
                                            />
                                          </div>
                                        </div>

                                        {isSelected && (
                                          <div className="mt-2 ml-6 p-3 bg-white rounded-lg border">
                                            <div className="flex items-center mb-2">
                                              <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                                              <h6 className="text-sm font-medium">Descripción</h6>
                                            </div>
                                            <p className="text-sm pl-2 border-l-2 border-gray-300">
                                              {aspecto.descripcion}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    No hay aspectos evaluados disponibles.
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