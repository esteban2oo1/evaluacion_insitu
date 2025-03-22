"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function InformesPage() {
  // Datos simulados
  const reports = [
    { id: 1, name: "Reporte General por Programa", description: "Consolidado de evaluaciones por programa académico" },
    { id: 2, name: "Reporte por Docente", description: "Evaluaciones detalladas por docente" },
    { id: 3, name: "Reporte por Semestre", description: "Consolidado de evaluaciones por semestre" },
    { id: 4, name: "Reporte de Aspectos", description: "Análisis de aspectos mejor y peor evaluados" },
    { id: 5, name: "Reporte Histórico", description: "Comparativa de evaluaciones en diferentes periodos" },
  ]

  return (
    <>
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Informes</h1>
        <p className="text-sm text-gray-500">Descarga de informes específicos</p>
      </header>

      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Informes Disponibles</CardTitle>
            <CardDescription>Descargue informes específicos del sistema de evaluación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

