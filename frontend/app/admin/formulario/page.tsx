"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormContext } from "@/lib/form-context"
import { useToast } from "@/hooks/use-toast"

export default function FormularioPage() {
  const { toast } = useToast()
  const [isFormActive, setIsFormActive] = useState(true)
  const [expirationDate, setExpirationDate] = useState("2025-06-30")
  const { aspects, toggleAspectActive } = useFormContext()

  // Función para manejar el cambio de estado de un aspecto
  const handleToggleAspect = (id: number) => {
    toggleAspectActive(id)

    // Mostrar notificación
    const aspect = aspects.find((a) => a.id === id)
    if (aspect) {
      toast({
        title: `Aspecto ${aspect.active ? "desactivado" : "activado"}`,
        description: `El aspecto "${aspect.name}" ha sido ${aspect.active ? "desactivado" : "activado"}.`,
      })
    }
  }

  return (
    <>
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Formulario INSITU</h1>
        <p className="text-sm text-gray-500">Configuración del formulario de evaluación</p>
      </header>

      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Formulario INSITU</CardTitle>
            <CardDescription>Administre los aspectos a evaluar y la disponibilidad del formulario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Estado del Formulario</h3>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isFormActive}
                        onChange={() => setIsFormActive(!isFormActive)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium">{isFormActive ? "Activo" : "Inactivo"}</span>
                    </label>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium mb-2">Fecha de Caducidad</h3>
                  <input
                    type="date"
                    className="p-2 border rounded-md w-full"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Aspectos a Evaluar</h3>
                <div className="space-y-4">
                  {aspects.map((aspect) => (
                    <div key={aspect.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer mr-3">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={aspect.active}
                            onChange={() => handleToggleAspect(aspect.id)}
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <span>{aspect.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Button>Agregar Nuevo Aspecto</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

