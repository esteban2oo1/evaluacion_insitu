import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectoEvaluacion } from "@/lib/types/evaluacionInsitu";

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
      <CardContent>
        <div className="space-y-4">
          {aspectos.map((aspecto) => (
            <div key={aspecto.ID} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{aspecto.ETIQUETA}</h3>
                <p className="text-sm text-gray-600">{aspecto.DESCRIPCION}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setModalAspecto({
                      isOpen: true,
                      aspecto,
                    })
                  }
                >
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleEliminarAspecto(aspecto)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
          <Button 
            className="w-full"
            onClick={() => setModalAspecto({ isOpen: true, aspecto: undefined })}
          >
            Agregar Nuevo Aspecto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}