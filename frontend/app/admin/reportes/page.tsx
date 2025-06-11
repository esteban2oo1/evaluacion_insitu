"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, ChevronDown, ChevronRight, MessageSquare, Loader2 } from "lucide-react"
import { profesoresService } from "@/lib/services/profesores"

interface AsignaturaDocente {
  COD_ASIGNATURA: number
  ASIGNATURA: string
  ID_DOCENTE: string
  DOCENTE: string
  SEMESTRE_PREDOMINANTE: string
  PROGRAMA_PREDOMINANTE: string
  NOMBRE_SEDE: string
  total_evaluaciones_esperadas: number
  evaluaciones_completadas: number
  evaluaciones_pendientes: number
  porcentaje_completado: string
  estado_evaluacion: string
}

interface SedeData {
  nombre: string
  programas: ProgramaData[]
}

interface ProgramaData {
  nombre: string
  semestres: SemestreData[]
}

interface SemestreData {
  nombre: string
  docentes: AsignaturaDocente[]
}

export default function ReportesPage() {
  const [asignaturas, setAsignaturas] = useState<AsignaturaDocente[]>([])
  const [sedes, setSedes] = useState<SedeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para filtros
  const [selectedSede, setSelectedSede] = useState<string | null>(null)
  const [selectedPrograma, setSelectedPrograma] = useState<string | null>(null)
  const [selectedSemestre, setSelectedSemestre] = useState<string | null>(null)
  
  // Estados para expansión
  const [expandedDocentes, setExpandedDocentes] = useState<string[]>([])

  // Cargar datos del backend
  useEffect(() => {
    const loadAsignaturas = async () => {
      try {
        setLoading(true)
        const data = await profesoresService.getAsignaturas()
        setAsignaturas(data)
        
        // Procesar datos para crear estructura jerárquica
        const sedesMap = new Map<string, Map<string, Map<string, AsignaturaDocente[]>>>()
        
        data.forEach(asignatura => {
          const { NOMBRE_SEDE, PROGRAMA_PREDOMINANTE, SEMESTRE_PREDOMINANTE } = asignatura
          
          if (!sedesMap.has(NOMBRE_SEDE)) {
            sedesMap.set(NOMBRE_SEDE, new Map())
          }
          
          const sedeMap = sedesMap.get(NOMBRE_SEDE)!
          if (!sedeMap.has(PROGRAMA_PREDOMINANTE)) {
            sedeMap.set(PROGRAMA_PREDOMINANTE, new Map())
          }
          
          const programaMap = sedeMap.get(PROGRAMA_PREDOMINANTE)!
          if (!programaMap.has(SEMESTRE_PREDOMINANTE)) {
            programaMap.set(SEMESTRE_PREDOMINANTE, [])
          }
          
          programaMap.get(SEMESTRE_PREDOMINANTE)!.push(asignatura)
        })
        
        // Convertir a estructura de datos para la UI
        const sedesData: SedeData[] = Array.from(sedesMap.entries()).map(([nombreSede, programasMap]) => ({
          nombre: nombreSede,
          programas: Array.from(programasMap.entries()).map(([nombrePrograma, semestresMap]) => ({
            nombre: nombrePrograma,
            semestres: Array.from(semestresMap.entries()).map(([nombreSemestre, docentes]) => ({
              nombre: nombreSemestre,
              docentes
            }))
          }))
        }))
        
        setSedes(sedesData)
      } catch (err) {
        console.error('Error al cargar asignaturas:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    loadAsignaturas()
  }, [])

  // Función para manejar la expansión/contracción de docentes
  const toggleDocente = (docenteId: string) => {
    setExpandedDocentes((prev) =>
      prev.includes(docenteId) ? prev.filter((id) => id !== docenteId) : [...prev, docenteId]
    )
  }

  // Obtener el color según el porcentaje
  const getScoreColor = (porcentaje: string) => {
    const score = parseFloat(porcentaje)
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Obtener el color de texto según el porcentaje
  const getScoreTextColor = (porcentaje: string) => {
    const score = parseFloat(porcentaje)
    if (score >= 90) return "text-green-700"
    if (score >= 80) return "text-blue-700"
    if (score >= 70) return "text-yellow-700"
    return "text-red-700"
  }

  // Obtener el color de fondo según el porcentaje
  const getScoreBgColor = (porcentaje: string) => {
    const score = parseFloat(porcentaje)
    if (score >= 90) return "bg-green-100"
    if (score >= 80) return "bg-blue-100"
    if (score >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

  // Obtener estado visual del estado de evaluación
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado':
        return 'bg-green-100 text-green-800'
      case 'en progreso':
        return 'bg-yellow-100 text-yellow-800'
      case 'pendiente':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Resetear filtros cuando se cambia la selección superior
  const handleSedeChange = (sede: string) => {
    setSelectedSede(prev => prev === sede ? null : sede)
    setSelectedPrograma(null)
    setSelectedSemestre(null)
  }

  const handleProgramaChange = (programa: string) => {
    setSelectedPrograma(prev => prev === programa ? null : programa)
    setSelectedSemestre(null)
  }

  const handleSemestreChange = (semestre: string) => {
    setSelectedSemestre(prev => prev === semestre ? null : semestre)
  }

  // Obtener datos filtrados
  const getSedeSeleccionada = () => {
    return sedes.find(sede => sede.nombre === selectedSede)
  }

  const getProgramaSeleccionado = () => {
    const sede = getSedeSeleccionada()
    return sede?.programas.find(programa => programa.nombre === selectedPrograma)
  }

  const getSemestreSeleccionado = () => {
    const programa = getProgramaSeleccionado()
    return programa?.semestres.find(semestre => semestre.nombre === selectedSemestre)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando datos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Reportes de Evaluación In-Situ</h1>
        <p className="text-sm text-gray-500">Análisis de evaluaciones por sede, programa y semestre</p>
      </header>

      <main className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sedes</CardTitle>
            <CardDescription>Seleccione una sede para ver sus programas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sedes.map((sede) => (
                <div key={sede.nombre} className="border rounded-lg overflow-hidden">
                  <div
                    className={`p-4 cursor-pointer flex justify-between items-center ${
                      selectedSede === sede.nombre ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => handleSedeChange(sede.nombre)}
                  >
                    <h3 className="font-medium">{sede.nombre}</h3>
                    {selectedSede === sede.nombre ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>

                  {selectedSede === sede.nombre && (
                    <div className="p-4 bg-gray-50 border-t">
                      <h4 className="font-medium mb-3">Programas</h4>
                      <div className="space-y-2">
                        {sede.programas.map((programa) => (
                          <div key={programa.nombre} className="border rounded-lg overflow-hidden bg-white">
                            <div
                              className={`p-3 cursor-pointer flex justify-between items-center ${
                                selectedPrograma === programa.nombre ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleProgramaChange(programa.nombre)}
                            >
                              <h5 className="font-medium text-sm">{programa.nombre}</h5>
                              {selectedPrograma === programa.nombre ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>

                            {selectedPrograma === programa.nombre && (
                              <div className="p-3 bg-green-50 border-t">
                                <h6 className="font-medium mb-2 text-sm">Semestres</h6>
                                <div className="grid grid-cols-4 gap-2">
                                  {programa.semestres.map((semestre) => (
                                    <Button
                                      key={semestre.nombre}
                                      variant={selectedSemestre === semestre.nombre ? "default" : "outline"}
                                      size="sm"
                                      className="text-xs"
                                      onClick={() => handleSemestreChange(semestre.nombre)}
                                    >
                                      {semestre.nombre}
                                    </Button>
                                  ))}
                                </div>

                                {selectedSemestre !== null && (
                                  <div className="mt-4">
                                    <div className="flex justify-between items-center mb-3">
                                      <h6 className="font-medium text-sm">
                                        Docentes del Semestre {selectedSemestre}
                                      </h6>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                          <Download className="h-3 w-3 mr-1" />
                                          PDF
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          <Download className="h-3 w-3 mr-1" />
                                          Excel
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      {getSemestreSeleccionado()?.docentes.map((asignatura) => (
                                        <div key={`${asignatura.ID_DOCENTE}-${asignatura.COD_ASIGNATURA}`} className="border rounded-lg overflow-hidden bg-white">
                                          <div
                                            className={`p-3 cursor-pointer ${
                                              expandedDocentes.includes(asignatura.ID_DOCENTE) ? "bg-gray-100" : "hover:bg-gray-50"
                                            }`}
                                            onClick={() => toggleDocente(asignatura.ID_DOCENTE)}
                                          >
                                            <div className="flex justify-between items-center">
                                              <div>
                                                <div className="flex items-center">
                                                  {expandedDocentes.includes(asignatura.ID_DOCENTE) ? (
                                                    <ChevronDown className="h-4 w-4 mr-2" />
                                                  ) : (
                                                    <ChevronRight className="h-4 w-4 mr-2" />
                                                  )}
                                                  <h6 className="font-medium text-sm">{asignatura.DOCENTE}</h6>
                                                </div>
                                                <p className="text-xs text-gray-500 ml-6">{asignatura.ASIGNATURA}</p>
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <div
                                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(asignatura.porcentaje_completado)} ${getScoreTextColor(asignatura.porcentaje_completado)}`}
                                                >
                                                  {asignatura.porcentaje_completado}%
                                                </div>
                                                <div
                                                  className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(asignatura.estado_evaluacion)}`}
                                                >
                                                  {asignatura.estado_evaluacion}
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          {expandedDocentes.includes(asignatura.ID_DOCENTE) && (
                                            <div className="p-3 bg-gray-50 border-t">
                                              <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                  <span className="font-medium">Evaluaciones esperadas:</span>
                                                  <p>{asignatura.total_evaluaciones_esperadas}</p>
                                                </div>
                                                <div>
                                                  <span className="font-medium">Evaluaciones completadas:</span>
                                                  <p className="text-green-600">{asignatura.evaluaciones_completadas}</p>
                                                </div>
                                                <div>
                                                  <span className="font-medium">Evaluaciones pendientes:</span>
                                                  <p className="text-red-600">{asignatura.evaluaciones_pendientes}</p>
                                                </div>
                                                <div>
                                                  <span className="font-medium">Código asignatura:</span>
                                                  <p>{asignatura.COD_ASIGNATURA}</p>
                                                </div>
                                              </div>
                                              <div className="mt-3">
                                                <div className="flex justify-between items-center mb-1">
                                                  <span className="text-xs font-medium">Progreso de evaluación</span>
                                                  <span className="text-xs">{asignatura.porcentaje_completado}%</span>
                                                </div>
                                                <Progress
                                                  value={parseFloat(asignatura.porcentaje_completado)}
                                                  className="h-2"
                                                  indicatorClassName={getScoreColor(asignatura.porcentaje_completado)}
                                                />
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