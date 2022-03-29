import { Component, OnInit } from '@angular/core';
import {ProductosCarruselService} from '../services/productos-carrusel.service';
import {Alertas, Notificaciones} from '../../../helpers/notificaciones/notificaciones';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lista-productos-carrusel',
  templateUrl: './lista-productos-carrusel.component.html',
  styleUrls: ['./lista-productos-carrusel.component.css'],
  providers: [ProductosCarruselService]
})
export class ListaProductosCarruselComponent implements OnInit {
  constructor(private carruselService: ProductosCarruselService,
              private router: Router) { }
  listaProductosCarruselPorPagina = [];

  ngOnInit() {
    this.ObtenerCarruselesConProductosPorPagina();
  }


  ObtenerCarruselesConProductosPorPagina() {
    Alertas.load();
    this.carruselService.ObtenerCarruselesConProductosPorPagina().subscribe(r => {
      this.listaProductosCarruselPorPagina = r;
      Alertas.close();
    }, error => {
      Alertas.showHttpResponse(error, '¡ERROR!', true);
    });
  }

  mostrarInfo(info) {
    console.log(info);
  }

  EliminarCarrusel(carrusel, listaCarruseles) {
    Alertas.question(``, `¿Está seguro que desea eliminar este carrusel?`)
      .then(r => {
        this.carruselService.EliminarCarrusel(carrusel.carruselId).subscribe(res => {
          const indexCarrusel = listaCarruseles.findIndex(c => c.carruselId === carrusel.carruselId);
          const indexPagina = this.listaProductosCarruselPorPagina.findIndex(lp => lp.listaCarruselConProductos === listaCarruseles );
          listaCarruseles.splice(indexCarrusel, 1);
          if (listaCarruseles.length === 0) {
            this.listaProductosCarruselPorPagina.splice(indexPagina, 1);
          }
          Alertas.ok('¡Correcto!', `El carrusel "${res.descripcion}" se ha eliminado`);
        }, error => {
          Alertas.showHttpResponse(error, '¡ERROR!', true);
        });
      });
  }

  EliminarProductoDeCarrusel(producto, listaProductos) {
    if (listaProductos.length === 1) {
      Alertas.warning('No se puede eliminar', `El carrusel debe contener al menos 1 producto.`);
      return;
    }
    Alertas.question(``, `¿Está seguro que desea eliminar este producto?`)
      .then(res => {
        const index = listaProductos.findIndex( p => p.productoId === producto.productoId);
        this.carruselService.EliminarProductoDeCarrusel(producto.productoCarruselId).subscribe( r => {
          listaProductos.splice(index, 1);
          this.ObtenerCarruselesConProductosPorPagina();
          Notificaciones.success(r.respuesta);
        }, error => {
          Alertas.showHttpResponse(error, '¡ERROR!', true);
        });
      });
  }

  EditarCarrusel(carrusel) {
    this.router.navigate(['ecommerce/productosCarrusel/editar/', carrusel.carruselId]);
  }
}
