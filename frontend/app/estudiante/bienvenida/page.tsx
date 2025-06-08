"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { authService } from "@/lib/services/auth"
import { PerfilEstudiante } from "@/lib/types/auth"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog" 
import { useRouter } from "next/navigation"
import { configuracionEvaluacionService, evaluacionService } from "@/lib/services/evaluacionInsitu"
import { BulkEvaluacionesResponse, EvaluacionCreada, Evaluacion } from "@/lib/types/evaluacionInsitu";
import { ConfiguracionEvaluacion} from "@/lib/types/evaluacionInsitu"
import { Calendar, Clock, FileText, Star, Timer, AlertCircle} from "lucide-react"
import { ModalEvaluacionesCreadas } from "@/app/estudiante/components/ModalEvaluacionesCreadas"

export default function EstudianteBienvenida() {
  const router = useRouter()
  const { toast } = useToast()
  const [perfil, setPerfil] = useState<PerfilEstudiante | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionEvaluacion[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [modalEvaluacionesOpen, setModalEvaluacionesOpen] = useState(false)
  const [evaluacionesCreadas, setEvaluacionesCreadas] = useState<EvaluacionCreada[]>([]);
  const [configuracionIdSeleccionada, setConfiguracionIdSeleccionada] = useState<number | null>(null)
  const [isCreatingEvaluaciones, setIsCreatingEvaluaciones] = useState(false)

  // Actualizar el tiempo cada minuto para mantener el contador actualizado
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Actualizar cada minuto

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const response = await authService.getProfile()
        if (response.success && response.data.tipo === "estudiante") {
          const perfilData = response.data as PerfilEstudiante
          setPerfil(perfilData)
        } else {
          toast({
            title: "Error",
            description: "No se pudo cargar el perfil del estudiante",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del estudiante",
          variant: "destructive",
        })
      }
    }

    cargarPerfil()
  }, [toast])

  useEffect(() => {
    const cargarConfiguraciones = async () => {
      try {
        setLoading(true)
        const [configResponse, ] = await Promise.all([
          configuracionEvaluacionService.getAll()
        ])
        
        // Filtrar solo configuraciones activas
        const configuracionesActivas = configResponse.filter((config: ConfiguracionEvaluacion) => config.ACTIVO)
        setConfiguraciones(configuracionesActivas)
      } catch (error) {
        console.error("Error al cargar configuraciones:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las evaluaciones disponibles",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarConfiguraciones()
  }, [toast])

  const isEvaluacionVigente = (fechaInicio: string, fechaFin: string) => {
    const ahora = new Date()
    const inicio = new Date(fechaInicio)
    // La evaluación finaliza a las 23:59 del día anterior
    const fin = new Date(fechaFin)
    fin.setHours(23, 59, 59, 999)
    fin.setDate(fin.getDate() - 1)
    
    return ahora >= inicio && ahora <= fin
  }

  const getTiempoRestante = (fechaFin: string) => {
    const ahora = new Date()
    // La evaluación finaliza a las 23:59 del día anterior
    const fin = new Date(fechaFin)
    fin.setHours(23, 59, 59, 999)
    fin.setDate(fin.getDate() - 1)
    
    const diferencia = fin.getTime() - ahora.getTime()
    
    if (diferencia <= 0) {
      return { dias: 0, horas: 0, minutos: 0, texto: "Finalizada" }
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))

    let texto = ""
    if (dias > 0) {
      texto = `${dias} ${dias === 1 ? 'día' : 'días'}, ${horas} ${horas === 1 ? 'hora' : 'horas'}`
    } else if (horas > 0) {
      texto = `${horas} ${horas === 1 ? 'hora' : 'horas'}, ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`
    } else {
      texto = `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`
    }

    return { dias, horas, minutos, texto }
  }

  const getProgressPercentage = (fechaInicio: string, fechaFin: string) => {
    const ahora = new Date()
    const inicio = new Date(fechaInicio)
    // La evaluación finaliza a las 23:59 del día anterior
    const fin = new Date(fechaFin)
    fin.setHours(23, 59, 59, 999)
    fin.setDate(fin.getDate() - 1)
    
    const total = fin.getTime() - inicio.getTime()
    const transcurrido = ahora.getTime() - inicio.getTime()
    const porcentaje = Math.max(0, Math.min(100, (transcurrido / total) * 100))
    return porcentaje
  }

  const getUrgencyLevel = (tiempoRestante: { dias: number, horas: number }) => {
    const totalHoras = tiempoRestante.dias * 24 + tiempoRestante.horas
    
    if (totalHoras <= 24) return 'critical' // Menos de 24 horas
    if (totalHoras <= 72) return 'warning'  // Menos de 3 días
    return 'normal'
  }

const handleIniciarEvaluacion = async (configuracion: ConfiguracionEvaluacion) => {
    if (!perfil) {
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil del estudiante",
        variant: "destructive",
      })
      return
    }

    setConfiguracionIdSeleccionada(configuracion.ID)
    
    try {
      // Paso 1: Verificar si ya existen evaluaciones para esta configuración
      const evaluacionesExistentes = await evaluacionService.getByEstudianteByConfiguracion(
        perfil.documento, 
        configuracion.ID
      )

      if (evaluacionesExistentes && evaluacionesExistentes.length > 0) {
        // Caso: Las evaluaciones ya existen - redirigir al dashboard
        toast({
          title: "Evaluaciones encontradas",
          description: "Redirigiendo a tus evaluaciones pendientes...",
          variant: "default",
        })
        
        // Redirigir al dashboard con el ID de configuración
        router.push(`/estudiante/dashboard/${configuracion.ID}`)
        return
      }

      // Paso 2: No existen evaluaciones - Mostrar modal en modo loading INMEDIATAMENTE
      
      setIsCreatingEvaluaciones(true)
      setEvaluacionesCreadas([])
      setModalEvaluacionesOpen(true)
      
      // Pequeño delay para que se vea la animación de loading
      await new Promise(resolve => setTimeout(resolve, 500))
      
      try {        
        const response = await evaluacionService.createInsitu({ 
          tipoEvaluacionId: configuracion.ID 
        })
                
        // Verificar que la respuesta no sea null/undefined
        if (!response) {
          throw new Error('El servidor no devolvió una respuesta válida')
        }
        
        // Helper function to normalize response
        const normalizeResponse = (rawResponse: any): { success: boolean, evaluaciones: EvaluacionCreada[], message?: string } => {
          // Case 1: Standard BulkEvaluacionesResponse format
          if (rawResponse.success !== undefined && rawResponse.data?.evaluaciones) {
            return {
              success: rawResponse.success,
              evaluaciones: rawResponse.data.evaluaciones,
              message: rawResponse.message
            }
          }
          
          // Case 2: Direct array of evaluaciones
          if (Array.isArray(rawResponse)) {
            return {
              success: true,
              evaluaciones: rawResponse,
              message: 'Evaluaciones obtenidas correctamente'
            }
          }
          
          // Case 3: Object with evaluaciones property
          if (rawResponse.evaluaciones && Array.isArray(rawResponse.evaluaciones)) {
            return {
              success: true,
              evaluaciones: rawResponse.evaluaciones,
              message: rawResponse.message || 'Evaluaciones obtenidas correctamente'
            }
          }
          
          // Case 4: Error response or unexpected format
          if (rawResponse.success === false) {
            return {
              success: false,
              evaluaciones: [],
              message: rawResponse.message || rawResponse.error || 'Error desconocido'
            }
          }
          
          // Case 5: Unknown format
          console.warn('🤔 Formato de respuesta desconocido:', rawResponse)
          return {
            success: false,
            evaluaciones: [],
            message: 'Formato de respuesta no reconocido del servidor'
          }
        }
        
        const normalizedResponse = normalizeResponse(response)
        
        if (normalizedResponse.success && normalizedResponse.evaluaciones.length > 0) {
          
          // Simular un poco más de tiempo para mostrar la animación completa
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          toast({
            title: "¡Evaluaciones creadas!",
            description: `Se crearon ${normalizedResponse.evaluaciones.length} evaluaciones correctamente. Redirigiendo...`,
            variant: "default",
          })
          
          // Cerrar modal y redirigir al dashboard
          setModalEvaluacionesOpen(false)
          setIsCreatingEvaluaciones(false)
          
          // Pequeño delay para que se vea el toast antes de redirigir
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          router.push(`/estudiante/dashboard/${configuracion.ID}`)
          
        } else if (!normalizedResponse.success) {
          
          // Check if it's a "ya existen" type error
          if (normalizedResponse.message?.toLowerCase().includes("ya exist") || 
              normalizedResponse.message?.toLowerCase().includes("already exist")) {
            
            const evaluacionesVerificacion = await evaluacionService.getByEstudianteByConfiguracion(
              perfil.documento, 
              configuracion.ID
            )
                        
            if (evaluacionesVerificacion && evaluacionesVerificacion.length > 0) {
              
              await new Promise(resolve => setTimeout(resolve, 1500))
              
              toast({
                title: "Evaluaciones encontradas",
                description: "Tus evaluaciones estaban listas. Redirigiendo...",
                variant: "default",
              })
              
              // Cerrar modal y redirigir al dashboard
              setModalEvaluacionesOpen(false)
              setIsCreatingEvaluaciones(false)
              
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              router.push(`/estudiante/dashboard/${configuracion.ID}`)
              
            } else {
              throw new Error('Inconsistencia de datos: el backend dice que existen pero no se encontraron evaluaciones')
            }
          } else {
            // Otros errores del backend
            throw new Error(normalizedResponse.message || "Error desconocido del servidor")
          }
          
        } else {
          // No success, no evaluaciones
          throw new Error('El servidor no devolvió evaluaciones válidas')
        }
        
      } catch (createError) {
        console.error("❌ Error al crear evaluaciones:", {
          error: createError,
          message: createError instanceof Error ? createError.message : 'Error desconocido',
          stack: createError instanceof Error ? createError.stack : undefined
        })
        
        // Cerrar modal y mostrar error
        setModalEvaluacionesOpen(false)
        setIsCreatingEvaluaciones(false)
        
        let errorMessage = "Error desconocido"
        let errorTitle = "Error de conexión"
        
        if (createError instanceof Error) {
          errorMessage = createError.message
          
          if (createError.message.includes('fetch') || createError.message.includes('network')) {
            errorTitle = "Error de red"
            errorMessage = "No se pudo conectar al servidor. Verifica tu conexión."
          } else if (createError.message.includes('timeout')) {
            errorTitle = "Tiempo agotado"
            errorMessage = "La solicitud tardó demasiado. Intenta nuevamente."
          } else if (createError.message.includes('servidor')) {
            errorTitle = "Error del servidor"
            // Mantener el mensaje original que ya es descriptivo
          }
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        })
      }
      
    } catch (initialError) {
      console.error("❌ Error inicial:", {
        error: initialError,
        message: initialError instanceof Error ? initialError.message : 'Error desconocido'
      })
      setIsCreatingEvaluaciones(false)
      setModalEvaluacionesOpen(false)
      
      toast({
        title: "Error de verificación",
        description: "No se pudo verificar el estado de las evaluaciones.",
        variant: "destructive",
      })
    }
  }

  if (!perfil) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowProfileModal(true)}
            className="hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 animate-fade-in">{perfil.nombre_completo}</h1>
            <p className="text-sm text-gray-500 animate-fade-in-delay">Dashboard de Evaluaciones</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="border-gray-900 text-gray-900 hover:bg-gray-100 transition-all duration-200 hover:shadow-md">
            Cerrar Sesión
          </Button>
        </Link>
      </header>

      <main className="container mx-auto p-6 max-w-6xl">
        {/* Evaluaciones Disponibles */}
        <div className="mb-8">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Evaluaciones Disponibles
            </h2>
            <p className="text-gray-600 text-lg">Selecciona una evaluación para completar</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                <div className="animate-ping absolute top-2 left-2 h-12 w-12 rounded-full bg-gray-200 opacity-75"></div>
              </div>
            </div>
          ) : configuraciones.length === 0 ? (
            <Card className="max-w-md mx-auto animate-fade-in-up shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">No hay evaluaciones disponibles</h4>
                <p className="text-gray-500 text-lg">
                  No tienes evaluaciones pendientes en este momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {configuraciones.map((configuracion, index) => {
                const vigente = isEvaluacionVigente(configuracion.FECHA_INICIO, configuracion.FECHA_FIN)
                const tiempoRestante = getTiempoRestante(configuracion.FECHA_FIN)
                const progreso = getProgressPercentage(configuracion.FECHA_INICIO, configuracion.FECHA_FIN)
                const urgencyLevel = getUrgencyLevel(tiempoRestante)

                return (
                  <Card
                    key={configuracion.ID}
                    className={`relative group transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-3xl border-2 animate-fade-in-up overflow-hidden ${
                      vigente
                        ? 'bg-white border-gray-200 hover:border-gray-300'
                        : 'bg-gray-50 border-gray-100 opacity-90'
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 group-hover:animate-shimmer -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                    
                    {/* Badge de estado con animación */}
                    <div className="absolute top-6 right-6 z-10">
                      <Badge
                        variant={vigente ? "default" : "secondary"}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                          vigente
                            ? 'bg-green-100 text-green-700 border-green-200 animate-pulse-slow'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {vigente ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>

                    <CardHeader className="pb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${
                          vigente ? 'bg-blue-100 group-hover:bg-blue-200' : 'bg-gray-200'
                        }`}>
                          <Star className={`h-6 w-6 transition-all duration-300 ${
                            vigente ? 'text-blue-600 group-hover:text-blue-700' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                            {configuracion.TIPO_EVALUACION_NOMBRE}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">Código #{configuracion.ID}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Fechas con iconos mejorados */}
                      <div className="space-y-3 bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="p-2 bg-white rounded-full shadow-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <span className="text-gray-600 block">Inicio</span>
                            <span className="font-semibold text-gray-900">
                              {new Date(configuracion.FECHA_INICIO).toLocaleDateString("es-ES", {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="p-2 bg-white rounded-full shadow-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <span className="text-gray-600 block">Finaliza</span>
                              <span className="font-semibold text-gray-900">
                                {(() => {
                                  const fechaFin = new Date(configuracion.FECHA_FIN);
                                  fechaFin.setDate(fechaFin.getDate() - 1); // Restar un día

                                  return fechaFin.toLocaleDateString("es-ES", {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  }) + ' a las 23:59';
                                })()}
                              </span>

                          </div>
                        </div>
                      </div>

                      {/* Progreso mejorado */}
                      {vigente && (
                        <div className="space-y-3 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700 font-medium">Progreso del período</span>
                            <span className="font-bold text-blue-900">{Math.round(progreso)}%</span>
                          </div>
                          <div className="relative">
                            <Progress
                              value={progreso}
                              className="h-3 bg-blue-100 rounded-full shadow-inner"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                          </div>
                        </div>
                      )}

                      {/* Tiempo restante mejorado con urgencia */}
                      {vigente && tiempoRestante.dias >= 0 && tiempoRestante.texto !== "Finalizada" && (
                        <div className={`rounded-2xl p-4 border-2 transition-all duration-300 ${
                          urgencyLevel === 'critical' 
                            ? 'bg-red-50 border-red-200 animate-pulse-slow' 
                            : urgencyLevel === 'warning'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              urgencyLevel === 'critical' 
                                ? 'bg-red-100' 
                                : urgencyLevel === 'warning'
                                ? 'bg-yellow-100'
                                : 'bg-green-100'
                            }`}>
                              {urgencyLevel === 'critical' ? (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              ) : (
                                <Timer className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-bold text-sm ${
                                urgencyLevel === 'critical' 
                                  ? 'text-red-900' 
                                  : urgencyLevel === 'warning'
                                  ? 'text-yellow-900'
                                  : 'text-green-900'
                              }`}>
                                {urgencyLevel === 'critical' ? '¡Tiempo limitado!' : 'Tiempo restante'}
                              </p>
                              <p className={`text-lg font-semibold ${
                                urgencyLevel === 'critical' 
                                  ? 'text-red-800' 
                                  : urgencyLevel === 'warning'
                                  ? 'text-yellow-800'
                                  : 'text-green-800'
                              }`}>
                                {tiempoRestante.texto}
                              </p>
                              {urgencyLevel === 'critical' && (
                                <p className="text-xs text-red-600 mt-1 animate-bounce">
                                  ¡No olvides completar tu evaluación!
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Botón de acción mejorado */}
                      <div className="pt-2">
                        <Button
                          className={`w-full text-base font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            vigente
                              ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!vigente}
                          onClick={() => handleIniciarEvaluacion(configuracion)}
                        >
                          {vigente ? (
                            <div className="flex items-center gap-2">
                              <Star className="h-5 w-5" />
                              Iniciar Evaluación
                            </div>
                          ) : (
                            'No Disponible'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal de Perfil mejorado */}
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent className="sm:max-w-3xl animate-fade-in-up">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                Información del Estudiante
              </DialogTitle>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-2 rounded-full"></div>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Documento</p>
                  <p className="text-lg font-bold text-gray-900">{perfil.tipo_doc} {perfil.documento}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">Estado</p>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm">
                    {perfil.estado_matricula}
                  </Badge>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Semestre</p>
                  <p className="text-lg font-bold text-gray-900">{perfil.semestre}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Programa</p>
                  <p className="text-lg font-bold text-gray-900">{perfil.programa}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Periodo</p>
                  <p className="text-lg font-bold text-gray-900">{perfil.periodo}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ModalEvaluacionesCreadas
          isOpen={modalEvaluacionesOpen}
          onClose={() => {
            if (!isCreatingEvaluaciones) {
              setModalEvaluacionesOpen(false);
              setEvaluacionesCreadas([]);
            }
          }}
          evaluaciones={evaluacionesCreadas}
          isLoading={isCreatingEvaluaciones}
        />

      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 1s ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}