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
import { TipoEvaluacion, AspectoEvaluacion, EscalaValoracion, ConfiguracionEvaluacion } from "@/lib/types/evaluacionInsitu"
import { ModalAspecto } from "./components/ModalAspecto"
import { ModalEscala } from "./components/ModalEscala"
import { ModalConfirmacion } from "./components/ModalConfirmacion"
import { ModalConfiguracionEvaluacion } from "./components/ModalConfiguracionEvaluacion"

export default function FormularioPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("configuracion")
  const [tiposEvaluacion, setTiposEvaluacion] = useState<TipoEvaluacion[]>([])
  const [aspectos, setAspectos] = useState<AspectoEvaluacion[]>([])
  const [escalas, setEscalas] = useState<EscalaValoracion[]>([])
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionEvaluacion[]>([])
  const [modalConfiguracion, setModalConfiguracion] = useState({
    isOpen: false,
    configuracion: undefined as ConfiguracionEvaluacion | undefined
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
      const [tipos, aspectosData, escalasData, configuracionesData] = await Promise.all([
        tiposEvaluacionesService.getAll(),
        aspectosEvaluacionService.getAll(),
        escalaValoracionService.getAll(),
        configuracionEvaluacionService.getAll()
      ])
      setTiposEvaluacion(tipos)
      setAspectos(aspectosData)
      setEscalas(escalasData)
      setConfiguraciones(configuracionesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos iniciales",
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

  const handleEliminarConfiguracion = async (configuracion: ConfiguracionEvaluacion) => {
    setModalConfirmacion({
      isOpen: true,
      title: "Eliminar Configuración",
      description: `¿Está seguro de eliminar esta configuración?`,
      onConfirm: async () => {
        await configuracionEvaluacionService.delete(configuracion.ID)
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
              <div className="space-y-4">
                {configuraciones.map((configuracion) => {
                  const tipoEvaluacion = tiposEvaluacion.find(
                    (tipo) => tipo.ID === configuracion.TIPO_EVALUACION_ID
                  )

                  return (
                    <div key={configuracion.ID} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">
                          Evaluación {tipoEvaluacion?.NOMBRE || "Desconocida"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Fecha Inicio: {new Date(configuracion.FECHA_INICIO).toISOString().split("T")[0]} - 
                          Fecha Fin: {new Date(configuracion.FECHA_FIN).toISOString().split("T")[0]}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estado: {configuracion.ACTIVO ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setModalConfiguracion({ isOpen: true, configuracion })}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEliminarConfiguracion(configuracion)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  )
                })}
                <Button
                  className="w-full"
                  onClick={() => setModalConfiguracion({ isOpen: true, configuracion: undefined })}
                >
                  Agregar Nueva Configuración
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

        <ModalConfiguracionEvaluacion
          isOpen={modalConfiguracion.isOpen}
          onClose={() => setModalConfiguracion({ isOpen: false, configuracion: undefined })}
          configuracion={modalConfiguracion.configuracion}
          onSuccess={cargarDatosIniciales}
        />
      </div>
    </ProtectedRoute>
  )
}

