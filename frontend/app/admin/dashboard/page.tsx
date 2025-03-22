"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download } from "lucide-react"

// Datos simulados
const adminData = {
  totalEvaluations: 79,
  averageScore: 84,
  evaluatedTeachers: 5,
  bestTeacher: {
    name: "María López",
    department: "Ingeniería de Sistemas",
    score: 91,
  },
  worstTeacher: {
    name: "Carlos Rodríguez",
    department: "Administración de Empresas",
    score: 74,
  },
  aspects: [
    { name: "Dominio del tema", score: 87 },
    { name: "Cumplimiento", score: 82 },
    { name: "Calidad", score: 85 },
    { name: "Puntualidad", score: 79 },
    { name: "Metodología", score: 88 },
  ],
}

export default function AdminDashboard() {
  return (
    <>
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm">
              Cerrar Sesión
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Evaluaciones Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{adminData.totalEvaluations}</div>
              <p className="text-sm text-gray-500">Evaluaciones realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Promedio General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{adminData.averageScore}%</div>
              <Progress value={adminData.averageScore} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profesores Evaluados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{adminData.evaluatedTeachers}</div>
              <p className="text-sm text-gray-500">Docentes con evaluaciones</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mejor Desempeño</CardTitle>
                <CardDescription>Profesor con la mejor evaluación promedio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-green-600">{adminData.bestTeacher.score}%</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{adminData.bestTeacher.name}</h3>
                    <p className="text-sm text-gray-500">{adminData.bestTeacher.department}</p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Ver detalles
                    </Button>
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
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-red-600">{adminData.worstTeacher.score}%</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{adminData.worstTeacher.name}</h3>
                    <p className="text-sm text-gray-500">{adminData.worstTeacher.department}</p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Aspectos Mejor Evaluados</CardTitle>
              <CardDescription>Promedio general por cada aspecto evaluado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminData.aspects.map((aspect) => (
                  <div key={aspect.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span>{aspect.name}</span>
                      <span>{aspect.score}%</span>
                    </div>
                    <Progress value={aspect.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

