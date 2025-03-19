"use client";
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, FileText, Home, LogOut, Menu, MessageSquare, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrador
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/login")
      return
    }

    setUser(parsedUser)

    // Detectar si es dispositivo móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    };
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    router.push("/login")
  }

  // Modificar el componente NavItem para evitar renderizado condicional problemático
  const NavItem = ({
    href,
    icon: Icon,
    children
  }) => {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        onClick={() => isMobile && setIsSidebarOpen(false)}>
        <Icon className="h-4 w-4" />
        <span className={isSidebarOpen ? "" : "lg:hidden"}>{children}</span>
      </Link>
    );
  }

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Overlay para móvil */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 flex h-full w-72 flex-col border-r bg-white transition-transform lg:relative lg:z-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}>
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className={isSidebarOpen ? "font-semibold" : "lg:hidden font-semibold"}>Panel Administrativo</span>
          </div>
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2"
              onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <NavItem href="/admin/dashboard" icon={Home}>
              Dashboard
            </NavItem>
            <NavItem href="/admin/reportes" icon={FileText}>
              Reportes
            </NavItem>
            <NavItem href="/admin/profesores" icon={Users}>
              Profesores
            </NavItem>
            <NavItem href="/admin/comentarios" icon={MessageSquare}>
              Comentarios
            </NavItem>
          </nav>
        </div>
        <div className="border-t p-4">
          <div className={isSidebarOpen ? "" : "lg:hidden"}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {!isSidebarOpen && (
            <div className="hidden lg:block">
              <Button variant="ghost" size="icon" className="w-full" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </aside>
      {/* Botón para abrir sidebar en móvil */}
      {isMobile && !isSidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {/* Contenido principal */}
      <main
        className={cn(
          "flex-1 overflow-auto p-4 transition-all",
          isMobile ? "pt-16" : "",
          !isMobile && isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
        )}>
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

