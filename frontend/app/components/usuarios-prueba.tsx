import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsuariosPrueba() {
  const testUsers = [
    {
      role: "Estudiante",
      name: "Carlos Martínez",
      cedula: "1098765432",
      password: "password",
      details: "Matrícula: EST2023-789, Programa: Ingeniería de Sistemas, Semestre: 4",
    },
    {
      role: "Docente",
      name: "Juan Pérez",
      cedula: "1087654321",
      password: "password",
      details: "Departamento: Ingeniería de Sistemas, Asignaturas: Programación I, Bases de Datos",
    },
    {
      role: "Administrador",
      name: "Ana Gómez",
      cedula: "1076543210",
      password: "password",
      details: "Acceso completo al sistema",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios de Prueba</CardTitle>
        <CardDescription>Utilice estos usuarios para probar el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Rol</th>
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Cédula</th>
                <th className="text-left p-2">Contraseña</th>
                <th className="text-left p-2">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {testUsers.map((user) => (
                <tr key={user.cedula} className="border-b">
                  <td className="p-2 font-medium">{user.role}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.cedula}</td>
                  <td className="p-2">{user.password}</td>
                  <td className="p-2 text-sm">{user.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

