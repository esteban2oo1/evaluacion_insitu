"use client"

import type React from "react"
import { AdminSidebar } from "./components/admin-sidebar"
import { useSidebar } from "@/hooks/useSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isCollapsed, toggle } = useSidebar()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        onToggle={toggle} 
      />
      
      {/* Contenido principal - Añadido margin-left para compensar el sidebar fijo */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      } ml-0 min-h-screen`}>
        <div className="flex-1 p-4 lg:p-0">
          {children}
        </div>
      </main>
    </div>
  )
}