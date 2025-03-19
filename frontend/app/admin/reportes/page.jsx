"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText } from "lucide-react"
import { PROGRAMAS } from "@/lib/data"

export default function ReportesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reportes por Programa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROGRAMAS.map((programa) => (
          <Link href={`/admin/reportes/${programa.id}`} key={programa.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {programa.nombre}
                </CardTitle>
                <CardDescription>Evaluaciones y estadísticas</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">10 semestres disponibles</div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

