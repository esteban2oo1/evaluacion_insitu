"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Datos simulados
const studentData = {
  name: "Carlos Martínez",
  cedula: "1098765432",
  matricula: "EST2023-789",
  estado: "Matriculado",
  semestre: "4",
  programa: "Ingeniería de Sistemas",
  asignaturas: [
    { id: 1, nombre: "Programación I", docente: "Juan Pérez", evaluado: false },
    { id: 2, nombre: "Bases de Datos", docente: "Juan Pérez", evaluado: false },
    { id: 3, nombre: "Algoritmos", docente: "María López", evaluado: false },
  ],
}

export default function EstudianteDashboard() {
  const { toast } = useToast()
  const [asignaturas, setAsignaturas] = useState(studentData.asignaturas)

  const handleEvaluarDocente = (id: number) => {
    // Redirigir a la página de evaluación
    window.location.href = `/estudiante/evaluar/${id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">Bienvenido, {studentData.name}</h1>
        <Link href="/">
          <Button variant="outline" size="sm">
            Cerrar Sesión
          </Button>
        </Link>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información del Estudiante</CardTitle>
            <CardDescription>Datos de tu matrícula y programa académico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cédula</p>
                <p className="font-medium">{studentData.cedula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Matrícula</p>
                <p className="font-medium">{studentData.matricula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <Badge variant="outline" className="bg-green-500 text-white">
                  {studentData.estado}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semestre</p>
                <p className="font-medium">{studentData.semestre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Programa</p>
                <p className="font-medium">{studentData.programa}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tus Asignaturas</CardTitle>
            <CardDescription>Selecciona una asignatura para evaluar al docente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {asignaturas.map((asignatura) => (
                <div
                  key={asignatura.id}
                  className="p-4 border rounded-lg bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-medium">{asignatura.nombre}</h3>
                    <p className="text-sm text-gray-500">Docente: {asignatura.docente}</p>
                  </div>
                  <Button
                    onClick={() => handleEvaluarDocente(asignatura.id)}
                    variant={asignatura.evaluado ? "outline" : "default"}
                    className={asignatura.evaluado ? "bg-green-500 text-white hover:bg-green-600" : ""}
                    disabled={asignatura.evaluado}
                  >
                    {asignatura.evaluado ? "Evaluado" : "Evaluar Docente"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

