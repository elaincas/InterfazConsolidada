export interface ProductoInformacion {
  id: number;
  descripcion: string;
  descripcionWeb: string;
  activo: boolean;
  usuarioAgregaId: number;
  usuarioModificaId: number | null;
  fechaAgrega: string;
}
