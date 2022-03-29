interface Producto{

  prod_id : string,
  prod_Desc : string,
  tipoDeProducto : number
}

interface ProductosVideosReproducciones{
  id: number,
  imagenUrlID: number,
  porcentaje_Vista: number,
  usuarioID: string,
  fecha: Date
}
export interface ProductoReproducionesListado{
  producto: Producto;
  imagenUrlID : number,
  url_Imagen : number,
  cantidad : number,
  detalle : ProductosVideosReproducciones[],
  porcentaje_Promedio : number
}