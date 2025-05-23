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
  ConfiguracionValoracion,
  EscalaValoracion,
} from "@/lib/types/evaluacionInsitu";
import {
  configuracionValoracionService,
  escalaValoracionService,
} from "@/lib/services/evaluacionInsitu";
import { useToast } from "@/hooks/use-toast";

interface ModalConfiguracionValoracionProps {
  isOpen: boolean;
  onClose: () => void;
  configuracion?: ConfiguracionValoracion;
  onSuccess: () => void;
  configuracionEvaluacionId: number;
}

export function ModalConfiguracionValoracion({
  isOpen,
  onClose,
  configuracion,
  onSuccess,
  configuracionEvaluacionId,
}: ModalConfiguracionValoracionProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    CONFIGURACION_EVALUACION_ID: string;
    VALORACION_ID: string;
    PUNTAJE: string;
    ORDEN: string;
  }>({
    CONFIGURACION_EVALUACION_ID: "",
    VALORACION_ID: "",
    PUNTAJE: "",
    ORDEN: "",
  });

  const [valoraciones, setValoraciones] = useState<EscalaValoracion[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchValoraciones = async () => {
      try {
        const data = await escalaValoracionService.getAll();
        setValoraciones(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las valoraciones",
          variant: "destructive",
        });
      }
    };
    fetchValoraciones();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (configuracion) {
      setFormData({
        CONFIGURACION_EVALUACION_ID: configuracionEvaluacionId?.toString() ?? "",
        VALORACION_ID: configuracion.VALORACION_ID?.toString() ?? "",
        PUNTAJE: configuracion.PUNTAJE?.toString() ?? "",
        ORDEN: configuracion.ORDEN?.toString() ?? "",
      });
    } else {
      setFormData({
        CONFIGURACION_EVALUACION_ID: "",
        VALORACION_ID: "",
        PUNTAJE: "",
        ORDEN: "",
      });
    }
  }, [configuracion, configuracionEvaluacionId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { CONFIGURACION_EVALUACION_ID, VALORACION_ID, PUNTAJE, ORDEN } = formData;

    if (!CONFIGURACION_EVALUACION_ID || !VALORACION_ID || !PUNTAJE || !ORDEN) {
      toast({
        title: "Campos requeridos",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const payload: ConfiguracionValoracion = {
      CONFIGURACION_EVALUACION_ID: parseInt(CONFIGURACION_EVALUACION_ID),
      VALORACION_ID: parseInt(VALORACION_ID),
      PUNTAJE: parseFloat(PUNTAJE),
      ORDEN: parseInt(ORDEN),
      ACTIVO: true,
      ID: configuracion?.ID ?? 0,
    };

    try {
      if (configuracion?.ID) {
        await configuracionValoracionService.update(configuracion.ID, payload);
        toast({
          title: "Actualizado",
          description: "Configuración de valoración actualizada correctamente",
        });
      } else {
        await configuracionValoracionService.create(payload);
        toast({
          title: "Creado",
          description: "Configuración de valoración creada correctamente",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
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
            {configuracion?.ID ? "Editar Configuración de Valoración" : "Nueva Configuración de Valoración"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Valoración</Label>
            <select
              value={formData.VALORACION_ID}
              onChange={(e) => setFormData({ ...formData, VALORACION_ID: e.target.value })}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="" disabled>
                Seleccione una valoración
              </option>
              {valoraciones.map((v) => (
                <option key={v.ID} value={v.ID}>
                  {v.ETIQUETA}
                </option>
              ))}
            </select>
          </div>

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
