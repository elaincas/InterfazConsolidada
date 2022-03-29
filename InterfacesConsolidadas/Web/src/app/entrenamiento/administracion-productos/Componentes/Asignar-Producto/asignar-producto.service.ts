import { Http } from "../../../../../../node_modules/@angular/http";
import { Injectable } from "../../../../../../node_modules/@angular/core";
import { environment } from "../../../../../environments/environment";
import { Observable } from "../../../../../../node_modules/rxjs";

import { ProductoPrestamos } from "../../Clases/Producto";

@Injectable()
export class AsignarProductoService {
    constructor(private http: Http) {

    }

    obtenerProductosConEstado() {
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerProductos`;
        return this.http.get(uri).map(r => r.json());
    }
    obtenerInformacionColaborador(colaboradorID: number,esDataColaboradorColaboradorDespedido: boolean){
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerColaborador/`+colaboradorID+`/`+esDataColaboradorColaboradorDespedido;
        return this.http.get(uri).map(r => r.json());
    }
    AsignarInformacion(prestamoProducto:ProductoPrestamos){
        const uri = `${environment.productosEntrenamiento}/api/Productos/asignar`;
        return this.http.post(uri,prestamoProducto).map(r => r.json());
    }
    RecuperarProducto(prestamoProducto:ProductoPrestamos,esDataColaboradorColaboradorDespedido: boolean){
        const uri = `${environment.productosEntrenamiento}/api/Productos/recuperar/`+esDataColaboradorColaboradorDespedido;
        return this.http.post(uri,prestamoProducto).map(r => r.json());
    }
    ObtenerColaboradores(){
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerColaboradores`;
        return this.http.get(uri).map(r => r.json());
    }
    ObtenerColaboradoresDespedidos(){
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerColaboradoresDespedidos`;
        return this.http.get(uri).map(r => r.json());
    }
    Obternerproductounidadesdisponible(productoId:string, usuarioId:string){
        const uri = `${environment.productosEntrenamiento}/api/Productos/productounidadesdisponible/${productoId}/${usuarioId}`;
        return this.http.get(uri).map(r => r.json());
    }
}
