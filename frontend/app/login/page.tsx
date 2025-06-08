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
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [loginStage, setLoginStage] = useState<'idle' | 'loading' | 'success' | 'redirecting'>('idle')

  // Cargar usuario recordado y activar animaciones
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername")
    if (savedUsername) {
      setUsername(savedUsername)
      setRememberMe(true)
    }
    
    setTimeout(() => setIsPageLoaded(true), 100)
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
              redirectPath = "/estudiante/bienvenida"
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
            setLoginStage('redirecting')
          }, 500)

          setTimeout(() => {
            router.replace(redirectPath)
          }, 1200)
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
      
      {/* Contenedor principal con animación de entrada */}
      <div className={`flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden transform transition-all duration-700 ease-out ${
        isPageLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        
        {/* Logo adaptable con animación */}
        <div className={`flex items-center justify-center bg-white w-full md:w-1/2 p-4 transition-all duration-500 delay-200 ease-out ${
          isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
        }`}>
          <img
            src="https://sibcolombia.net/wp-content/uploads/2017/08/logo-itp.png"
            alt="Logo ITP"
            className="w-2/3 md:w-80 transform hover:scale-105 transition-transform duration-300 ease-out"
          />
        </div>

        {/* Formulario de Login con animación */}
        <div className={`w-full md:w-1/2 md:p-6 flex flex-col justify-center transition-all duration-500 delay-400 ease-out ${
          isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
        }`}>
          
          <CardHeader className="text-center mb-2">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 transform hover:scale-105 transition-transform duration-200">
              <LogIn size={24} />
              Evaluaciones Académicas
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              Solo para estudiantes{" "}
              <span className="hover:scale-105 transition-transform duration-200 inline-block">
                <strong>admitidos</strong>
              </span>{" "}
              y{" "}
              <span className="hover:scale-105 transition-transform duration-200 inline-block">
                <strong>matriculados</strong>
              </span>.
            </CardDescription>

          </CardHeader>

          <form onSubmit={handleLogin} className="w-full">
            <CardContent className="space-y-4">
              
              {/* Campo de usuario */}
              <div className="relative group">
                <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-gray-700 transition-colors duration-200 z-10 pointer-events-none " size={18} />
                <Input
                  id="username"
                  placeholder="Documento"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 hover:border-gray-400 transition-all duration-200 transform focus:scale-[1.01] relative"
                />
              </div>

              {/* Campo de contraseña */}
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 hover:border-gray-400 transition-all duration-200 transform focus:scale-[1.01]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:text-gray-700 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 rounded"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer group">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="accent-blue-600 transform group-hover:scale-110 transition-transform duration-200"
                  />
                  
                  {/* Span */}
                  <span className="group-hover:text-gray-800 transition-colors duration-200 group-hover:scale-105 transition-transform duration-200 inline-block">
                    Recordarme
                  </span>
                </label>
                
                <a
                  href="https://sigedin.itp.edu.co/estudiantes/ctrl_recoverpassword/ctrl_recoverpassword.php"
                  className="text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-105 transition-transform duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-4">
              <Button 
                className="w-full transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-md hover:shadow-lg disabled:transform-none disabled:hover:scale-100" 
                type="submit" 
                disabled={loginStage !== 'idle'}
              >
                {loginStage === 'loading' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verificando...
                  </div>
                )}
                {loginStage === 'success' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-green-500">✓</div>
                    ¡Bienvenido!
                  </div>
                )}
                {loginStage === 'redirecting' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Redirigiendo...
                  </div>
                )}
                {loginStage === 'idle' && "Acceder"}
              </Button>
              
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                <p className="text-xs text-center text-gray-500">
                  ¿Problemas para ingresar? Contacta a{" "}
                  <a
                    href="mailto:registroycontrol@itp.edu.co"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200 inline-block hover:scale-105 transform duration-900"
                  >
                    registroycontrol@itp.edu.co
                  </a>
                </p>
              </div>

            </CardFooter>
          </form>
        </div>
      </div>

      <footer className={`text-center text-xs text-gray-400 mt-6 transition-all duration-700 delay-600 ease-out ${
        isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        © {new Date().getFullYear()} Instituto Tecnológico del Putumayo – Todos los derechos reservados
      </footer>
    </div>
  )
}
