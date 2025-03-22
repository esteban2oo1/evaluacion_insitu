"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "estudiante"
  const { toast } = useToast()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Usuarios de prueba
  const testUsers = {
    estudiante: { cedula: "1098765432", enrolled: true, name: "Carlos Martínez" },
    docente: { cedula: "1087654321", name: "Juan Pérez" },
    admin: { cedula: "1076543210", name: "Ana Gómez" },
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)

      if (role === "estudiante") {
        // Verificar si es el estudiante de prueba
        if (username === testUsers.estudiante.cedula) {
          if (testUsers.estudiante.enrolled) {
            router.push("/estudiante/dashboard")
          } else {
            toast({
              title: "Error de matrícula",
              description: "Tu matrícula no está activa. Por favor, matricúlate de inmediato.",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Error de autenticación",
            description: "Cédula o contraseña incorrecta.",
            variant: "destructive",
          })
        }
      } else if (role === "docente") {
        if (username === testUsers.docente.cedula) {
          router.push("/docente/dashboard")
        } else {
          toast({
            title: "Error de autenticación",
            description: "Cédula o contraseña incorrecta.",
            variant: "destructive",
          })
        }
      } else if (role === "admin") {
        if (username === testUsers.admin.cedula) {
          router.push("/admin/dashboard")
        } else {
          toast({
            title: "Error de autenticación",
            description: "Cédula o contraseña incorrecta.",
            variant: "destructive",
          })
        }
      }
    }, 1000)
  }

  const roleTitle = {
    estudiante: "Estudiante",
    docente: "Docente",
    admin: "Administrador",
  }[role]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión como {roleTitle}</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Número de Cédula</Label>
              <Input
                id="username"
                placeholder="Ej: 1098765432"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
            <p className="mt-4 text-sm text-center text-gray-500">
              ¿Problemas para acceder? Contacte al administrador del sistema.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

