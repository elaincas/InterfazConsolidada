import { Producto } from "../../../productos/administracion-atributos/models/producto";
import { DistribuidorExternoProductos } from "./distribuidor-externo-producto";

export class DistribuidorExternoCategoriaProductos{
    constructor(
        public id:number = 0,
        public fechaAgrega: Date = new Date,
        public distribuidorExternoCategoriaId : number = 0,
        public productoId : string = '',
        public productoNombre : string = '',
        public activo : boolean = true,
        public usuarioId : number = 0,
        public productos : DistribuidorExternoProductos[] = new Array<DistribuidorExternoProductos>()
    ){}
}