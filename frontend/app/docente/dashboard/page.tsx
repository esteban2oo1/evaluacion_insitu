"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Datos simulados
const teacherData = {
  name: "Juan Pérez",
  cedula: "1087654321",
  department: "Ingeniería de Sistemas",
  courses: [
    {
      id: 1,
      name: "Programación I",
      semester: "4",
      program: "Ingeniería de Sistemas",
      totalStudents: 25,
      evaluatedStudents: 18,
      students: [
        { id: 1, name: "Carlos Martínez", evaluated: true },
        { id: 2, name: "Ana García", evaluated: true },
        { id: 3, name: "Luis Rodríguez", evaluated: false },
        { id: 4, name: "María Sánchez", evaluated: true },
        { id: 5, name: "Pedro López", evaluated: false },
      ],
    },
    {
      id: 2,
      name: "Bases de Datos",
      semester: "4",
      program: "Ingeniería de Sistemas",
      totalStudents: 30,
      evaluatedStudents: 22,
      students: [
        { id: 1, name: "Carlos Martínez", evaluated: false },
        { id: 6, name: "Sofía Ramírez", evaluated: true },
        { id: 7, name: "Jorge Mendoza", evaluated: true },
        { id: 8, name: "Laura Torres", evaluated: true },
        { id: 9, name: "Daniel Vargas", evaluated: false },
      ],
    },
  ],
}

export default function DocenteDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(teacherData.courses[0])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Bienvenido, {teacherData.name}</h1>
          <p className="text-sm text-gray-500">Cédula: {teacherData.cedula}</p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            Cerrar Sesión
          </Button>
        </Link>
      </header>

      <main className="container mx-auto p-4 max-w-6xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Panel de Docente</CardTitle>
            <CardDescription>Monitoreo de evaluaciones de estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teacherData.courses.map((course) => (
                <Card
                  key={course.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>
                      {course.program} - Semestre {course.semester}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso de evaluaciones</span>
                        <span>
                          {course.evaluatedStudents}/{course.totalStudents}
                        </span>
                      </div>
                      <Progress value={(course.evaluatedStudents / course.totalStudents) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estudiantes de {selectedCourse.name}</CardTitle>
            <CardDescription>
              {selectedCourse.program} - Semestre {selectedCourse.semester}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-7">Nombre</div>
                <div className="col-span-4 text-right">Estado</div>
              </div>
              {selectedCourse.students.map((student, index) => (
                <div key={student.id} className="grid grid-cols-12 p-3 border-t">
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-7">{student.name}</div>
                  <div className="col-span-4 text-right">
                    {student.evaluated ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Evaluado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Total de estudiantes: {selectedCourse.totalStudents}</p>
              <p>Estudiantes que han evaluado: {selectedCourse.evaluatedStudents}</p>
              <p>Estudiantes pendientes: {selectedCourse.totalStudents - selectedCourse.evaluatedStudents}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

