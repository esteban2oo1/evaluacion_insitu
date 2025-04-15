"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { dashboardService } from "@/lib/services/dashboard"
import { DashboardResponse } from "@/lib/types/dashboard"

export default function AdminDashboard() {
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const data = await dashboardService.getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('Error al cargar el dashboard:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarDashboard()
  }, [toast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!dashboardData) return null

  const { stats, aspectos, podio } = dashboardData

  const docentesOrdenados = [...(podio || [])].sort((a, b) => {
    const promedioA = parseFloat(a.PROMEDIO_GENERAL.toString())
    const promedioB = parseFloat(b.PROMEDIO_GENERAL.toString())
    return promedioB - promedioA
  })

  const mejoresDocentes = docentesOrdenados.slice(0, 3)
  const peoresDocentes = [...docentesOrdenados].reverse().slice(0, 3)

  const formatNumber = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return '0.0'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0.0'
    return numValue.toFixed(1)
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500"
    if (value >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <>
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-gray-900 text-gray-900 hover:bg-gray-100">
            <Download className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-gray-900 text-gray-900 hover:bg-gray-100">
              Cerrar Sesión
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-900">Total de Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{stats?.total_estudiantes || 0}</div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Evaluaciones Completadas</span>
                  <span>{stats?.evaluaciones_completadas || 0} de {stats?.total_evaluaciones || 0}</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className={`h-full ${getProgressColor((stats?.evaluaciones_completadas || 0) / (stats?.total_evaluaciones || 1) * 100)}`}
                    style={{ width: `${(stats?.evaluaciones_completadas || 0) / (stats?.total_evaluaciones || 1) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-900">Total de Docentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{stats?.total_docentes || 0}</div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Docentes Evaluados</span>
                  <span>{stats?.docentes_evaluados || 0} de {stats?.total_docentes || 0}</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className={`h-full ${getProgressColor((stats?.docentes_evaluados || 0) / (stats?.total_docentes || 1) * 100)}`}
                    style={{ width: `${(stats?.docentes_evaluados || 0) / (stats?.total_docentes || 1) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-900">Evaluaciones Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{stats?.evaluaciones_pendientes || 0}</div>
              <p className="text-sm text-gray-500">Evaluaciones por realizar</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Ranking de Docentes</CardTitle>
              <CardDescription className="text-gray-600">Lista completa de docentes evaluados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {podio?.map((docente, index) => (
                  <div 
                    key={docente.ID_DOCENTE} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{docente.DOCENTE}</h3>
                        <span className="text-lg font-bold text-gray-600">
                          {formatNumber(docente.PROMEDIO_GENERAL * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm text-gray-500">
                            {docente.evaluaciones_realizadas} de {docente.evaluaciones_esperadas} evaluaciones
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Mejor Desempeño</CardTitle>
                <CardDescription className="text-gray-600">Top docentes mejor evaluados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mejoresDocentes.map((docente, index) => (
                    <div 
                      key={docente.ID_DOCENTE} 
                      className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200"
                    >
                      <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-yellow-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{docente.DOCENTE}</h3>
                          <span className="text-lg font-bold text-yellow-600">
                            {formatNumber(docente.PROMEDIO_GENERAL * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-gray-500">
                              {docente.evaluaciones_realizadas} de {docente.evaluaciones_esperadas} evaluaciones
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Peor Desempeño</CardTitle>
                <CardDescription className="text-gray-600">Docentes con menor evaluación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {peoresDocentes.map((docente, index) => (
                    <div 
                      key={docente.ID_DOCENTE} 
                      className="flex items-center gap-4 p-4 rounded-lg bg-red-50 border border-red-200"
                    >
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-red-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{docente.DOCENTE}</h3>
                          <span className="text-lg font-bold text-red-600">
                            {formatNumber(docente.PROMEDIO_GENERAL * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-gray-500">
                              {docente.evaluaciones_realizadas} de {docente.evaluaciones_esperadas} evaluaciones
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ✅ Aspectos Evaluados con color dinámico */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Aspectos Evaluados</CardTitle>
            <CardDescription className="text-gray-600">Promedio por aspecto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aspectos?.map((aspecto) => {
                const porcentaje = aspecto.PROMEDIO_GENERAL * 100
                const progressColor = getProgressColor(porcentaje)

                return (
                  <div key={aspecto.ASPECTO} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-900">{aspecto.ASPECTO}</span>
                      <span className="text-gray-900 font-medium">{formatNumber(porcentaje)}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div 
                        className={`h-full ${getProgressColor(porcentaje)}`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
