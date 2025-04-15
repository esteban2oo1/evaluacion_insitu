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
import { ConfiguracionAspecto, AspectoEvaluacion } from "@/lib/types/evaluacionInsitu"
import { configuracionAspectoService, aspectosEvaluacionService } from "@/lib/services/evaluacionInsitu"
import { useToast } from "@/hooks/use-toast"

interface ModalConfiguracionAspectoProps {
  isOpen: boolean
  onClose: () => void
  configuracion?: ConfiguracionAspecto
  onSuccess: () => void
}

export function ModalConfiguracionAspecto({
  isOpen,
  onClose,
  configuracion,
  onSuccess
}: ModalConfiguracionAspectoProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    CONFIGURACION_EVALUACION_ID: "",
    ASPECTO_ID: "",
    ORDEN: ""
  })

  const [aspectos, setAspectos] = useState<AspectoEvaluacion[]>([])

  useEffect(() => {
    const fetchAspectos = async () => {
      try {
        const data = await aspectosEvaluacionService.getAll()
        setAspectos(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los aspectos",
          variant: "destructive"
        })
      }
    }

    if (isOpen) {
      fetchAspectos()
    }
  }, [isOpen, toast])

  useEffect(() => {
    if (configuracion) {
      setFormData({
        CONFIGURACION_EVALUACION_ID: configuracion.CONFIGURACION_EVALUACION_ID.toString(),
        ASPECTO_ID: configuracion.ASPECTO_ID.toString(),
        ORDEN: configuracion.ORDEN.toString()
      })
    } else {
      setFormData({
        CONFIGURACION_EVALUACION_ID: "",
        ASPECTO_ID: "",
        ORDEN: ""
      })
    }
  }, [configuracion, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.CONFIGURACION_EVALUACION_ID || !formData.ASPECTO_ID || !formData.ORDEN) {
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
        CONFIGURACION_EVALUACION_ID: parseInt(formData.CONFIGURACION_EVALUACION_ID),
        ASPECTO_ID: parseInt(formData.ASPECTO_ID),
        ORDEN: parseFloat(formData.ORDEN),
        ACTIVO: true
      }

      if (configuracion) {
        await configuracionAspectoService.update(configuracion.ID, payload)
        toast({
          title: "Éxito",
          description: "Configuración de aspecto actualizada correctamente"
        })
      } else {
        await configuracionAspectoService.create(payload)
        toast({
          title: "Éxito",
          description: "Configuración de aspecto creada correctamente"
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
            {configuracion ? "Editar Configuración de Aspecto" : "Nueva Configuración de Aspecto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Aspecto</Label>
            <select
              value={formData.ASPECTO_ID}
              onChange={(e) => setFormData({ ...formData, ASPECTO_ID: e.target.value })}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="" disabled>
                Seleccione un aspecto
              </option>
              {aspectos.map((aspecto) => (
                <option key={aspecto.ID} value={aspecto.ID}>
                  {aspecto.ETIQUETA}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Orden</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.ORDEN}
              onChange={(e) => setFormData({ ...formData, ORDEN: e.target.value })}
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