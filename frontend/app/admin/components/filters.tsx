"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { configuracionEvaluacionService, tiposEvaluacionesService } from "@/lib/services/evaluacionInsitu"
import { TipoEvaluacion, ConfiguracionEvaluacion } from "@/lib/types/evaluacionInsitu"
import { getSemestres, getPeriodos, getProgramas, getGrupos, getSedes } from "@/lib/services/vista/vistaAcademicaInsitu"
import { Periodo, Semestre, Programa, Grupo, Sede } from "@/lib/types/vista/vistaAcademicaInsitu"
import { ApiResponse } from "@/lib/types/dashboard/dashboard"

interface FiltrosState {
  configuracionSeleccionada: number | null
  semestreSeleccionado: string
  periodoSeleccionado: string
  programaSeleccionado: string
  grupoSeleccionado: string
  sedeSeleccionada: string
}

interface FiltrosProps {
  filtros: FiltrosState
  onFiltrosChange: (filtros: FiltrosState) => void
  onLimpiarFiltros: () => void
  loading?: boolean
}

interface ConfiguracionInfo {
  configuracion: ConfiguracionEvaluacion
  tipoEvaluacion?: TipoEvaluacion
}

function extractData<T extends object>(response: T | ApiResponse<T>): T {
  if ('success' in response && 'data' in response) {
    return response.data
  }
  return response
}

