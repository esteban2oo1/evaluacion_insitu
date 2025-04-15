"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { 
  tiposEvaluacionesService,
  configuracionEvaluacionService,
  aspectosEvaluacionService,
  configuracionAspectoService,
  escalaValoracionService,
  configuracionValoracionService
} from "@/lib/services/evaluacionInsitu"
import { TipoEvaluacion, AspectoEvaluacion, EscalaValoracion } from "@/lib/types/evaluacionInsitu"
import { ModalAspecto } from "./components/ModalAspecto"
import { ModalEscala } from "./components/ModalEscala"
import { ModalConfirmacion } from "./components/ModalConfirmacion"

export default function FormularioPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("configuracion")
  const [tiposEvaluacion, setTiposEvaluacion] = useState<TipoEvaluacion[]>([])
  const [aspectos, setAspectos] = useState<AspectoEvaluacion[]>([])
  const [escalas, setEscalas] = useState<EscalaValoracion[]>([])
  const [configuracionActual, setConfiguracionActual] = useState({
    tipoEvaluacionId: "",
    fechaInicio: "",
    fechaFin: "",
    activo: true
  })

  // Estados para modales
  const [modalAspecto, setModalAspecto] = useState({
    isOpen: false,
    aspecto: undefined as AspectoEvaluacion | undefined
  })
  const [modalEscala, setModalEscala] = useState({
    isOpen: false,
    escala: undefined as EscalaValoracion | undefined
  })
  const [modalConfirmacion, setModalConfirmacion] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {}
  })

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [tipos, aspectosData, escalasData] = await Promise.all([
        tiposEvaluacionesService.getAll(),
        aspectosEvaluacionService.getAll(),
        escalaValoracionService.getAll()
      ])
      setTiposEvaluacion(tipos)
      setAspectos(aspectosData)
      setEscalas(escalasData)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos iniciales",
        variant: "destructive"
      })
    }
  }

  const handleGuardarConfiguracion = async () => {
    try {
      const nuevaConfiguracion = await configuracionEvaluacionService.create({
        TIPO_EVALUACION_ID: parseInt(configuracionActual.tipoEvaluacionId),
        FECHA_INICIO: configuracionActual.fechaInicio,
        FECHA_FIN: configuracionActual.fechaFin,
        ACTIVO: configuracionActual.activo
      })

      toast({
        title: "Éxito",
        description: "Configuración guardada correctamente"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      })
    }
  }

  const handleEliminarAspecto = async (aspecto: AspectoEvaluacion) => {
    setModalConfirmacion({
      isOpen: true,
      title: "Eliminar Aspecto",
      description: `¿Está seguro de eliminar el aspecto "${aspecto.ETIQUETA}"?`,
      onConfirm: async () => {
        await aspectosEvaluacionService.delete(aspecto.ID)
        await cargarDatosIniciales()
      }
    })
  }

  const handleEliminarEscala = async (escala: EscalaValoracion) => {
    setModalConfirmacion({
      isOpen: true,
      title: "Eliminar Escala",
      description: `¿Está seguro de eliminar la escala "${escala.ETIQUETA}"?`,
      onConfirm: async () => {
        await escalaValoracionService.delete(escala.ID)
        await cargarDatosIniciales()
      }
    })
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Gestión de Evaluaciones</h1>
          <p className="text-gray-600">Administre las configuraciones de evaluación</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "configuracion" ? "default" : "outline"}
            onClick={() => setActiveTab("configuracion")}
          >
            Configuración General
          </Button>
          <Button
            variant={activeTab === "aspectos" ? "default" : "outline"}
            onClick={() => setActiveTab("aspectos")}
          >
            Aspectos
          </Button>
          <Button
            variant={activeTab === "escalas" ? "default" : "outline"}
            onClick={() => setActiveTab("escalas")}
          >
            Escalas de Valoración
          </Button>
        </div>

        {activeTab === "configuracion" && (
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Evaluación</CardTitle>
              <CardDescription>Configure los parámetros generales de la evaluación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Evaluación</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={configuracionActual.tipoEvaluacionId}
                    onChange={(e) => setConfiguracionActual({...configuracionActual, tipoEvaluacionId: e.target.value})}
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposEvaluacion.map((tipo) => (
                      <option key={tipo.ID} value={tipo.ID}>{tipo.NOMBRE}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configuracionActual.activo}
                      onCheckedChange={(checked) => setConfiguracionActual({...configuracionActual, activo: checked})}
                    />
                    <span>{configuracionActual.activo ? "Activo" : "Inactivo"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    value={configuracionActual.fechaInicio}
                    onChange={(e) => setConfiguracionActual({...configuracionActual, fechaInicio: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Fin</Label>
                  <Input
                    type="date"
                    value={configuracionActual.fechaFin}
                    onChange={(e) => setConfiguracionActual({...configuracionActual, fechaFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleGuardarConfiguracion}>
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "aspectos" && (
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Aspectos</CardTitle>
              <CardDescription>Administre los aspectos a evaluar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aspectos.map((aspecto) => (
                  <div key={aspecto.ID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{aspecto.ETIQUETA}</h3>
                      <p className="text-sm text-gray-600">{aspecto.DESCRIPCION}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setModalAspecto({ isOpen: true, aspecto })}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleEliminarAspecto(aspecto)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  className="w-full"
                  onClick={() => setModalAspecto({ isOpen: true, aspecto: undefined })}
                >
                  Agregar Nuevo Aspecto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "escalas" && (
          <Card>
            <CardHeader>
              <CardTitle>Escalas de Valoración</CardTitle>
              <CardDescription>Configure las escalas de calificación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {escalas.map((escala) => (
                  <div key={escala.ID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{escala.VALOR} - {escala.ETIQUETA}</h3>
                      <p className="text-sm text-gray-600">{escala.DESCRIPCION}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setModalEscala({ isOpen: true, escala })}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleEliminarEscala(escala)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  className="w-full"
                  onClick={() => setModalEscala({ isOpen: true, escala: undefined })}
                >
                  Agregar Nueva Escala
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modales */}
        <ModalAspecto
          isOpen={modalAspecto.isOpen}
          onClose={() => setModalAspecto({ isOpen: false, aspecto: undefined })}
          aspecto={modalAspecto.aspecto}
          onSuccess={cargarDatosIniciales}
        />

        <ModalEscala
          isOpen={modalEscala.isOpen}
          onClose={() => setModalEscala({ isOpen: false, escala: undefined })}
          escala={modalEscala.escala}
          onSuccess={cargarDatosIniciales}
        />

        <ModalConfirmacion
          isOpen={modalConfirmacion.isOpen}
          onClose={() => setModalConfirmacion({ ...modalConfirmacion, isOpen: false })}
          title={modalConfirmacion.title}
          description={modalConfirmacion.description}
          onConfirm={modalConfirmacion.onConfirm}
        />
      </div>
    </ProtectedRoute>
  )
}

