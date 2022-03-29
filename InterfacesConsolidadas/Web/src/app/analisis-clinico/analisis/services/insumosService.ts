import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Insumo } from "../models/insumo.model";
import { ProductoInsumoBusqueda } from "../models/productoInsumoBusqueda";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class InsumosService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/Insumos/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerInsumos(): Observable<Insumo[]> {
    const uri = `${this.url}GetAllInsumos`;
    return this.http.get(uri).map(r => r.json() as Insumo[]);
  }

  ObtenerInsumoPorId(InsumoId: string): Observable<Insumo> {
    const uri = `${this.url}${InsumoId}`;
    return this.http.get(uri).map(r => r.json() as Insumo);
  }

  GuardarInsumo(insumo:Insumo): Observable<RespuestaAC<Insumo>>{
    const uri = `${this.url}Insumo`;
    return this.http.post(uri,insumo).map(r => r.json() as RespuestaAC<Insumo>);
  }

  EditarInsumo(insumo:Insumo): Observable<RespuestaAC<Insumo>>{
    const uri = `${this.url}Insumo`;
    return this.http.put(uri,insumo).map(r => r.json() as RespuestaAC<Insumo>);
  }

  EliminarInsumo(InsumoId: string): Observable<RespuestaAC<Insumo>>{
    const uri = `${this.url}${InsumoId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<Insumo>);
  }

  private productosResultado = new Array<ProductoInsumoBusqueda>();
  buscarProductos(descripcion: string, top:number = 15, usarDataLocal: boolean = true): Promise<Array<ProductoInsumoBusqueda>> {

    const promesa = new Promise<Array<ProductoInsumoBusqueda>>((resolve, reject) => {
      if (descripcion === null || descripcion.length < 3) {
        resolve(this.productosResultado);
        return;
      }

      let resultadoLocal = this.obtenerProductosEnLocal(descripcion);
      if (usarDataLocal && resultadoLocal.length > 0) {
        resolve(resultadoLocal);
        return;
      }

      const uri = `${this.url}GetProductosInsumos/${descripcion}/${top}`;
      this.http.get(uri).subscribe(response => {
        this.productosResultado = response.json() as Array<ProductoInsumoBusqueda>;

        this.productosResultado.forEach(producto => {
          producto.searchData = `${producto.productoId} ${producto.descripcion}`;
          producto.esSeleccionado = false;
        });

        resolve(this.productosResultado);
      }, error => {
        reject(error);
      });

    });

    return promesa;
  }

  private obtenerProductosEnLocal(descripcion: string): Array<ProductoInsumoBusqueda> {
    return this.productosResultado.filter((elemento) => elemento.searchData.
      toLocaleLowerCase().
      indexOf(descripcion.toLocaleLowerCase()) !== -1);
  }

}
