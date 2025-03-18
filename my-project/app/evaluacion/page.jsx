"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Aspectos a evaluar según el formulario
const ASPECTOS_EVALUACION = [
  { id: "dominio", label: "Dominio del tema" },
  { id: "cumplimiento", label: "Cumplimiento" },
  { id: "calidad", label: "Calidad" },
  { id: "puntualidad", label: "Puntualidad" },
  { id: "metodologia", label: "Metodología y métodos en enseñanza" },
  { id: "recursos", label: "Recursos usados para la enseñanza" },
  { id: "evaluacion", label: "Proceso de evaluación" },
  { id: "motivacion", label: "Aspectos motivacionales" },
  { id: "relaciones", label: "Relaciones interpersonales" },
]

// Escala de valoración
const ESCALA = [
  { valor: "E", label: "Excelente" },
  { valor: "B", label: "Bueno" },
  { valor: "A", label: "Aceptable" },
  { valor: "D", label: "Deficiente" },
]

export default function EvaluacionPage() {
  const [evaluacionData, setEvaluacionData] = useState(null)
  const [valoraciones, setValoraciones] = useState({})
  const [comentariosAspectos, setComentariosAspectos] = useState({})
  const [comentariosGenerales, setComentariosGenerales] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay datos de evaluación
    const evaluacion = sessionStorage.getItem("evaluacion")
    if (!evaluacion) {
      router.push("/dashboard")
      return
    }
    setEvaluacionData(JSON.parse(evaluacion))

    // Verificar si el usuario está autenticado
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    }
  }, [router])

  const handleValoracionChange = (aspecto, valor) => {
    setValoraciones((prev) => ({
      ...prev,
      [aspecto]: valor,
    }))
  }

  const handleComentarioAspectoChange = (aspecto, comentario) => {
    setComentariosAspectos((prev) => ({
      ...prev,
      [aspecto]: comentario,
    }))
  }

  const handleSubmit = () => {
    // Verificar que todos los aspectos tengan valoración
    const aspectosFaltantes = ASPECTOS_EVALUACION.filter((aspecto) => !valoraciones[aspecto.id])

    if (aspectosFaltantes.length > 0) {
      setError(`Por favor, completa la valoración cuantitativa de todos los aspectos.`)
      return
    }

    // Verificar que al menos un aspecto tenga comentario cualitativo
    const tieneComentariosAspectos = Object.values(comentariosAspectos).some((comentario) => comentario.trim() !== "")

    if (!tieneComentariosAspectos && !comentariosGenerales.trim()) {
      setError(
        "Por favor, incluye al menos un comentario cualitativo en algún aspecto o en la valoración general."
      )
      return
    }

    // En un caso real, aquí se enviarían los datos al servidor
    console.log({
      evaluacion: evaluacionData,
      valoraciones,
      comentariosAspectos,
      comentariosGenerales,
    })

    // Simular envío exitoso
    setSubmitted(true)
    setError("")
  }

  const handleVolver = () => {
    if (submitted) {
      // Limpiar datos de evaluación actual
      sessionStorage.removeItem("evaluacion")
      router.push("/dashboard")
    } else {
      router.back()
    }
  }

  if (!evaluacionData) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-4xl">
        {submitted ? (
          <Card className="my-8">
            <CardContent className="pt-6">
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">Evaluación enviada con éxito</AlertTitle>
                <AlertDescription className="text-green-700">
                  Gracias por completar la evaluación docente. Tu retroalimentación es muy valiosa para mejorar la
                  calidad educativa.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center mt-4">
                <Button onClick={handleVolver}>Volver al Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="my-8">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl text-center">EVALUACIÓN INSITU - DIÁLOGO FORMATIVO</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">PROGRAMA</p>
                  <p className="font-medium">{evaluacionData.programa}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">PERIODO</p>
                  <p className="font-medium">{evaluacionData.periodo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">NOMBRE DEL DOCENTE</p>
                  <p className="font-medium">{evaluacionData.profesor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">NOMBRE DE LA ASIGNATURA</p>
                  <p className="font-medium">{evaluacionData.materia}</p>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Aspectos a Evaluar</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Para cada aspecto, selecciona una valoración (E: Excelente, B: Bueno, A: Aceptable, D: Deficiente) y
                  proporciona comentarios cualitativos específicos.
                </p>

                <Accordion type="multiple" className="w-full">
                  {ASPECTOS_EVALUACION.map((aspecto) => (
                    <AccordionItem
                      key={aspecto.id}
                      value={aspecto.id}
                      className="border rounded-md mb-4 overflow-hidden">
                      <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{aspecto.label}</span>
                          <div className="flex items-center space-x-2">
                            {valoraciones[aspecto.id] && (
                              <span
                                className={`text-sm font-semibold px-2 py-1 rounded ${
                                  valoraciones[aspecto.id] === "E"
                                    ? "bg-green-100 text-green-800"
                                    : valoraciones[aspecto.id] === "B"
                                      ? "bg-blue-100 text-blue-800"
                                      : valoraciones[aspecto.id] === "A"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}>
                                {valoraciones[aspecto.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-4 bg-gray-50">
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-2 block">Valoración Cuantitativa</Label>
                            <RadioGroup
                              value={valoraciones[aspecto.id] || ""}
                              onValueChange={(value) => handleValoracionChange(aspecto.id, value)}
                              className="flex flex-wrap gap-4">
                              {ESCALA.map((escala) => (
                                <div key={escala.valor} className="flex items-center space-x-2">
                                  <RadioGroupItem value={escala.valor} id={`${aspecto.id}-${escala.valor}`} />
                                  <Label htmlFor={`${aspecto.id}-${escala.valor}`} className="cursor-pointer">
                                    {escala.valor}: {escala.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div>
                            <Label htmlFor={`comentario-${aspecto.id}`} className="mb-2 block">
                              Valoración Cualitativa
                            </Label>
                            <Textarea
                              id={`comentario-${aspecto.id}`}
                              value={comentariosAspectos[aspecto.id] || ""}
                              onChange={(e) => handleComentarioAspectoChange(aspecto.id, e.target.value)}
                              placeholder={`Describe tu valoración sobre ${aspecto.label.toLowerCase()}...`}
                              className="min-h-[80px]" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="comentarios-generales" className="text-lg font-medium">
                  Valoración Cualitativa General
                </Label>
                <p className="text-sm text-gray-500 mb-2">
                  ¿Aspectos relevantes adicionales que consideras en la evaluación?
                </p>
                <Textarea
                  id="comentarios-generales"
                  value={comentariosGenerales}
                  onChange={(e) => setComentariosGenerales(e.target.value)}
                  placeholder="Escribe tus comentarios generales aquí..."
                  className="min-h-[120px]" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={handleVolver}>
                Volver
              </Button>
              <Button onClick={handleSubmit}>Enviar Evaluación</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

