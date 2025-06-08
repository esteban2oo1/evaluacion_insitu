import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit3, Plus, Check, AlertCircle } from "lucide-react";
import { TipoEvaluacion } from "@/lib/types/evaluacionInsitu";
import { tiposEvaluacionesService } from "@/lib/services/evaluacionInsitu";
import { useToast } from "@/hooks/use-toast";

interface ModalTipoEvaluacionProps {
  isOpen: boolean;
  onClose: () => void;
  tipo?: TipoEvaluacion;
  onSuccess: () => void;
}

export function ModalTipoEvaluacion({
  isOpen,
  onClose,
  tipo,
  onSuccess,
}: ModalTipoEvaluacionProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    NOMBRE: "",
    DESCRIPCION: "",
    ACTIVO: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (tipo) {
      setFormData({
        NOMBRE: tipo.NOMBRE,
        DESCRIPCION: tipo.DESCRIPCION,
        ACTIVO: tipo.ACTIVO,
      });
    } else {
      setFormData({ NOMBRE: "", DESCRIPCION: "", ACTIVO: true });
    }
    setErrors({});
  }, [tipo, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.NOMBRE.trim()) {
      newErrors.NOMBRE = "El nombre es obligatorio";
    } else if (formData.NOMBRE.trim().length < 3) {
      newErrors.NOMBRE = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.DESCRIPCION.trim()) {
      newErrors.DESCRIPCION = "La descripción es obligatoria";
    } else if (formData.DESCRIPCION.trim().length < 10) {
      newErrors.DESCRIPCION = "La descripción debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (tipo) {
        await tiposEvaluacionesService.update(tipo.ID, formData);
        toast({
          title: "¡Actualización exitosa!",
          description: "El tipo de evaluación se actualizó correctamente",
        });
      } else {
        await tiposEvaluacionesService.create(formData);
        toast({
          title: "¡Creación exitosa!",
          description: "Nuevo tipo de evaluación creado",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo completar la operación. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {tipo ? (
                <Edit3 className="h-5 w-5 text-primary" />
              ) : (
                <Plus className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {tipo ? "Editar Tipo de Evaluación" : "Nuevo Tipo de Evaluación"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {tipo 
                  ? "Modifica la información del tipo de evaluación"
                  : "Crea un nuevo tipo de evaluación para el sistema"
                }
              </p>
            </div>
            {tipo && (
              <Badge variant={tipo.ACTIVO ? "default" : "secondary"}>
                {tipo.ACTIVO ? "Activo" : "Inactivo"}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-muted/20">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-3">
                <Label htmlFor="nombre" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Nombre del Tipo
                </Label>
                <Input
                  id="nombre"
                  value={formData.NOMBRE}
                  onChange={(e) => handleInputChange("NOMBRE", e.target.value)}
                  placeholder="Ej. Evaluación de Desempeño Técnico"
                  className={`transition-colors ${errors.NOMBRE ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  required
                />
                {errors.NOMBRE && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.NOMBRE}
                  </div>
                )}
              </div>

              {/* Campo Descripción */}
              <div className="space-y-3">
                <Label htmlFor="descripcion" className="text-sm font-medium flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-primary" />
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.DESCRIPCION}
                  onChange={(e) => handleInputChange("DESCRIPCION", e.target.value)}
                  placeholder="Describe el propósito, alcance y características principales de este tipo de evaluación..."
                  rows={4}
                  className={`resize-none transition-colors ${errors.DESCRIPCION ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  required
                />
                <div className="flex justify-between items-center">
                  {errors.DESCRIPCION ? (
                    <div className="flex items-center gap-1 text-sm text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.DESCRIPCION}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Mínimo 10 caracteres
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formData.DESCRIPCION.length}/500
                  </div>
                </div>
              </div>

              {/* Switch Estado Activo */}
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Estado del Tipo
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {formData.ACTIVO 
                      ? "Este tipo estará disponible para crear evaluaciones"
                      : "Este tipo no estará disponible para nuevas evaluaciones"
                    }
                  </p>
                </div>
                <Switch
                  checked={formData.ACTIVO}
                  onCheckedChange={(checked) => setFormData({ ...formData, ACTIVO: checked })}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {tipo ? "Actualizando..." : "Creando..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {tipo ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {tipo ? "Actualizar" : "Crear"}
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}