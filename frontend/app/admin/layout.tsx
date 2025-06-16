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
      
      {/* Contenido principal */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:ml-0' : 'lg:ml-0'
      } ml-0`}>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}