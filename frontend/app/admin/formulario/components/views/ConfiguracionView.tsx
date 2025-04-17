// components/views/ConfiguracionView.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TipoEvaluacion, ConfiguracionEvaluacion } from "@/lib/types/evaluacionInsitu";
import { Dispatch, SetStateAction } from "react";

interface ConfiguracionViewProps {
  configuraciones: ConfiguracionEvaluacion[];
  tiposEvaluacion: TipoEvaluacion[];
  setModalConfiguracion: Dispatch<SetStateAction<{
    isOpen: boolean;
    configuracion: ConfiguracionEvaluacion | undefined;
  }>>;
  handleEliminarConfiguracion: (configuracion: ConfiguracionEvaluacion) => Promise<void>;
}

export function ConfiguracionView({
  configuraciones,
  tiposEvaluacion,
  setModalConfiguracion,
  handleEliminarConfiguracion,
}: ConfiguracionViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Evaluación</CardTitle>
        <CardDescription>Configure los parámetros generales de la evaluación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {configuraciones.map((configuracion) => {
            const tipoEvaluacion = tiposEvaluacion.find(
              (tipo) => tipo.ID === configuracion.TIPO_EVALUACION_ID
            );

            return (
              <div key={configuracion.ID} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">
                    Evaluación {tipoEvaluacion?.NOMBRE || "Desconocida"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Fecha Inicio: {new Date(configuracion.FECHA_INICIO).toISOString().split("T")[0]} - 
                    Fecha Fin: {new Date(configuracion.FECHA_FIN).toISOString().split("T")[0]}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estado: {configuracion.ACTIVO ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalConfiguracion({ isOpen: true, configuracion })}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleEliminarConfiguracion(configuracion)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            );
          })}
          <Button
            className="w-full"
            onClick={() => setModalConfiguracion({ isOpen: true, configuracion: undefined })}
          >
            Agregar Nueva Configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}