export default function Filtros({ 
  filtros, 
  onFiltrosChange, 
  onLimpiarFiltros, 
  loading = false 
}: FiltrosProps) {
  // Estados para las opciones de los selects
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionEvaluacion[]>([])
  const [tiposEvaluacion, setTiposEvaluacion] = useState<TipoEvaluacion[]>([])
  const [semestres, setSemestres] = useState<Semestre[]>([])
  const [periodos, setPeriodos] = useState<Periodo[]>([])
  const [programas, setProgramas] = useState<Programa[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true)
        const [
          configsResponse,
          tiposResponse,
          semestresResponse,
          periodosResponse,
          programasResponse,
          gruposResponse,
          sedesResponse
        ] = await Promise.all([
          configuracionEvaluacionService.getAll(),
          tiposEvaluacionesService.getAll(),
          getSemestres(),
          getPeriodos(),
          getProgramas(),
          getGrupos(),
          getSedes()
        ])

        const configuracionesData = extractData<ConfiguracionEvaluacion[]>(configsResponse)
        const tiposData = extractData<TipoEvaluacion[]>(tiposResponse)
        const semestresData = extractData<Semestre[]>(semestresResponse)
        const periodosData = extractData<Periodo[]>(periodosResponse)
        const programasData = extractData<Programa[]>(programasResponse)
        const gruposData = extractData<Grupo[]>(gruposResponse)
        const sedesData = extractData<Sede[]>(sedesResponse)

        setConfiguraciones(configuracionesData)
        setTiposEvaluacion(tiposData)
        setSemestres(semestresData)
        setPeriodos(periodosData)
        setProgramas(programasData)
        setGrupos(gruposData)
        setSedes(sedesData)

        // Si no hay configuración seleccionada, seleccionar la activa por defecto
        if (!filtros.configuracionSeleccionada && Array.isArray(configuracionesData) && configuracionesData.length > 0) {
          const configuracionActiva = configuracionesData.find((config) => config.ACTIVO)
          const configuracionPorDefecto = configuracionActiva || configuracionesData[0]
          
          onFiltrosChange({
            ...filtros,
            configuracionSeleccionada: configuracionPorDefecto.ID
          })
        }

      } catch (error) {
        console.error("Error cargando datos de filtros:", error)
      } finally {
        setLoadingData(false)
      }
    }

    cargarDatos()
  }, [])

  const handleFiltroChange = (campo: keyof FiltrosState, valor: string | number) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    })
  }

  // Obtener información de la configuración seleccionada
  const getConfiguracionInfo = (): ConfiguracionInfo | null => {
    if (!filtros.configuracionSeleccionada || !configuraciones.length) return null
    const configuracion = configuraciones.find(c => c.ID === filtros.configuracionSeleccionada)
    if (!configuracion) return null
    const tipoEvaluacion = tiposEvaluacion.find(t => t.ID === configuracion.TIPO_EVALUACION_ID)
    return {
      configuracion,
      tipoEvaluacion
    }
  }

  const configuracionInfo = getConfiguracionInfo()

  if (loadingData) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-gray-900">Filtros</CardTitle>
          <CardDescription className="text-gray-600">
            Cargando opciones de filtrado...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-gray-900">Filtros</CardTitle>
        <CardDescription className="text-gray-600">
          Selecciona la configuración de evaluación y filtra los datos por criterios específicos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          
          {/* Selector de Configuración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configuración *
            </label>
            <select
              value={filtros.configuracionSeleccionada || ""}
              onChange={(e) => handleFiltroChange('configuracionSeleccionada', parseInt(e.target.value))}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona configuración</option>
              {configuraciones.map((config) => (
                <option key={config.ID} value={config.ID}>
                  {config.TIPO_EVALUACION_NOMBRE} {config.ACTIVO && "(Activa)"}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periodo
            </label>
            <select
              value={filtros.periodoSeleccionado}
              onChange={(e) => handleFiltroChange('periodoSeleccionado', e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todos</option>
              {periodos
                .filter((periodo, index, self) => 
                  periodo.PERIODO && 
                  self.findIndex(p => p.PERIODO === periodo.PERIODO) === index
                )
                .map((periodo, index) => (
                  <option key={`periodo-${periodo.PERIODO}-${index}`} value={periodo.PERIODO}>
                    {periodo.PERIODO}
                  </option>
                ))}
            </select>
          </div>

          {/* Selector de Sede */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sede
            </label>
            <select
              value={filtros.sedeSeleccionada}
              onChange={(e) => handleFiltroChange('sedeSeleccionada', e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todas</option>
              {sedes
                .filter((sede, index, self) => 
                  sede.NOMBRE_SEDE && 
                  self.findIndex(s => s.NOMBRE_SEDE === sede.NOMBRE_SEDE) === index
                )
                .map((sede, index) => (
                  <option key={`sede-${sede.NOMBRE_SEDE}-${index}`} value={sede.NOMBRE_SEDE}>
                    {sede.NOMBRE_SEDE}
                  </option>
                ))}
            </select>
          </div>

          {/* Selector de Programa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programa
            </label>
            <select
              value={filtros.programaSeleccionado}
              onChange={(e) => handleFiltroChange('programaSeleccionado', e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todos</option>
              {programas
                .filter((programa, index, self) => 
                  programa.NOM_PROGRAMA && 
                  self.findIndex(p => p.NOM_PROGRAMA === programa.NOM_PROGRAMA) === index
                )
                .map((programa, index) => (
                  <option key={`programa-${programa.NOM_PROGRAMA}-${index}`} value={programa.NOM_PROGRAMA}>
                    {programa.NOM_PROGRAMA}
                  </option>
                ))}
            </select>
          </div>

          {/* Selector de Semestre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semestre
            </label>
            <select
              value={filtros.semestreSeleccionado}
              onChange={(e) => handleFiltroChange('semestreSeleccionado', e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todos</option>
              {semestres
                .filter((semestre, index, self) => 
                  semestre.SEMESTRE && 
                  self.findIndex(s => s.SEMESTRE === semestre.SEMESTRE) === index
                )
                .map((semestre, index) => (
                  <option key={`semestre-${semestre.SEMESTRE}-${index}`} value={semestre.SEMESTRE}>
                    {semestre.SEMESTRE}
                  </option>
                ))}
            </select>
          </div>

          {/* Selector de Grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grupo
            </label>
            <select
              value={filtros.grupoSeleccionado}
              onChange={(e) => handleFiltroChange('grupoSeleccionado', e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Todos</option>
              {grupos
                .filter((grupo, index, self) => 
                  grupo.GRUPO && 
                  self.findIndex(g => g.GRUPO === grupo.GRUPO) === index
                )
                .map((grupo, index) => (
                  <option key={`grupo-${grupo.GRUPO}-${index}`} value={grupo.GRUPO}>
                    {grupo.GRUPO}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Información de la configuración seleccionada */}
        {configuracionInfo && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Información de la Configuración</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">Nombre:</span> {configuracionInfo.configuracion.TIPO_EVALUACION_NOMBRE}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {configuracionInfo.tipoEvaluacion?.NOMBRE || 'No disponible'}
              </div>
              <div>
                <span className="font-medium">Estado:</span>
                <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                  configuracionInfo.configuracion.ACTIVO 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {configuracionInfo.configuracion.ACTIVO ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              {configuracionInfo.configuracion.TIPO_EVALUACION_DESCRIPCION && (
                <div className="md:col-span-2 lg:col-span-3">
                  <span className="font-medium">Descripción:</span> {configuracionInfo.configuracion.TIPO_EVALUACION_DESCRIPCION}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón para limpiar filtros */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onLimpiarFiltros}
            disabled={loading}
            className="px-6"
          >
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}