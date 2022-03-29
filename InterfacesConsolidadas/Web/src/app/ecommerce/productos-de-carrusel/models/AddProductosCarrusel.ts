import {AddProducto} from "./addProducto";

export class AddProductosCarrusel {
  constructor(
    public carruselId: number = 0,
    public usuarioId: number = 0,
    public productos: AddProducto[] = [],
    public respuesta: string = ''
  ) {}
}
