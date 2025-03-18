"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo
const PROGRAMAS = [
  { id: "1", nombre: "Ingeniería de Sistemas" },
  { id: "2", nombre: "Administración de Empresas" },
  { id: "3", nombre: "Psicología" },
  { id: "4", nombre: "Derecho" },
]

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
  }, [router])

  const handleEvaluarAsignatura = (asignatura) => {
    const programaNombre = PROGRAMAS.find((p) => p.id === user.programa)?.nombre || "No asignado"

    sessionStorage.setItem("evaluacion", JSON.stringify({
      programa: programaNombre,
      profesor: asignatura.docenteNombre,
      materia: asignatura.nombre,
      periodo: "2025-1",
    }))

    router.push("/evaluacion")
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bienvenido, {user.name}</h1>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>

        {/* Información del estudiante */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Información del Estudiante</CardTitle>
            <CardDescription>Datos de tu matrícula y programa académico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Matrícula</Label>
                <p className="font-medium">{user.matricula}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Estado</Label>
                <div className="flex items-center gap-2">
                  {user.matriculado ? (
                    <Badge className="bg-green-500">Matriculado</Badge>
                  ) : (
                    <Badge variant="destructive">No Matriculado</Badge>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Semestre</Label>
                <p className="font-medium">{user.semestre}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Programa</Label>
                <p className="font-medium">{PROGRAMAS.find((p) => p.id === user.programa)?.nombre || "No asignado"}</p>
              </div>
            </div>

            {!user.matriculado && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atención</AlertTitle>
                <AlertDescription>
                  No estás matriculado actualmente. Por favor, completa tu proceso de matrícula para acceder a todas las
                  funcionalidades.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Asignaturas del estudiante */}
        {user.matriculado ? (
          user.asignaturas && user.asignaturas.length > 0 ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Tus Asignaturas</CardTitle>
                <CardDescription>Selecciona una asignatura para evaluar al docente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.asignaturas.map((asignatura) => (
                    <div
                      key={asignatura.id}
                      className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg">{asignatura.nombre}</h3>
                          <p className="text-muted-foreground">Docente: {asignatura.docenteNombre}</p>
                        </div>
                        <Button onClick={() => handleEvaluarAsignatura(asignatura)}>Evaluar Docente</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="text-blue-800">No hay asignaturas</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    No tienes asignaturas registradas para este semestre. Si crees que esto es un error, contacta a la
                    oficina de registro.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-800">Matrícula requerida</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Debes completar tu proceso de matrícula para poder ver y evaluar tus asignaturas.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

