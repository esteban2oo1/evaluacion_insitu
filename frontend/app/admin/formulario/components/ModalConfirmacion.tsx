import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface ModalConfirmacionProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  description: string
}

export function ModalConfirmacion({ isOpen, onClose, onConfirm, title, description }: ModalConfirmacionProps) {
  const { toast } = useToast()

  const handleConfirm = async () => {
    try {
      await onConfirm()
      toast({
        title: "Éxito",
        description: "Elemento eliminado correctamente"
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el elemento",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{description}</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 