export interface AgenteFirma {
  id?: number;
  agenteId?: string;
  agenteNombre?: string;
  rutaImagenFirma?: string;
  archivoImagen?: File[];
  usuarioAgrega?: number;
  fechaAgrega?: Date;
  activo?: boolean;
  usuarioModifica?: number;
  fechaModifica?: Date;
}
