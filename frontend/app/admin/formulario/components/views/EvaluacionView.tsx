// components/views/EvaluacionView.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectoEvaluacion, EscalaValoracion, ConfiguracionEvaluacion, TipoEvaluacion } from "@/lib/types/evaluacionInsitu";
import { configuracionAspectoService, configuracionValoracionService } from "@/lib/services/evaluacionInsitu";
import { Dispatch, SetStateAction } from 'react';

interface EvaluacionViewProps {
  configuracionSeleccionada: number | null;
  configuraciones: ConfiguracionEvaluacion[];
  tiposEvaluacion: TipoEvaluacion[];
  setConfiguracionSeleccionada: Dispatch<SetStateAction<number | null>>;
  cargarDatosFiltrados: (configuracionId: number) => Promise<void>;
  setModalConfiguracionAspecto: Dispatch<SetStateAction<{
    isOpen: boolean;
    configuracion: any | undefined;
  }>>;
  setModalConfiguracionValoracion: Dispatch<SetStateAction<{
    isOpen: boolean;
    configuracion: any | undefined;
  }>>;
  configuracionAspectos: any[];
  configuracionValoraciones: any[];
}

const formatearFecha = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  const formateada = fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });
  return formateada.charAt(0).toUpperCase() + formateada.slice(1);
};

export function EvaluacionView({
  configuracionSeleccionada,
  configuraciones,
  tiposEvaluacion,
  setConfiguracionSeleccionada,
  cargarDatosFiltrados,
  setModalConfiguracionAspecto,
  setModalConfiguracionValoracion,
  configuracionAspectos,
  configuracionValoraciones
}: EvaluacionViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluación</CardTitle>
        <CardDescription>Gestione los aspectos y valoraciones de la configuración seleccionada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="configuracionSelect" className="block text-sm font-medium text-gray-700">
            Seleccionar Configuración
          </label>
          <select
            id="configuracionSelect"
            value={configuracionSeleccionada ?? ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              setConfiguracionSeleccionada(selectedId);
              cargarDatosFiltrados(selectedId);
            }}
            className="w-full border rounded-md p-2"
          >
            <option value="" disabled>
              Seleccione una configuración
            </option>
            {configuraciones.map((config) => {
              const tipo = tiposEvaluacion.find(
                (t) => t.ID === config.TIPO_EVALUACION_ID
              );
              return (
                <option key={config.ID} value={config.ID}>
                  {tipo?.NOMBRE || "Tipo desconocido"} - {formatearFecha(config.FECHA_INICIO)} -{" "}
                  {formatearFecha(config.FECHA_FIN)} - {config.ACTIVO ? "Activo" : "Inactivo"}
                </option>
              );
            })}
          </select>
        </div>

        {/* Si hay configuración seleccionada, mostramos los aspectos y valoraciones */}
        {configuracionSeleccionada && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aspectos */}
            <div>
              <h3 className="text-lg font-semibold">Aspectos</h3>
              <ul className="space-y-2">
                {configuracionAspectos.map((aspecto) => (
                  <li key={aspecto.ID} className="p-2 border rounded-md flex justify-between items-center">
                    <span>{aspecto.ETIQUETA}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModalConfiguracionAspecto({ isOpen: true, configuracion: aspecto })}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await configuracionAspectoService.delete(aspecto.ID);
                          cargarDatosFiltrados(configuracionSeleccionada);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-4"
                onClick={() =>
                  setModalConfiguracionAspecto({
                    isOpen: true,
                    configuracion: { CONFIGURACION_EVALUACION_ID: configuracionSeleccionada },
                  })
                }
              >
                Agregar Aspecto
              </Button>
            </div>

            {/* Valoraciones */}
            <div>
              <h3 className="text-lg font-semibold">Valoraciones</h3>
              <ul className="space-y-2">
                {configuracionValoraciones.map((valoracion) => (
                  <li key={valoracion.ID} className="p-2 border rounded-md flex justify-between items-center">
                    <span>{valoracion.ETIQUETA} - Puntaje: {valoracion.PUNTAJE}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setModalConfiguracionValoracion({ isOpen: true, configuracion: valoracion })
                        }
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await configuracionValoracionService.delete(valoracion.ID);
                          cargarDatosFiltrados(configuracionSeleccionada);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-4"
                onClick={() =>
                  setModalConfiguracionValoracion({
                    isOpen: true,
                    configuracion: { CONFIGURACION_EVALUACION_ID: configuracionSeleccionada },
                  })
                }
              >
                Agregar Valoración
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}