"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos simulados de estudiantes
const ESTUDIANTES = {
  "estudiante@estudiante.edu": {
    id: "12345",
    email: "estudiante@estudiante.edu",
    name: "Carlos Martínez",
    matricula: "EST2023-789",
    matriculado: true,
    semestre: "4",
    programa: "1", // ID del programa (Ingeniería de Sistemas)
    asignaturas: [
      { id: "asig1", nombre: "Programación I", docenteId: "1", docenteNombre: "Juan Pérez" },
      { id: "asig2", nombre: "Bases de Datos", docenteId: "1", docenteNombre: "Juan Pérez" },
      { id: "asig3", nombre: "Algoritmos", docenteId: "2", docenteNombre: "María López" },
    ],
  },
  "nomastriculado@estudiante.edu": {
    id: "67890",
    email: "nomastriculado@estudiante.edu",
    name: "Ana Gómez",
    matricula: "EST2023-456",
    matriculado: false,
    semestre: "3",
    programa: "2", // ID del programa (Administración de Empresas)
    asignaturas: [],
  },
}

// Datos de administradores
const ADMINISTRADORES = {
  "admin@institucion.edu": {
    id: "admin1",
    email: "admin@institucion.edu",
    name: "Administrador del Sistema",
    role: "admin",
  },
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("estudiante")
  const [email, setEmail] = useState(
    activeTab === "estudiante" ? "estudiante@estudiante.edu" : "admin@institucion.edu"
  )
  const [password, setPassword] = useState("123456")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Actualizar email cuando cambia la pestaña
  const handleTabChange = (value) => {
    setActiveTab(value)
    setEmail(
      value === "estudiante" ? "estudiante@estudiante.edu" : "admin@institucion.edu"
    )
    setPassword("123456")
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulación de autenticación
    setTimeout(() => {
      if (activeTab === "estudiante") {
        if (email.endsWith("@estudiante.edu") && password.length >= 6) {
          // Obtener datos del estudiante (simulado)
          const estudianteData = ESTUDIANTES[email] || {
            id: "default",
            email,
            name: "Estudiante Demo",
            matricula: "EST-DEFAULT",
            matriculado: true,
            semestre: "1",
            programa: "1",
            asignaturas: [],
          }

          // Almacenar información del usuario en sessionStorage
          sessionStorage.setItem("user", JSON.stringify(estudianteData))
          router.push("/dashboard")
        } else {
          setError("Credenciales inválidas. Asegúrate de usar tu correo institucional.")
        }
      } else if (activeTab === "admin") {
        if (email === "admin@institucion.edu" && password === "123456") {
          // Almacenar información del administrador
          sessionStorage.setItem("user", JSON.stringify(ADMINISTRADORES[email]))
          router.push("/admin/dashboard")
        } else {
          setError("Credenciales de administrador incorrectas.")
        }
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder al sistema de evaluación</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="estudiante"
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="estudiante">Estudiante</TabsTrigger>
              <TabsTrigger value="admin">Administrador</TabsTrigger>
            </TabsList>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              {activeTab === "estudiante" ? (
                <>
                  <strong>Usuarios de demostración:</strong>
                  <br />
                  <strong>Estudiante matriculado:</strong>
                  <br />
                  Email: estudiante@estudiante.edu
                  <br />
                  Contraseña: 123456
                  <br />
                  <br />
                  <strong>Estudiante no matriculado:</strong>
                  <br />
                  Email: nomastriculado@estudiante.edu
                  <br />
                  Contraseña: 123456
                </>
              ) : (
                <>
                  <strong>Administrador:</strong>
                  <br />
                  Email: admin@institucion.edu
                  <br />
                  Contraseña: 123456
                </>
              )}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder={activeTab === "estudiante" ? "estudiante@estudiante.edu" : "admin@institucion.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">Para soporte técnico, contacta a soporte@institucion.edu</p>
        </CardFooter>
      </Card>
    </div>
  );
}

