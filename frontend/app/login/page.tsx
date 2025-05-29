"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/services/auth"
import { UserRound, Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "estudiante"
  const { toast } = useToast()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Cargar usuario recordado
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername")
    if (savedUsername) {
      setUsername(savedUsername)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login({
        user_username: username,
        user_password: password,
      })

      if (response.success) {
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username)
        } else {
          localStorage.removeItem("rememberedUsername")
        }

        const profile = await authService.getProfile()

        const roles = [
          profile.data.roles.principal.nombre.toLowerCase(),
          ...profile.data.roles.adicionales.map((rol) => rol.nombre.toLowerCase()),
        ]

        let redirectPath = ""

        if (roles.includes("admin") || roles.includes("director de programa")) {
          redirectPath = "/admin/dashboard"
        } else {
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

        toast({
          title: response.message,
          description: `Bienvenido, ${profile.data.nombre_completo}`,
        })

        setTimeout(() => {
          router.replace(redirectPath)
        }, 1800)
      }
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-md rounded-xl overflow-hidden">
        
        {/* Logo adaptable */}
        <div className="flex items-center justify-center bg-white w-full md:w-1/2 p-4">
          <img
            src="https://sibcolombia.net/wp-content/uploads/2017/08/logo-itp.png"
            alt="Logo ITP"
            className="w-2/3 md:w-80"
          />
        </div>

        {/* Formulario de Login */}
        <div className="w-full md:w-1/2 md:p-6 flex flex-col justify-center">
          <CardHeader className="text-center mb-2">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
              <LogIn size={24} />
              Evaluaciones Académicas
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              Solo para estudiantes <strong>admitidos</strong> y <strong>matriculados</strong>.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin} className="w-full">
            <CardContent className="space-y-4">
              <div className="relative">
                <UserRound className="absolute left-3 top-3 text-gray-500" size={18} />
                <Input
                  id="username"
                  placeholder="Número de Cédula"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
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

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="accent-blue-600"
                  />
                  Recordarme
                </label>
                <a
                  href="https://sigedin.itp.edu.co/estudiantes/ctrl_recoverpassword/ctrl_recoverpassword.php"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Accediendo..." : "Acceder"}
              </Button>
              <p className="text-xs text-center text-gray-500 pt-4">
                ¿Problemas para ingresar? Contacta a{" "}
                <a
                  href="mailto:registroycontrol@itp.edu.co"
                  className="text-blue-600 underline"
                >
                  registroycontrol@itp.edu.co
                </a>
              </p>
            </CardFooter>
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} Instituto Tecnológico del Putumayo – Todos los derechos reservados
      </footer>
    </div>
  )
}
