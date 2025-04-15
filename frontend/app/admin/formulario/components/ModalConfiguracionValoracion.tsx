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
import { ConfiguracionValoracion } from "@/lib/types/evaluacionInsitu"
import { configuracionValoracionService } from "@/lib/services/evaluacionInsitu"
import { useToast } from "@/hooks/use-toast"

interface ModalConfiguracionValoracionProps {
  isOpen: boolean
  onClose: () => void
  configuracion?: ConfiguracionValoracion
  onSuccess: () => void
}

export function ModalConfiguracionValoracion({
  isOpen,
  onClose,
  configuracion,
  onSuccess
}: ModalConfiguracionValoracionProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    CONFIGURACION_EVALUACION_ID: "",
    VALORACION_ID: "",
    PUNTAJE: "",
    ORDEN: ""
  })

  useEffect(() => {
    if (configuracion) {
      setFormData({
        CONFIGURACION_EVALUACION_ID: configuracion.CONFIGURACION_EVALUACION_ID.toString(),
        VALORACION_ID: configuracion.VALORACION_ID.toString(),
        PUNTAJE: configuracion.PUNTAJE.toString(),
        ORDEN: configuracion.ORDEN.toString()
      })
    } else {
      setFormData({
        CONFIGURACION_EVALUACION_ID: "",
        VALORACION_ID: "",
        PUNTAJE: "",
        ORDEN: ""
      })
    }
  }, [configuracion, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.CONFIGURACION_EVALUACION_ID || !formData.VALORACION_ID || !formData.PUNTAJE || !formData.ORDEN) {
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
        VALORACION_ID: parseInt(formData.VALORACION_ID),
        PUNTAJE: parseFloat(formData.PUNTAJE),
        ORDEN: parseFloat(formData.ORDEN),
        ACTIVO: true
      }

      if (configuracion) {
        await configuracionValoracionService.update(configuracion.ID, payload)
        toast({
          title: "Éxito",
          description: "Configuración de valoración actualizada correctamente"
        })
      } else {
        await configuracionValoracionService.create(payload)
        toast({
          title: "Éxito",
          description: "Configuración de valoración creada correctamente"
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
            {configuracion ? "Editar Configuración de Valoración" : "Nueva Configuración de Valoración"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Puntaje</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.PUNTAJE}
              onChange={(e) => setFormData({ ...formData, PUNTAJE: e.target.value })}
              required
            />
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