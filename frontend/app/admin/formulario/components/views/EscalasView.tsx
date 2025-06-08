import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EscalaValoracion } from "@/lib/types/evaluacionInsitu";
import { Edit, Trash2, Plus } from "lucide-react";

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
      <CardContent className="space-y-4">
        {escalas.map((escala) => (
          <Card
            key={escala.ID}
            className="transition-all duration-200 hover:shadow-md border border-muted"
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {escala.VALOR} - {escala.ETIQUETA}
                  </h3>
                  <p className="text-sm text-muted-foreground">{escala.DESCRIPCION}</p>
                </div>
                <div className="flex gap-2 self-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setModalEscala({ isOpen: true, escala })}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEliminarEscala(escala)}
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
          onClick={() => setModalEscala({ isOpen: true, escala: undefined })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Nueva Escala
        </Button>
      </CardContent>
    </Card>
  );
}
