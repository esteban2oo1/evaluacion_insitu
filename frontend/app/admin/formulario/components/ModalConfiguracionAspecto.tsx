import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ConfiguracionAspecto,
  AspectoEvaluacion,
} from "@/lib/types/evaluacionInsitu";
import {
  configuracionAspectoService,
  aspectosEvaluacionService,
} from "@/lib/services/evaluacionInsitu";
import { useToast } from "@/hooks/use-toast";

interface ModalConfiguracionAspectoProps {
  isOpen: boolean;
  onClose: () => void;
  configuracion?: ConfiguracionAspecto;
  onSuccess: () => void;
  configuracionEvaluacionId: number;
}

export function ModalConfiguracionAspecto({
  isOpen,
  onClose,
  configuracion,
  onSuccess,
  configuracionEvaluacionId,
}: ModalConfiguracionAspectoProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    CONFIGURACION_EVALUACION_ID: string;
    ASPECTO_ID: string;
    ORDEN: string;
  }>({
    CONFIGURACION_EVALUACION_ID: "",
    ASPECTO_ID: "",
    ORDEN: "",
  });

  const [aspectos, setAspectos] = useState<AspectoEvaluacion[]>([]);

  // Cargar aspectos disponibles
  useEffect(() => {
    if (!isOpen) return;
    const fetchAspectos = async () => {
      try {
        const data = await aspectosEvaluacionService.getAll();
        setAspectos(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los aspectos",
          variant: "destructive",
        });
      }
    };
    fetchAspectos();
  }, [isOpen]);

  // Cargar datos en modo edición
  useEffect(() => {
    if (configuracion) {
      setFormData({
        CONFIGURACION_EVALUACION_ID: configuracionEvaluacionId?.toString() ?? "",
        ASPECTO_ID: configuracion.ASPECTO_ID?.toString() ?? "",
        ORDEN: configuracion.ORDEN?.toString() ?? "",
      });
    } else {
      setFormData({
        CONFIGURACION_EVALUACION_ID: "",
        ASPECTO_ID: "",
        ORDEN: "",
      });
    }
  }, [configuracion, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN } = formData;

  if (!CONFIGURACION_EVALUACION_ID || !ASPECTO_ID || !ORDEN) {
    toast({
      title: "Campos requeridos",
      description: "Todos los campos son obligatorios",
      variant: "destructive",
    });
    return;
  }

  const payload: ConfiguracionAspecto = {
    CONFIGURACION_EVALUACION_ID: parseInt(CONFIGURACION_EVALUACION_ID),
    ASPECTO_ID: parseInt(ASPECTO_ID),
    ORDEN: parseFloat(ORDEN),
    ACTIVO: true,
    ID: configuracion?.ID ?? 0,
  };

  try {
    if (configuracion?.ID) {
      await configuracionAspectoService.update(configuracion.ID, payload);
      toast({
        title: "Actualizado",
        description: "Configuración de aspecto actualizada correctamente",
      });
    } else {
      await configuracionAspectoService.create(payload);
      toast({
        title: "Creado",
        description: "Configuración de aspecto creada correctamente",
      });
    }
    onSuccess();
    onClose();
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    toast({
      title: "Error",
      description: "No se pudo guardar la configuración",
      variant: "destructive",
    });
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {configuracion?.ID
              ? "Editar Configuración de Aspecto"
              : "Nueva Configuración de Aspecto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Aspecto</Label>
            <select
              value={formData.ASPECTO_ID}
              onChange={(e) =>
                setFormData({ ...formData, ASPECTO_ID: e.target.value })
              }
              required
              className="w-full border rounded-md p-2"
            >
              <option value="" disabled>
                Seleccione un aspecto
              </option>
              {aspectos.map((a) => (
                <option key={a.ID} value={a.ID}>
                  {a.ETIQUETA}
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
              onChange={(e) =>
                setFormData({ ...formData, ORDEN: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {configuracion?.ID ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
