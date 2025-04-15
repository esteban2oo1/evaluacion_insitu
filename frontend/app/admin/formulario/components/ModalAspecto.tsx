import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { AspectoEvaluacion } from "@/lib/types/evaluacionInsitu"
import { aspectosEvaluacionService } from "@/lib/services/evaluacionInsitu"
import { useToast } from "@/hooks/use-toast"

interface ModalAspectoProps {
  isOpen: boolean
  onClose: () => void
  aspecto?: AspectoEvaluacion
  onSuccess: () => void
}

export function ModalAspecto({
  isOpen,
  onClose,
  aspecto,
  onSuccess
}: ModalAspectoProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    ETIQUETA: "",
    DESCRIPCION: ""
  })

  // 🧠 Actualiza el formulario cuando se abre con un nuevo aspecto
  useEffect(() => {
    if (aspecto) {
      setFormData({
        ETIQUETA: aspecto.ETIQUETA,
        DESCRIPCION: aspecto.DESCRIPCION
      })
    } else {
      setFormData({ ETIQUETA: "", DESCRIPCION: "" })
    }
  }, [aspecto, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.ETIQUETA.trim()) {
      toast({
        title: "Campo requerido",
        description: "La etiqueta no puede estar vacía",
        variant: "destructive"
      })
      return
    }

    try {
      let response;
      if (aspecto) {
        // Actualizando un aspecto existente
        response = await aspectosEvaluacionService.update(aspecto.ID, formData);
        toast({
          title: "Éxito",
          description: "Aspecto actualizado correctamente"
        })
      } else {
        // Creando un nuevo aspecto
        response = await aspectosEvaluacionService.create(formData);
        toast({
          title: "Éxito",
          description: "Aspecto creado correctamente"
        })
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el aspecto",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{aspecto ? "Editar Aspecto" : "Nuevo Aspecto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Etiqueta</Label>
            <Input
              value={formData.ETIQUETA}
              onChange={(e) => setFormData({ ...formData, ETIQUETA: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={formData.DESCRIPCION}
              onChange={(e) => setFormData({ ...formData, DESCRIPCION: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {aspecto ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
