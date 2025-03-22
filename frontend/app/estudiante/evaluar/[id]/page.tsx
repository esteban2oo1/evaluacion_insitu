"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Datos simulados
const evaluationData = {
  programa: "Ingeniería de Sistemas",
  periodo: "2025-1",
  nombreDocente: "Juan Pérez",
  asignatura: "Programación I",
  semestre: "4",
  aspectos: [
    { id: 1, nombre: "Dominio del tema" },
    { id: 2, nombre: "Cumplimiento" },
    { id: 3, nombre: "Calidad" },
    { id: 4, nombre: "Puntualidad" },
    { id: 5, nombre: "Metodología y métodos en enseñanza" },
    { id: 6, nombre: "Recursos usados para la enseñanza" },
    { id: 7, nombre: "Proceso de evaluación" },
    { id: 8, nombre: "Aspectos motivacionales" },
    { id: 9, nombre: "Relaciones interpersonales" },
  ],
}

export default function EvaluarDocentePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [evaluaciones, setEvaluaciones] = useState<Record<number, string>>({})
  const [comentarios, setComentarios] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Verificar que todos los aspectos tengan evaluación
    const todosEvaluados = evaluationData.aspectos.every((aspecto) => evaluaciones[aspecto.id])

    if (!todosEvaluados) {
      toast({
        title: "Evaluación incompleta",
        description: "Por favor, evalúa todos los aspectos antes de enviar.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Evaluación enviada",
        description: "Tu evaluación ha sido registrada correctamente.",
      })
      router.push("/estudiante/dashboard")
    }, 1500)
  }

  const handleRadioChange = (aspectoId: number, value: string) => {
    setEvaluaciones((prev) => ({
      ...prev,
      [aspectoId]: value,
    }))
  }

  const handleComentarioChange = (aspectoId: number, value: string) => {
    setComentarios((prev) => ({
      ...prev,
      [aspectoId]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>EVALUACIÓN INSITU - DIÁLOGO FORMATIVO</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">PROGRAMA</p>
                  <p className="border p-2 rounded">{evaluationData.programa}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">PERIODO</p>
                  <p className="border p-2 rounded">{evaluationData.periodo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">NOMBRE DEL DOCENTE</p>
                  <p className="border p-2 rounded">{evaluationData.nombreDocente}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">NOMBRE DE LA ASIGNATURA</p>
                  <p className="border p-2 rounded">{evaluationData.asignatura}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">SEMESTRE</p>
                  <p className="border p-2 rounded">{evaluationData.semestre}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-5 gap-2 mb-2 font-medium text-center">
                  <div className="col-span-1">Aspecto a evaluar</div>
                  <div className="col-span-2">Clasificación</div>
                  <div className="col-span-2">Valoración Cualitativa (Obligatoria)</div>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-2 text-center text-sm">
                  <div className="col-span-1"></div>
                  <div>E</div>
                  <div>B</div>
                  <div>A</div>
                  <div>D</div>
                </div>

                {evaluationData.aspectos.map((aspecto) => (
                  <div key={aspecto.id} className="mb-6 border-b pb-4">
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      <div className="col-span-1 flex items-center">
                        <Label>{aspecto.nombre}</Label>
                      </div>
                      <div className="col-span-2">
                        <RadioGroup
                          value={evaluaciones[aspecto.id] || ""}
                          onValueChange={(value) => handleRadioChange(aspecto.id, value)}
                          className="grid grid-cols-4 gap-2"
                        >
                          <div className="flex items-center justify-center">
                            <RadioGroupItem value="E" id={`${aspecto.id}-E`} />
                          </div>
                          <div className="flex items-center justify-center">
                            <RadioGroupItem value="B" id={`${aspecto.id}-B`} />
                          </div>
                          <div className="flex items-center justify-center">
                            <RadioGroupItem value="A" id={`${aspecto.id}-A`} />
                          </div>
                          <div className="flex items-center justify-center">
                            <RadioGroupItem value="D" id={`${aspecto.id}-D`} />
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="col-span-2">
                        <Textarea
                          placeholder="Comentarios sobre este aspecto..."
                          value={comentarios[aspecto.id] || ""}
                          onChange={(e) => handleComentarioChange(aspecto.id, e.target.value)}
                          className="h-20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/estudiante/dashboard")}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Evaluación"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

