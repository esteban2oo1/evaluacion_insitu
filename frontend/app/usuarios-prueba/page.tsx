import UsuariosPrueba from "../components/usuarios-prueba"

export default function UsuariosPruebaPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Sistema de Evaluación INSITU</h1>
        <UsuariosPrueba />
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}

