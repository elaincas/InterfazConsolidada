import { Proveedor } from './proveedor.model';
import { Margen } from "./margen.model";
import { Linea } from './linea.model';

export interface Producto {
    id: number;
    descripcion: string;
    actualizarPrecioDeMargen: boolean;
    margen: Margen;
    proveedor: Proveedor;
    linea: Linea;
}
