export class ImagenFactura {
  constructor(
    public id: number,
    public Nombre: string,
    public NombreEnArchivo: string,
    public Url: string,
    public SeccionFacturaId: number,
    public EmpresaId: number,
    public SucursalId: number,
    public ImagenBase64:string
  ) { }
}


