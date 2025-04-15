import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { EscalaValoracion } from "@/lib/types/evaluacionInsitu"
import { escalaValoracionService } from "@/lib/services/evaluacionInsitu"
import { useToast } from "@/hooks/use-toast"

interface ModalEscalaProps {
  isOpen: boolean
  onClose: () => void
  escala?: EscalaValoracion
  onSuccess: () => void
}

export function ModalEscala({ isOpen, onClose, escala, onSuccess }: ModalEscalaProps) {
  const { toast } = useToast()

  // Estado para el formulario
  const [formData, setFormData] = useState({
    VALOR: "",
    ETIQUETA: "",
    DESCRIPCION: ""
  })

  // 🧠 Actualiza el formulario cuando se abre con una nueva escala
  useEffect(() => {
    if (escala) {
      setFormData({
        VALOR: escala.VALOR,
        ETIQUETA: escala.ETIQUETA,
        DESCRIPCION: escala.DESCRIPCION
      })
    } else {
      setFormData({ VALOR: "", ETIQUETA: "", DESCRIPCION: "" })
    }
  }, [escala, isOpen])

  // Manejador del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones antes de guardar
    if (!formData.VALOR.trim()) {
      toast({
        title: "Campo requerido",
        description: "El valor no puede estar vacío",
        variant: "destructive"
      })
      return
    }

    if (!formData.ETIQUETA.trim()) {
      toast({
        title: "Campo requerido",
        description: "La etiqueta no puede estar vacía",
        variant: "destructive"
      })
      return
    }

    try {
      let response
      if (escala) {
        // Actualizando una escala existente
        response = await escalaValoracionService.update(escala.ID, formData)
        toast({
          title: "Éxito",
          description: "Escala actualizada correctamente"
        })
      } else {
        // Creando una nueva escala
        response = await escalaValoracionService.create(formData)
        toast({
          title: "Éxito",
          description: "Escala creada correctamente"
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la escala",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{escala ? "Editar Escala" : "Nueva Escala"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input
              value={formData.VALOR}
              onChange={(e) => setFormData({ ...formData, VALOR: e.target.value })}
              required
              maxLength={1}
            />
          </div>
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
              {escala ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
