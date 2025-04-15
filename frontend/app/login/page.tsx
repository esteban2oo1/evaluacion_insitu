"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/services/auth"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "estudiante"
  const { toast } = useToast()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login({
        user_username: username,
        user_password: password
      })

      if (response.success) {
        const profile = await authService.getProfile()
        
        // Obtener todos los roles (principal y adicionales)
        const roles = [
          profile.data.roles.principal.nombre.toLowerCase(),
          ...profile.data.roles.adicionales.map(rol => rol.nombre.toLowerCase())
        ]

        let redirectPath = ""
        
        // Verificar si tiene rol de admin o director de programa (en cualquier posición)
        if (roles.includes("admin") || roles.includes("director de programa")) {
          redirectPath = "/admin/dashboard"
        } else {
          // Si no es admin, usar el rol principal
          const userRole = profile.data.roles.principal.nombre.toLowerCase()
          switch (userRole) {
            case "estudiante":
              redirectPath = "/estudiante/dashboard"
              break
            case "docente":
              redirectPath = "/docente/dashboard"
              break
            default:
              toast({
                title: "Error",
                description: "Rol de usuario no reconocido",
                variant: "destructive",
              })
              return
          }
        }

        router.replace(redirectPath)
      }
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.response?.data?.message || "Error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl bg-white shadow-md rounded-xl overflow-hidden">
        {/* Logo a la izquierda */}
        <div className="hidden md:flex items-center justify-center bg-white w-1/2">
          <img
            src="https://sibcolombia.net/wp-content/uploads/2017/08/logo-itp.png"
            alt="Logo ITP"
            className="w-80 h-90"
          />
        </div>

        {/* Login Form a la derecha */}
        <div className="w-full md:w-1/2 p-6">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">Iniciar sesión</CardTitle>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <Input
                id="username"
                placeholder="Número de Cédula"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col pt-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </CardFooter>
          </form>
        </div>
      </div>
    </div>
  )
}
