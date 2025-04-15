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

interface ReporteEvaluaciones {
  total_materias: number
  evaluaciones_completadas: number
  materias_pendientes: number
  porcentaje_completado: string
}

export default function EstudianteDashboard() {
  const { toast } = useToast()
  const [perfil, setPerfil] = useState<PerfilEstudiante | null>(null)
  const [materias, setMaterias] = useState<MateriaEstudiante[]>([])
  const [reporte, setReporte] = useState<ReporteEvaluaciones | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

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
            const reporteResponse = await api.get(`/reportes/estudiantes/${perfilData.documento}`)
            if (reporteResponse.data) {
              setReporte(reporteResponse.data[0])
            }
          } catch (error) {
            console.error('Error al cargar el reporte:', error)
            toast({
              title: "Error",
              description: "No se pudo cargar el reporte de evaluaciones",
              variant: "destructive",
            })
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

    cargarPerfil()
  }, [toast])

  const handleEvaluarDocente = (id: number) => {
    // Redirigir a la página de evaluación
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
          <h1 className="text-xl font-bold text-gray-900">{perfil.nombre_completo}</h1>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="border-gray-900 text-gray-900 hover:bg-gray-100">
            Cerrar Sesión
          </Button>
        </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materias.map((materia) => (
                <div
                  key={materia.id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{materia.nombre}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Docente</p>
                        <p className="text-base font-semibold text-gray-900">{materia.docente.nombre}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleEvaluarDocente(materia.id)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200 mt-4"
                  >
                    Evaluar Docente
                  </Button>
                </div>
              ))}
            </div>
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

