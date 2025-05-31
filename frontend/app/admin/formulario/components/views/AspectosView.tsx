import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectoEvaluacion } from "@/lib/types/evaluacionInsitu";
import { Edit, Trash2, Plus } from "lucide-react";

interface AspectosViewProps {
  aspectos: AspectoEvaluacion[];
  setModalAspecto: (value: any) => void;
  handleEliminarAspecto: (aspecto: AspectoEvaluacion) => void;
}

export function AspectosView({
  aspectos,
  setModalAspecto,
  handleEliminarAspecto,
}: AspectosViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Aspectos</CardTitle>
        <CardDescription>Administre los aspectos a evaluar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {aspectos.map((aspecto) => (
          <Card
            key={aspecto.ID}
            className="transition-all duration-200 hover:shadow-md border border-muted"
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{aspecto.ETIQUETA}</h3>
                  <p className="text-sm text-muted-foreground">{aspecto.DESCRIPCION}</p>
                </div>
                <div className="flex gap-2 self-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setModalAspecto({
                        isOpen: true,
                        aspecto,
                      })
                    }
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEliminarAspecto(aspecto)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          className="w-full mt-2"
          onClick={() => setModalAspecto({ isOpen: true, aspecto: undefined })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Nuevo Aspecto
        </Button>
      </CardContent>
    </Card>
  );
}
