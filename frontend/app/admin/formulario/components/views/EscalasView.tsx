import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EscalaValoracion } from "@/lib/types/evaluacionInsitu";

interface EscalasViewProps {
  escalas: EscalaValoracion[];
  setModalEscala: (value: any) => void;
  handleEliminarEscala: (escala: EscalaValoracion) => void;
}

export function EscalasView({
  escalas,
  setModalEscala,
  handleEliminarEscala,
}: EscalasViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escalas de Valoración</CardTitle>
        <CardDescription>Configure las escalas de calificación</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {escalas.map((escala) => (
            <div key={escala.ID} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{escala.VALOR} - {escala.ETIQUETA}</h3>
                <p className="text-sm text-gray-600">{escala.DESCRIPCION}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setModalEscala({ isOpen: true, escala })}
                >
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleEliminarEscala(escala)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
          <Button 
            className="w-full"
            onClick={() => setModalEscala({ isOpen: true, escala: undefined })}
          >
            Agregar Nueva Escala
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}