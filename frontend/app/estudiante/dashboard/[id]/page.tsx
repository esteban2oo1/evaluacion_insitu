"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { authService } from "@/lib/services/auth"
import { PerfilEstudiante, MateriaEstudiante } from "@/lib/types/auth"
import { Progress } from "@/components/ui/progress"
import api from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { evaluacionService } from "@/lib/services/evaluacionInsitu/evaluaciones" 
import type { Evaluacion } from "@/lib/types/evaluacionInsitu"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Check, CircleOff } from "lucide-react"

interface ReporteEvaluaciones {
  total_materias: number
  evaluaciones_completadas: number
  materias_pendientes: number
  porcentaje_completado: string
}

export default function EstudianteDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [perfil, setPerfil] = useState<PerfilEstudiante | null>(null)
  const [materias, setMaterias] = useState<MateriaEstudiante[]>([])
  const [reporte, setReporte] = useState<ReporteEvaluaciones | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const params = useParams()
  
  const configId = params?.id
  const id = configId ? (Array.isArray(configId) ? Number(configId[0]) : Number(configId)) : null

  useEffect(() => {    
    const cargarPerfil = async () => {
      try {
        const response = await authService.getProfile()
        if (response.success && response.data.tipo === "estudiante") {
          const perfilData = response.data as PerfilEstudiante
          setPerfil(perfilData)
          setMaterias(perfilData.materias)
          
          // Cargar reporte de evaluaciones usando axios
          try {
            const reporteResponse = await api.get(`/reportes/estudiantes/${perfilData.documento}/configuracion/${id}`)
            if (reporteResponse.data) {
              setReporte(reporteResponse.data[0])
            }
          } catch (error) {
            toast({
              title: "Error",
              description: "No se pudo cargar el reporte de evaluaciones",
              variant: "destructive",
            })
          }

          // Cargar evaluaciones del estudiante - Solo si tenemos un ID válido
          if (id !== null && !isNaN(id)) {
            try {
              const evaluacionesData = await evaluacionService.getByEstudianteByConfiguracion(perfilData.documento, id);
              setEvaluaciones(Array.isArray(evaluacionesData) ? evaluacionesData : []);
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo cargar las evaluaciones",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Error de navegación",
              description: "No se pudo identificar la configuración de evaluación",
              variant: "destructive",
            });
          }
          
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

    // Solo cargar si tenemos un ID válido o si al menos tenemos los params
    if (configId !== undefined) {
      cargarPerfil()
    }
  }, [toast, id, configId, params])

  const handleEvaluarDocente = (id: number) => {
    window.location.href = `/estudiante/evaluar/${id}`
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
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowProfileModal(true)}
            className="hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{perfil.nombre_completo}</h1>
            {id && (
              <p className="text-sm text-gray-500">Configuración #{id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/estudiante/bienvenida">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              ← Volver
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-gray-900 text-gray-900 hover:bg-gray-100">
              Cerrar Sesión
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-6xl">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Tus Asignaturas</CardTitle>
                <CardDescription className="text-gray-600">Selecciona una asignatura para evaluar al docente</CardDescription>
              </div>
              {reporte && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Progreso de Evaluaciones</p>
                    <p className="text-lg font-semibold text-gray-900">{reporte.evaluaciones_completadas} de {reporte.total_materias} completadas</p>
                  </div>
                  <div className="w-32">
                    <Progress 
                      value={parseFloat(reporte.porcentaje_completado)} 
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"
                    />
                    <p className="text-xs text-gray-500 text-right mt-1">{reporte.porcentaje_completado}%</p>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {evaluaciones.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evaluaciones disponibles</h3>
                <p className="text-gray-600">
                  {id ? 
                    `No se encontraron evaluaciones para la configuración #${id}.` : 
                    'No se pudo identificar la configuración de evaluación.'
                  }
                </p>
                {!id && (
                  <Link href="/estudiante/bienvenida" className="inline-block mt-4">
                    <Button variant="outline">
                      Volver a Evaluaciones Disponibles
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {evaluaciones.map((evaluacion) => (
                  <div
                    key={evaluacion.ID}
                    className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="relative">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{evaluacion.ASIGNATURA}</h3>
                        <p className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                          {evaluacion.ACTIVO ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <CircleOff className="w-4 h-4 text-red-500" />
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Docente</p>
                          <p className="text-base font-semibold text-gray-900">{evaluacion.DOCENTE}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {evaluacion.SEMESTRE_PREDOMINANTE
                        .toLowerCase()
                        .replace(/(\d+)\s+semestre/, (_, num) => `${num} Semestre`)}
                    </p>
                    
                    <p className="text-sm text-gray-600">{evaluacion.PROGRAMA_PREDOMINANTE}</p>
                    <Button
                      onClick={() =>
                        router.push(
                          `/estudiante/evaluar/${evaluacion.ID_CONFIGURACION}` +
                          `?docente=${encodeURIComponent(evaluacion.DOCENTE)}` +
                          `&cod=${encodeURIComponent(evaluacion.CODIGO_MATERIA)}` +
                          `&id=${encodeURIComponent(evaluacion.ID)}` +
                          `&materia=${encodeURIComponent(evaluacion.ASIGNATURA)}` +
                          `&semestre=${encodeURIComponent(evaluacion.SEMESTRE_PREDOMINANTE)}` +
                          `&programa=${encodeURIComponent(evaluacion.PROGRAMA_PREDOMINANTE)}`
                        )
                      }
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200 mt-4"
                    >
                      Evaluar Docente
                    </Button>
                  </div>

                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 text-center">Información del Estudiante</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Documento</p>
                  <p className="text-base font-semibold text-gray-900">{perfil.tipo_doc} {perfil.documento}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {perfil.estado_matricula}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Semestre</p>
                  <p className="text-base font-semibold text-gray-900">{perfil.semestre}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Programa</p>
                  <p className="text-base font-semibold text-gray-900">{perfil.programa}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Periodo</p>
                  <p className="text-base font-semibold text-gray-900">{perfil.periodo}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}