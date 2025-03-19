"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Layers } from "lucide-react"
import { PROGRAMAS } from "@/lib/data"

// Generar semestres (10 semestres)
const SEMESTRES = Array.from({ length: 10 }, (_, i) => ({
  id: (i + 1).toString(),
  nombre: `Semestre ${i + 1}`,
  periodo: "2025-1",
}))

export default function ProgramaPage() {
  const params = useParams()
  const router = useRouter()
  const [programa, setPrograma] = useState(null)

  // Modificar el useEffect para evitar problemas con el manejo de estados
  useEffect(() => {
    const fetchData = () => {
      const programaEncontrado = PROGRAMAS.find((p) => p.id === params.programaId)
      if (!programaEncontrado) {
        router.push("/admin/reportes")
        return
      }
      setPrograma(programaEncontrado)
    }

    fetchData()
  }, [params.programaId, router])

  if (!programa) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/reportes">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a Reportes
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-2">{programa.nombre}</h1>
      <p className="text-muted-foreground mb-6">Selecciona un semestre para ver el consolidado de evaluaciones</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEMESTRES.map((semestre) => (
          <Link href={`/admin/reportes/${programa.id}/${semestre.id}`} key={semestre.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  {semestre.nombre}
                </CardTitle>
                <CardDescription>Periodo {semestre.periodo}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Ver evaluaciones</div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

