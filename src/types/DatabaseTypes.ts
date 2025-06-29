export interface Departamento {
  id_departamento: number;
  nombre: string;
  // Relaciones definidas en el modelo Laravel
  municipios?: Municipio[];
  candidatosDiputado?: CandidatoDiputado[];
  votosPresidenciales?: VotoPresidencial[];
  votosDiputados?: VotoDiputado[];
}

export interface Municipio {
  id_municipio: number;
  id_departamento: number;
  nombre: string;
  // Relaciones definidas en el modelo Laravel
  departamento?: Departamento;
  personas?: Persona[];
  candidatosAlcalde?: CandidatoAlcalde[];
  votosAlcaldes?: VotoAlcalde[];
}

export interface Partido {
  id_partido: number;
  nombre: string;
  // Relaciones definidas en el modelo Laravel
  movimientos?: Movimiento[];
  candidatosPresidente?: CandidatoPresidente[];
  candidatosDiputado?: CandidatoDiputado[];
  candidatosAlcalde?: CandidatoAlcalde[];
}

export interface Movimiento {
  id_movimiento: number;
  id_partido: number;
  nombre: string;
  // Relaciones definidas en el modelo Laravel
  partido?: Partido;
  candidatosPresidente?: CandidatoPresidente[];
  candidatosDiputado?: CandidatoDiputado[];
  candidatosAlcalde?: CandidatoAlcalde[];
}

// ========================================
// PERSONAS Y USUARIOS
// ========================================

export interface Persona {
  id_persona: number;
  nombre: string;
  no_identidad: string;
  id_municipio: number;
  // Relaciones definidas en el modelo Laravel
  municipio?: Municipio;
}

export interface Usuario {
  id_usuario: number;
  correo: string;
  contrasena: string;
  id_persona: number;
  created_at?: string;
  updated_at?: string;
  // Relaciones definidas en el modelo Laravel
  persona?: Persona;
}

// ========================================
// CANDIDATOS
// ========================================

export interface CandidatoPresidente {
  id_candidato: number;
  id_partido: number;
  id_movimiento: number;
  nombre: string;
  foto_url?: string;
  // Relaciones definidas en el modelo Laravel
  partido?: Partido;
  movimiento?: Movimiento;
  votos?: VotoPresidencial[];
}

export interface CandidatoDiputado {
  id_candidato: number;
  id_partido: number;
  id_movimiento: number;
  id_departamento: number;
  nombre: string;
  foto_url?: string;
  // Relaciones definidas en el modelo Laravel
  partido?: Partido;
  movimiento?: Movimiento;
  departamento?: Departamento;
  votos?: VotoDiputado[];
}

export interface CandidatoAlcalde {
  id_candidato: number;
  id_partido: number;
  id_movimiento: number;
  id_municipio: number;
  nombre: string;
  foto_url?: string;
  // Relaciones definidas en el modelo Laravel
  partido?: Partido;
  movimiento?: Movimiento;
  municipio?: Municipio;
  votos?: VotoAlcalde[];
}

// ========================================
// VOTOS
// ========================================

export interface VotoPresidencial {
  id_voto: number;
  id_persona: number;
  id_candidato: number;
  id_departamento: number;
  id_proceso: number;
  tiempo: string;
  // Relaciones definidas en el modelo Laravel
  persona?: Persona;
  candidato?: CandidatoPresidente;
  departamento?: Departamento;
  procesoVotacion?: ProcesoVotacion;
}

export interface VotoDiputado {
  id_voto: number;
  id_persona: number;
  id_candidato: number;
  id_departamento: number;
  id_proceso: number;
  tiempo: string;
  // Relaciones definidas en el modelo Laravel
  persona?: Persona;
  candidato?: CandidatoDiputado;
  departamento?: Departamento;
  procesoVotacion?: ProcesoVotacion;
}

export interface VotoAlcalde {
  id_voto: number;
  id_persona: number;
  id_candidato: number;
  id_municipio: number;
  id_proceso: number;
  tiempo: string;
  // Relaciones definidas en el modelo Laravel
  persona?: Persona;
  candidato?: CandidatoAlcalde;
  municipio?: Municipio;
  procesoVotacion?: ProcesoVotacion;
}

// ========================================
// PROCESO DE VOTACIÓN
// ========================================

