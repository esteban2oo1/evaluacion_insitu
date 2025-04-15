import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { ConfiguracionEvaluacion, TipoEvaluacion } from "@/lib/types/evaluacionInsitu"
import { configuracionEvaluacionService, tiposEvaluacionesService } from "@/lib/services/evaluacionInsitu"
import { useToast } from "@/hooks/use-toast"

interface ModalConfiguracionEvaluacionProps {
  isOpen: boolean
  onClose: () => void
  configuracion?: ConfiguracionEvaluacion
  onSuccess: () => void
}

export function ModalConfiguracionEvaluacion({
  isOpen,
  onClose,
  configuracion,
  onSuccess
}: ModalConfiguracionEvaluacionProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    TIPO_EVALUACION_ID: "",
    FECHA_INICIO: "",
    FECHA_FIN: ""
  })

  const [tiposEvaluacion, setTiposEvaluacion] = useState<TipoEvaluacion[]>([])

  // Cargar tipos de evaluación al abrir el modal
  useEffect(() => {
    const fetchTiposEvaluacion = async () => {
      try {
        const tipos = await tiposEvaluacionesService.getAll()
        setTiposEvaluacion(tipos)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los tipos de evaluación",
          variant: "destructive"
        })
      }
    }

    if (isOpen) {
      fetchTiposEvaluacion()
    }
  }, [isOpen, toast])

  // Actualiza el formulario cuando se abre con una configuración existente
  useEffect(() => {
    if (configuracion) {
      setFormData({
        TIPO_EVALUACION_ID: configuracion.TIPO_EVALUACION_ID.toString(),
        FECHA_INICIO: configuracion.FECHA_INICIO,
        FECHA_FIN: configuracion.FECHA_FIN
      })
    } else {
      setFormData({
        TIPO_EVALUACION_ID: "",
        FECHA_INICIO: "",
        FECHA_FIN: ""
      })
    }
  }, [configuracion, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.TIPO_EVALUACION_ID.trim() || !formData.FECHA_INICIO.trim() || !formData.FECHA_FIN.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      })
      return
    }

    try {
      const payload = {
        ...formData,
        TIPO_EVALUACION_ID: parseInt(formData.TIPO_EVALUACION_ID),
        ACTIVO: true // Valor predeterminado para cumplir con la interfaz
      }

      if (configuracion) {
        // Actualizando una configuración existente
        await configuracionEvaluacionService.update(configuracion.ID, payload)
        toast({
          title: "Éxito",
          description: "Configuración actualizada correctamente"
        })
      } else {
        // Creando una nueva configuración
        await configuracionEvaluacionService.create(payload)
        toast({
          title: "Éxito",
          description: "Configuración creada correctamente"
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {configuracion ? "Editar Configuración" : "Nueva Configuración"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Evaluación</Label>
            <select
              value={formData.TIPO_EVALUACION_ID}
              onChange={(e) => setFormData({ ...formData, TIPO_EVALUACION_ID: e.target.value })}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="" disabled>
                Seleccione un tipo de evaluación
              </option>
              {tiposEvaluacion.map((tipo) => (
                <option key={tipo.ID} value={tipo.ID}>
                  {tipo.NOMBRE}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Fecha de Inicio</Label>
            <Input
              type="date"
              value={formData.FECHA_INICIO}
              onChange={(e) => setFormData({ ...formData, FECHA_INICIO: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Fecha de Fin</Label>
            <Input
              type="date"
              value={formData.FECHA_FIN}
              onChange={(e) => setFormData({ ...formData, FECHA_FIN: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {configuracion ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}