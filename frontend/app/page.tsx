import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Evaluación INSITU</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bienvenido</CardTitle>
            <CardDescription>Seleccione su rol para ingresar al sistema</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/login?role=estudiante" className="w-full">
              <Button className="w-full" variant="default">
                Estudiante
              </Button>
            </Link>
            <Link href="/login?role=docente" className="w-full">
              <Button className="w-full" variant="outline">
                Docente
              </Button>
            </Link>
            <Link href="/login?role=admin" className="w-full">
              <Button className="w-full" variant="secondary">
                Administrador
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500">
          Sistema de Evaluación Docente © {new Date().getFullYear()}
          <br />
          <Link href="/usuarios-prueba" className="text-blue-600 hover:underline">
            Ver usuarios de prueba
          </Link>
        </p>
      </div>
    </div>
  )
}