export interface ProcesoVotacion {
  id_proceso: number;
  etapa: string;
  modificado_por: number;
  created_at?: string;
  updated_at?: string;
  // Relaciones definidas en el modelo Laravel
  usuario?: Usuario;
}

// ========================================
// TIPOS PARA ESTADÍSTICAS
// ========================================

export interface EstadisticasGenerales {
  proceso: {
    id_proceso: number;
    etapa: string;
    created_at: string;
  };
  totales: {
    total_general: number;
    votos_presidenciales: number;
    votos_diputados: number;
    votos_alcaldes: number;
  };
  fecha_consulta: string;
}

export interface EstadisticasPresidenciales {
  proceso: {
    id_proceso: number;
    etapa: string;
    created_at: string;
  };
  total_votos: number;
  candidatos: Array<{
    id_candidato: number;
    nombre: string;
    partido: string;
    movimiento: string;
    total_votos: number;
    porcentaje: number;
    foto_url?: string;
  }>;
}

export interface EstadisticasDiputados {
  proceso: {
    id_proceso: number;
    etapa: string;
    created_at: string;
  };
  total_votos: number;
  candidatos: Array<{
    id_candidato: number;
    nombre: string;
    partido: string;
    movimiento: string;
    departamento: string;
    total_votos: number;
    porcentaje: number;
    foto_url?: string;
  }>;
}

export interface EstadisticasAlcaldes {
  proceso: {
    id_proceso: number;
    etapa: string;
    created_at: string;
  };
  total_votos: number;
  candidatos: Array<{
    id_candidato: number;
    nombre: string;
    partido: string;
    movimiento: string;
    municipio: string;
    total_votos: number;
    porcentaje: number;
    foto_url?: string;
  }>;
}

// ========================================
// TIPOS PARA FORMULARIOS Y CREACIÓN
// ========================================

export interface CreatePersonaRequest {
  nombre: string;
  no_identidad: string;
  id_municipio: number;
}

export interface CreateUsuarioRequest {
  correo: string;
  contrasena: string;
  id_persona: number;
}

export interface CreateCandidatoRequest {
  id_partido: number;
  id_movimiento: number;
  nombre: string;
  foto_url?: string;
}

export interface CreateCandidatoDiputadoRequest extends CreateCandidatoRequest {
  id_departamento: number;
}

export interface CreateCandidatoAlcaldeRequest extends CreateCandidatoRequest {
  id_municipio: number;
}

export interface CreateVotoRequest {
  id_persona: number;
  id_candidato: number;
  tiempo: string;
}

export interface CreateVotoPresidencialRequest extends CreateVotoRequest {
  id_departamento: number;
  id_proceso: number;
}

export interface CreateVotoDiputadoRequest extends CreateVotoRequest {
  id_departamento: number;
  id_proceso: number;
}

export interface CreateVotoAlcaldeRequest extends CreateVotoRequest {
  id_municipio: number;
  id_proceso: number;
}

// ========================================
// TIPOS PARA RESPUESTAS DE API
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ========================================
// TIPOS PARA FILTROS Y BÚSQUEDAS
// ========================================

export interface FiltrosVotacion {
  departamento?: number;
  municipio?: number;
  partido?: number;
  movimiento?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface FiltrosCandidatos {
  tipo: "presidente" | "diputado" | "alcalde";
  departamento?: number;
  municipio?: number;
  partido?: number;
  movimiento?: number;
}

// ========================================
// TIPOS PARA GRAFICOS Y REPORTES
// ========================================

export interface DatosGrafico {
  name: string;
  value: number;
  partido?: string;
  movimiento?: string;
  porcentaje?: number;
}

export interface ReporteVotacion {
  total_votos: number;
  porcentaje_participacion: number;
  candidatos_ganadores: Array<{
    tipo: string;
    nombre: string;
    partido: string;
    votos: number;
    porcentaje: number;
  }>;
  estadisticas_por_departamento: Array<{
    departamento: string;
    total_votos: number;
    porcentaje: number;
  }>;
}

// ========================================
// TIPOS PARA AUTENTICACIÓN
// ========================================

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  persona: Persona;
}

export interface AuthState {
  isAuthenticated: boolean;
  usuario?: Usuario;
  persona?: Persona;
  token?: string;
  loading: boolean;
}
