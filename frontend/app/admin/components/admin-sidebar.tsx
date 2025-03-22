"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, FileText, Users, FileCode, Download, Settings } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Panel Administrativo
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/admin/dashboard"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/dashboard") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BarChart className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/profesores"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/profesores") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Profesores
            </Link>
          </li>
          <li>
            <Link
              href="/admin/reportes"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/reportes") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              Reportes
            </Link>
          </li>
          <li>
            <Link
              href="/admin/formulario"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/formulario") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileCode className="h-5 w-5 mr-3" />
              Formulario INSITU
            </Link>
          </li>
          <li>
            <Link
              href="/admin/informes"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/informes") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Download className="h-5 w-5 mr-3" />
              Informes
            </Link>
          </li>
          <li>
            <Link
              href="/admin/configuracion"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/configuracion") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Configuración
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="text-sm">
          <p className="font-medium">Ana Gómez</p>
          <p className="text-gray-500 text-xs">Cédula: 1076543210</p>
          <p className="text-gray-500 text-xs">admin@institucion.edu</p>
        </div>
      </div>
    </div>
  )
}

