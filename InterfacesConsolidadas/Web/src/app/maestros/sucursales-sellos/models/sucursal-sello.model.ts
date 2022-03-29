export interface SucursalSello {
  id?: number;
  codigoSucursal?: number;
  nombreCorto?: string;
  rutaImagenSello?: string;
  archivoImagen?: File[];
  usuarioAgrega?: number;
  fechaAgrega?: Date;
  activo?: boolean;
  usuarioModifica?: number;
  fechaModifica?: Date;
}
