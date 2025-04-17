// app/admin/formulario/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  tiposEvaluacionesService,
  configuracionEvaluacionService,
  aspectosEvaluacionService,
  escalaValoracionService,
  configuracionAspectoService,
  configuracionValoracionService
} from "@/lib/services/evaluacionInsitu";
import { TipoEvaluacion, AspectoEvaluacion, EscalaValoracion, ConfiguracionEvaluacion } from "@/lib/types/evaluacionInsitu";
import { ModalAspecto } from "./components/ModalAspecto";
import { ModalEscala } from "./components/ModalEscala";
import { ModalConfirmacion } from "./components/ModalConfirmacion";
import { ModalConfiguracionEvaluacion } from "./components/ModalConfiguracionEvaluacion";
import { ModalConfiguracionAspecto } from "./components/ModalConfiguracionAspecto";
import { ModalConfiguracionValoracion } from "./components/ModalConfiguracionValoracion";

// Importar las vistas separadas
import { ConfiguracionView } from "./components/views/ConfiguracionView";
import { AspectosView } from "./components/views/AspectosView";
import { EscalasView } from "./components/views/EscalasView";
import { EvaluacionView } from "./components/views/EvaluacionView";

export default function FormularioPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("configuracion");
  const [tiposEvaluacion, setTiposEvaluacion] = useState<TipoEvaluacion[]>([]);
  const [aspectos, setAspectos] = useState<AspectoEvaluacion[]>([]);
  const [escalas, setEscalas] = useState<EscalaValoracion[]>([]);
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionEvaluacion[]>([]);
  const [modalConfiguracion, setModalConfiguracion] = useState({
    isOpen: false,
    configuracion: undefined as ConfiguracionEvaluacion | undefined,
  });

  // Estados para modales
  const [modalAspecto, setModalAspecto] = useState({
    isOpen: false,
    aspecto: undefined as AspectoEvaluacion | undefined,
  });
  const [modalEscala, setModalEscala] = useState({
    isOpen: false,
    escala: undefined as EscalaValoracion | undefined,
  });
  const [modalConfirmacion, setModalConfirmacion] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });

  const [configuracionSeleccionada, setConfiguracionSeleccionada] = useState<number | null>(null);
  const [configuracionAspectos, setConfiguracionAspectos] = useState<any[]>([]);
  const [configuracionValoraciones, setConfiguracionValoraciones] = useState<any[]>([]);
  const [modalConfiguracionAspecto, setModalConfiguracionAspecto] = useState({
    isOpen: false,
    configuracion: undefined as any | undefined,
  });
  const [modalConfiguracionValoracion, setModalConfiguracionValoracion] = useState({
    isOpen: false,
    configuracion: undefined as any | undefined,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [tipos, aspectosData, escalasData, configuracionesData] = await Promise.all([
        tiposEvaluacionesService.getAll(),
        aspectosEvaluacionService.getAll(),
        escalaValoracionService.getAll(),
        configuracionEvaluacionService.getAll(),
      ]);
      setTiposEvaluacion(tipos);
      setAspectos(aspectosData);
      setEscalas(escalasData);
      setConfiguraciones(configuracionesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos iniciales",
        variant: "destructive",
      });
    }
  };

  const cargarDatosFiltrados = async (configuracionId: number) => {
    try {
      const { configuracion, aspectos, valoraciones } = await tiposEvaluacionesService.getConfiguracion(configuracionId);

      setConfiguracionAspectos(aspectos);
      setConfiguracionValoraciones(valoraciones);

      toast({
        title: "Éxito",
        description: "Datos filtrados cargados correctamente",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos filtrados",
        variant: "destructive",
      });
    }
  };

  const handleEliminarAspecto = async (aspecto: AspectoEvaluacion) => {
    setModalConfirmacion({
      isOpen: true,
      title: "Eliminar Aspecto",
      description: `¿Está seguro de eliminar el aspecto "${aspecto.ETIQUETA}"?`,
      onConfirm: async () => {
        await aspectosEvaluacionService.delete(aspecto.ID);
        await cargarDatosIniciales();
      },
    });
  };

  const handleEliminarEscala = async (escala: EscalaValoracion) => {
    setModalConfirmacion({
      isOpen: true,
      title: "Eliminar Escala",
      description: `¿Está seguro de eliminar la escala "${escala.ETIQUETA}"?`,
      onConfirm: async () => {
        await escalaValoracionService.delete(escala.ID);
        await cargarDatosIniciales();
      },
    });
  };

  const handleEliminarConfiguracion = async (configuracion: ConfiguracionEvaluacion) => {
    setModalConfirmacion({
      isOpen: true,
      title: "Eliminar Configuración",
      description: `¿Está seguro de eliminar esta configuración?`,
      onConfirm: async () => {
        await configuracionEvaluacionService.delete(configuracion.ID);
        await cargarDatosIniciales();
      },
    });
  };

  useEffect(() => {
    // Seleccionar automáticamente la primera configuración activa al cargar el componente
    if (configuraciones.length > 0) {
      const primeraActiva = configuraciones.find((config) => config.ACTIVO);
      if (primeraActiva) {
        setConfiguracionSeleccionada(primeraActiva.ID);
        cargarDatosFiltrados(primeraActiva.ID);
      }
    }
  }, [configuraciones]); // Ejecutar cuando las configuraciones cambien

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Gestión de Evaluaciones</h1>
          <p className="text-gray-600">Administre las configuraciones de evaluación</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "configuracion" ? "default" : "outline"}
            onClick={() => setActiveTab("configuracion")}
          >
            Configuración General
          </Button>
          <Button
            variant={activeTab === "aspectos" ? "default" : "outline"}
            onClick={() => setActiveTab("aspectos")}
          >
            Aspectos
          </Button>
          <Button
            variant={activeTab === "escalas" ? "default" : "outline"}
            onClick={() => setActiveTab("escalas")}
          >
            Escalas de Valoración
          </Button>
          <Button
            variant={activeTab === "evaluacion" ? "default" : "outline"}
            onClick={() => setActiveTab("evaluacion")}
          >
            Evaluación
          </Button>
        </div>

        {activeTab === "configuracion" && (
          <ConfiguracionView
            configuraciones={configuraciones}
            tiposEvaluacion={tiposEvaluacion}
            setModalConfiguracion={setModalConfiguracion}
            handleEliminarConfiguracion={handleEliminarConfiguracion}
          />
        )}

        {activeTab === "aspectos" && (
          <AspectosView
            aspectos={aspectos}
            setModalAspecto={setModalAspecto}
            handleEliminarAspecto={handleEliminarAspecto}
          />
        )}

        {activeTab === "escalas" && (
          <EscalasView
            escalas={escalas}
            setModalEscala={setModalEscala}
            handleEliminarEscala={handleEliminarEscala}
          />
        )}

        {activeTab === "evaluacion" && (
          <EvaluacionView
            configuracionSeleccionada={configuracionSeleccionada}
            configuraciones={configuraciones}
            tiposEvaluacion={tiposEvaluacion}
            setConfiguracionSeleccionada={setConfiguracionSeleccionada}
            cargarDatosFiltrados={cargarDatosFiltrados}
            setModalConfiguracionAspecto={setModalConfiguracionAspecto}
            setModalConfiguracionValoracion={setModalConfiguracionValoracion}
            configuracionAspectos={configuracionAspectos}
            configuracionValoraciones={configuracionValoraciones}
          />
        )}

        {/* Modales */}
        <ModalAspecto
          isOpen={modalAspecto.isOpen}
          onClose={() => setModalAspecto({ isOpen: false, aspecto: undefined })}
          aspecto={modalAspecto.aspecto}
          onSuccess={cargarDatosIniciales}
        />

        <ModalEscala
          isOpen={modalEscala.isOpen}
          onClose={() => setModalEscala({ isOpen: false, escala: undefined })}
          escala={modalEscala.escala}
          onSuccess={cargarDatosIniciales}
        />

        <ModalConfirmacion
          isOpen={modalConfirmacion.isOpen}
          onClose={() => setModalConfirmacion({ ...modalConfirmacion, isOpen: false })}
          title={modalConfirmacion.title}
          description={modalConfirmacion.description}
          onConfirm={modalConfirmacion.onConfirm}
        />

        <ModalConfiguracionEvaluacion
          isOpen={modalConfiguracion.isOpen}
          onClose={() => setModalConfiguracion({ isOpen: false, configuracion: undefined })}
          configuracion={modalConfiguracion.configuracion}
          onSuccess={cargarDatosIniciales}
        />

        <ModalConfiguracionAspecto
          isOpen={modalConfiguracionAspecto.isOpen}
          onClose={() => setModalConfiguracionAspecto({ isOpen: false, configuracion: undefined })}
          configuracion={modalConfiguracionAspecto.configuracion}
          onSuccess={() => cargarDatosFiltrados(configuracionSeleccionada!)}
        />

        <ModalConfiguracionValoracion
          isOpen={modalConfiguracionValoracion.isOpen}
          onClose={() => setModalConfiguracionValoracion({ isOpen: false, configuracion: undefined })}
          configuracion={modalConfiguracionValoracion.configuracion}
          onSuccess={() => cargarDatosFiltrados(configuracionSeleccionada!)}
        />
      </div>
    </ProtectedRoute>
  );
}