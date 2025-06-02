import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Calendar, ChevronDown } from "lucide-react";

// Tipos que necesitarás (ajusta según tu implementación)
interface ConfiguracionEvaluacion {
  ID: number;
  TIPO_EVALUACION_ID: number;
  FECHA_INICIO: string;
  FECHA_FIN: string;
  ACTIVO: boolean;
}

interface TipoEvaluacion {
  ID: number;
  NOMBRE: string;
}

interface ConfiguracionSelectorProps {
  configuraciones: ConfiguracionEvaluacion[];
  tiposEvaluacion: TipoEvaluacion[];
  configuracionSeleccionada: number | null;
  onConfiguracionChange: (idConfiguracion: number) => void;
}

export default function ConfiguracionSelector({
  configuraciones,
  tiposEvaluacion,
  configuracionSeleccionada,
  onConfiguracionChange
}: ConfiguracionSelectorProps) {

  const getTipoEvaluacionNombre = (tipoId: number) => {
    return tiposEvaluacion.find(tipo => tipo.ID === tipoId)?.NOMBRE || "Desconocida";
  };

  const isConfiguracionVigente = (config: ConfiguracionEvaluacion) => {
    const ahora = new Date();
    const inicio = new Date(config.FECHA_INICIO);
    const fin = new Date(config.FECHA_FIN);
    return ahora >= inicio && ahora <= fin;
  };

  const configuracionActual = configuraciones.find(c => c.ID === configuracionSeleccionada);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Configuración de Evaluación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="relative">
            <select
              value={configuracionSeleccionada || ""}
              onChange={(e) => onConfiguracionChange(Number(e.target.value))}
              className="w-full p-3 pr-10 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
            >
              <option value="">Seleccionar configuración...</option>
              {configuraciones
                .filter(config => config.ACTIVO)
                .map((configuracion) => {
                  const tipoNombre = getTipoEvaluacionNombre(configuracion.TIPO_EVALUACION_ID);
                  const fechaInicio = new Date(configuracion.FECHA_INICIO).toLocaleDateString("es-ES");
                  const fechaFin = new Date(configuracion.FECHA_FIN).toLocaleDateString("es-ES");
                  
                  return (
                    <option key={configuracion.ID} value={configuracion.ID}>
                      {tipoNombre} ({fechaInicio} - {fechaFin})
                    </option>
                  );
                })}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {configuracionActual && (
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm">
                  {getTipoEvaluacionNombre(configuracionActual.TIPO_EVALUACION_ID)}
                </h4>
                <Badge
                  variant={isConfiguracionVigente(configuracionActual) ? "default" : "secondary"}
                  className="text-xs flex items-center gap-1"
                >
                  {isConfiguracionVigente(configuracionActual) ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {isConfiguracionVigente(configuracionActual) ? "Vigente" : "Programada"}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  <strong>Inicio:</strong> {new Date(configuracionActual.FECHA_INICIO).toLocaleDateString("es-ES")}
                </div>
                <div>
                  <strong>Fin:</strong> {new Date(configuracionActual.FECHA_FIN).toLocaleDateString("es-ES")}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}