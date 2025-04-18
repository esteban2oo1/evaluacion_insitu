import api from "@/lib/api";
import type { DetalleEvaluacionRequest, BulkEvaluacionRequest } from "@/lib/types/evaluacionInsitu";

// Obtener todos los detalles
export const getDetalles = async () => {
  const res = await api.get("/evaluacion-detalle");
  return res.data;
};

// Obtener detalle por ID
export const getDetalleById = async (id: number) => {
  const res = await api.get(`/evaluacion-detalle/${id}`);
  return res.data;
};

// Crear un detalle individual
export const createDetalle = async (detalle: DetalleEvaluacionRequest) => {
  const res = await api.post("/evaluacion-detalle", detalle);
  return res.data;
};

// Actualizar un detalle
export const updateDetalle = async (id: number, detalle: DetalleEvaluacionRequest) => {
  const res = await api.put(`/evaluacion-detalle/${id}`, detalle);
  return res.data;
};

// Eliminar un detalle
export const deleteDetalle = async (id: number) => {
  const res = await api.delete(`/evaluacion-detalle/${id}`);
  return res.data;
};

// Crear detalles en bulk (varios aspectos y comentario general)
export const createDetallesEvaluacion = async (bulk: BulkEvaluacionRequest) => {
  const res = await api.post("/evaluacion-detalle/bulk", bulk);
  return res.data;
};