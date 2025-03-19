import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Sistema de Evaluación Docente</h1>
          <p className="text-gray-500 md:text-lg">Plataforma para la evaluación institucional del desempeño docente</p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <p className="text-sm text-gray-500">
            Accede con tus credenciales institucionales para realizar la evaluación docente
          </p>
        </div>
      </div>
    </div>
  );
}

