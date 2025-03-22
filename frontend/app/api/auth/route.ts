import { NextResponse } from "next/server"

// Simulación de autenticación
export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json()

    // Simulación de verificación de credenciales
    if (!username || !password) {
      return NextResponse.json({ error: "Usuario y contraseña son requeridos" }, { status: 400 })
    }

    // Verificar si es un estudiante matriculado
    if (role === "estudiante") {
      const isEnrolled = username.startsWith("EST")

      if (!isEnrolled) {
        return NextResponse.json({ error: "Estudiante no matriculado", enrolled: false }, { status: 200 })
      }
    }

    // Simulación de usuario autenticado
    const user = {
      id: "1",
      name: role === "estudiante" ? "Carlos Martínez" : role === "docente" ? "Juan Pérez" : "Admin",
      role,
      // Más datos según el rol
    }

    return NextResponse.json({ user, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error en la autenticación" }, { status: 500 })
  }
}

