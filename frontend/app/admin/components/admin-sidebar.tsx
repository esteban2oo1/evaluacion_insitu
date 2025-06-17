"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart, FileText, Users, FileCode, Download, ChevronRight, Star, X, LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { authService } from "@/lib/services/auth"
import { PerfilEstudiante, PerfilDocente } from "@/lib/types/auth"

interface AdminSidebarProps {
  isCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Estados para el perfil de estudiante y docente
  const [perfilEstudiante, setPerfilEstudiante] = useState<PerfilEstudiante | null>(null)
  const [perfilDocente, setPerfilDocente] = useState<PerfilDocente | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setIsLoading(true)
        const response = await authService.getProfile()
        if (response.success) {
          // Verificamos si es estudiante o docente y seteamos el perfil adecuado
          if (response.data.tipo === "estudiante") {
            const perfilData = response.data as PerfilEstudiante
            setPerfilEstudiante(perfilData)
          } else if (response.data.tipo === "docente") {
            const perfilData = response.data as PerfilDocente
            setPerfilDocente(perfilData)
          } else {
            toast({
              title: "Error",
              description: "Tipo de usuario no reconocido.",
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Error",
            description: "No se pudo cargar el perfil.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un problema al cargar el perfil.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    cargarPerfil()
  }, [toast])

  // Cerrar sidebar móvil cuando cambie la ruta
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Cerrar sidebar móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const toggleButton = document.getElementById('mobile-toggle')
      
      if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node) && 
          toggleButton && !toggleButton.contains(event.target as Node)) {
        setIsMobileOpen(false)
      }
    }

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden' // Prevenir scroll en móvil
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileOpen])

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleToggleDesktop = () => {
    onToggle?.(!isCollapsed)
  }

  const handleToggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Llamar al servicio de logout
      authService.logout()
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
        variant: "default",
      })
      
      // Redirigir a la página de login
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar la sesión.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Definir el perfil a mostrar dependiendo de los estados
  const mostrarPerfil = perfilEstudiante ? perfilEstudiante : perfilDocente

  const menuItems = [
    {
      href: "/admin/dashboard",
      icon: BarChart,
      label: "Dashboard",
      description: "Panel principal"
    },
    {
      href: "/admin/profesores",
      icon: Users,
      label: "Profesores",
      description: "Gestión docentes"
    },
    {
      href: "/admin/roles",
      icon: Star,
      label: "Roles",
      description: "Permisos usuario"
    },
    {
      href: "/admin/formulario",
      icon: FileCode,
      label: "Formulario",
      description: "Crear formularios"
    }
  ]

  // Componente del contenido del sidebar
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Header */}
      <div className={`${isCollapsed && !isMobile ? 'p-4' : 'p-6'} border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0`}>
        <div className="animate-fade-in-down flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={isMobile ? handleToggleMobile : handleToggleDesktop}
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
              title={isMobile ? "Cerrar menú" : (isCollapsed ? "Expandir sidebar" : "Contraer sidebar")}
            >
              <BarChart className="h-5 w-5 text-white" />
            </button>
            {(!isCollapsed || isMobile) && (
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin</h1>
              </div>
            )}
          </div>
          
          {/* Botón de cierre adicional para móvil */}
          {isMobile && (
            <button
              onClick={handleToggleMobile}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation - Ahora con flex-1 y overflow para ser scrolleable */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="animate-fade-in-up">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <div
                key={item.href}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link
                  href={item.href}
                  className={`group relative flex items-center ${
                    isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'
                  } rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] ${
                    active 
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                >
                  {/* Indicador activo */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full animate-slide-in-left" />
                  )}
                  
                  {/* Icono */}
                  <div className={`flex-shrink-0 transition-all duration-300 ${
                    active ? "transform scale-110" : "group-hover:transform group-hover:scale-105"
                  } ${isCollapsed && !isMobile ? '' : 'mr-3'}`}>
                    <Icon className={`h-5 w-5 transition-colors duration-300 ${
                      active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                    }`} />
                  </div>
                  
                  {/* Contenido del texto */}
                  {(!isCollapsed || isMobile) && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm transition-colors duration-300 ${
                          active ? "text-blue-800" : "text-gray-700 group-hover:text-gray-900"
                        }`}>
                          {item.label}
                        </p>
                        <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                          active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-600"
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Chevron indicador */}
                      <ChevronRight className={`h-4 w-4 transition-all duration-300 ${
                        active 
                          ? "text-blue-600 transform translate-x-1 opacity-100" 
                          : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                      }`} />
                    </>
                  )}
                </Link>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer del perfil con botón de cerrar sesión */}
      <div className={`${isCollapsed && !isMobile ? 'p-2' : 'p-4'} border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0`}>
        <div className="animate-fade-in-up animation-delay-500 space-y-3">
          {/* Información del perfil */}
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              {(!isCollapsed || isMobile) && <div className="h-3 bg-gray-200 rounded w-3/4"></div>}
            </div>
          ) : mostrarPerfil ? (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md ${
              isCollapsed && !isMobile ? 'p-2' : 'p-3'
            }`}>
              <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
                <div className="flex-shrink-0">
                  <div className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm ${
                    isCollapsed && !isMobile ? 'w-8 h-8' : 'w-10 h-10'
                  }`}>
                    <span className={`text-white font-semibold ${isCollapsed && !isMobile ? 'text-xs' : 'text-sm'}`}>
                      {mostrarPerfil.nombre_completo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {(!isCollapsed || isMobile) && (
                  <div className="flex-1 min-w-0">
                    {mostrarPerfil.nombre_completo.length > 24 ? (
                      <div className="marquee-container">
                        <div className="marquee-content font-semibold text-sm text-gray-800">
                          <span className="marquee-text">{mostrarPerfil.nombre_completo}</span>
                          <span className="marquee-text">{mostrarPerfil.nombre_completo}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {mostrarPerfil.nombre_completo}
                      </p>
                    )}

                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Admin
                      </span>
                      <p className="text-xs text-gray-500 truncate">
                        {mostrarPerfil.documento}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            !isCollapsed || isMobile ? (
              <div className="text-center text-gray-500 text-sm">
                <p>Perfil no disponible</p>
              </div>
            ) : null
          )}

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full group relative flex items-center ${
              isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'
            } rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            title={isCollapsed && !isMobile ? "Cerrar sesión" : undefined}
          >
            {/* Icono */}
            <div className={`flex-shrink-0 transition-all duration-300 group-hover:transform group-hover:scale-105 ${
              isCollapsed && !isMobile ? '' : 'mr-3'
            }`}>
              <LogOut className={`h-5 w-5 transition-colors duration-300 ${
                isLoggingOut ? 'animate-spin' : ''
              }`} />
            </div>
            
            {/* Contenido del texto */}
            {(!isCollapsed || isMobile) && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm transition-colors duration-300">
                    {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
                  </p>
                  <p className="text-xs mt-0.5 transition-colors duration-300 text-red-500 group-hover:text-red-600">
                    Salir del sistema
                  </p>
                </div>
                
                {/* Chevron indicador */}
                <ChevronRight className="h-4 w-4 transition-all duration-300 text-red-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Botón toggle móvil - usando BarChart */}
      <button
        id="mobile-toggle"
        onClick={handleToggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg border border-blue-200 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
        title="Abrir menú"
      >
        <BarChart className="h-5 w-5 text-white" />
      </button>

      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50 transition-opacity duration-300" />
      )}

      {/* Sidebar móvil */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 lg:hidden bg-white border-r border-gray-200 flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } w-80 h-screen`}
      >
        <SidebarContent isMobile={true} />
      </div>

      {/* Sidebar desktop - Cambiado de min-h-screen a h-screen y añadido fixed */}
      <div className={`hidden lg:flex bg-white border-r border-gray-200 h-screen flex-col shadow-sm transition-all duration-300 ease-in-out fixed left-0 top-0 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <SidebarContent />
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx global>{`
        /* Animación marquee mejorada */
        .marquee-container {
          width: 160px;
          overflow: hidden;
          position: relative;
          mask: linear-gradient(90deg, transparent, white 20px, white calc(100% - 20px), transparent);
          -webkit-mask: linear-gradient(90deg, transparent, white 20px, white calc(100% - 20px), transparent);
        }

        .marquee-content {
          display: flex;
          animation: scroll-smooth 12s linear infinite;
          width: max-content;
        }

        .marquee-text {
          padding-right: 40px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        @keyframes scroll-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        /* Prevenir scroll horizontal en móvil */
        @media (max-width: 1024px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </>
  )
}