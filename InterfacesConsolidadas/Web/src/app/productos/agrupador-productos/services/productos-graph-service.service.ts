import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { IProducto } from '../models/producto.model';

@Injectable()
export class ProductosGraphServiceService {

  constructor(private http: HttpAuthService) {
  }

  private productosResultado = new Array<IProducto>();
  buscarProductos(descripcion: string, top:number = 10, usarDataLocal: boolean = true): Promise<Array<IProducto>> {

    const promesa = new Promise<Array<IProducto>>((resolve, reject) => {
      if (descripcion === null || descripcion.length < 3) {
        resolve(this.productosResultado);
        return;
      }

      let resultadoLocal = this.obtenerProductosEnLocal(descripcion);
      if (usarDataLocal && resultadoLocal.length > 0) {
        resolve(resultadoLocal);
        return;
      }

      let query = `productos(descripcion:"${descripcion}", top:${top}) { id, descripcion}`;
      let uri = environment.productosGraph.replace('@query', query);

      this.http.get(uri).subscribe(response => {
        this.productosResultado = response.json().productos as Array<IProducto>;

        this.productosResultado.forEach(producto => {
          producto.searchData = `${producto.id} ${producto.descripcion}`;
          producto.esSeleccionado = false;
        });

        resolve(this.productosResultado);
      }, error => {
        reject(error);
      });

    });

    return promesa;
  }

  private obtenerProductosEnLocal(descripcion: string): Array<IProducto> {
    return this.productosResultado.filter((elemento) => elemento.searchData.
      toLocaleLowerCase().
      indexOf(descripcion.toLocaleLowerCase()) !== -1);
  }

}
