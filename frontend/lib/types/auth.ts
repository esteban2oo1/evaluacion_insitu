export interface LoginRequest {
  user_username: string;
  user_password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      username: string;
      primaryRole: string;
      additionalRoles: string[];
    };
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error: string;
}

export interface MateriaEstudiante {
  id: number;
  codigo: number;
  nombre: string;
  docente: {
    documento: string;
    nombre: string;
  };
}

export interface MateriaDocente {
  id: number;
  codigo: number;
  nombre: string;
  semestre: string;
  programa: string;
}

export interface Rol {
  id: number;
  nombre: string;
}

export interface Roles {
  principal: Rol;
  adicionales: Rol[];
}

export interface PerfilEstudiante {
  tipo: "estudiante";
  sede: string;
  nombre_completo: string;
  tipo_doc: string;
  documento: string;
  estado_matricula: string;
  programa: string;
  periodo: string;
  semestre: string;
  grupo: string;
  materias: MateriaEstudiante[];
  roles: Roles;
}

export interface PerfilDocente {
  tipo: "docente";
  email: string;
  documento: string;
  nombre_completo: string;
  sede: string;
  periodo: string;
  materias: MateriaDocente[];
  roles: Roles;
}

export type PerfilUsuario = PerfilEstudiante | PerfilDocente;

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: PerfilUsuario;
} 