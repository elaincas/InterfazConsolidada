import { Component, OnInit } from '@angular/core';
import { CuponesAdminService } from '../services/cupones-admin.service';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { Router } from '@angular/router';
import {isUndefined} from "util";

@Component({
  selector: 'app-lista-cupones',
  templateUrl: './lista-cupones.component.html',
  styleUrls: ['./lista-cupones.component.css'],
  providers: [ CuponesAdminService]
})
export class ListaCuponesComponent implements OnInit {

  constructor( private cuponesService: CuponesAdminService,
               private router: Router) { }

  listaCuponesConSucursales = [];

  ngOnInit() {
    this.ObtenerListadoCuponesConSucursal();
  }

  ObtenerListadoCuponesConSucursal() {
    this.cuponesService.ObtenerListaCuponesConSucursalesAsigandas().subscribe(r => {
      this.listaCuponesConSucursales = r;
      this.listaCuponesConSucursales.forEach( cupon => {
        // const valorRestar = Math.floor(cupon.factorPuntosExtra / 100);
        const valorRestar = 1;
        cupon.factorPuntosExtra = cupon.factorPuntosExtra - valorRestar;
      });
    });
  }

  DesactivarSucursal(listaSucursales, sucursal, cuponId) {
    if (listaSucursales.length === 1) {
      Alertas.warning('No se puede Eliminar', 'El cupón debe tener al menos 1 sucursal asignada.');
      return;
    }
    Alertas.question(``, '¿Está seguro de que desea eliminar esta Sucursal?')
      .then(() => {
        const indexSucursal = listaSucursales.indexOf(sucursal);
        this.cuponesService.EliminarSucursalDeCupon(cuponId, sucursal.codigo).subscribe(r => {
          Alertas.ok('¡Correcto!', r.respuesta);
          listaSucursales.splice(indexSucursal, 1);
        }, error => {
          Alertas.showHttpResponse(error, '¡ERROR!', true);
        });
      });
  }

  ActivarDesactivarCupon(cupon, accion) {
    let mensajeAccion = 'desactivar';
    let mensajeResultado = 'desactivó';
    if (accion) {
      mensajeAccion = 'activar';
      mensajeResultado = 'activó';
    }
    Alertas.question(``, `¿Está seguro de que desea ${mensajeAccion} el Cupón "${ cupon.descripcion }"?`)
      .then(() => {
        const indexCupon = this.listaCuponesConSucursales.indexOf(cupon);
        this.cuponesService.ActivarDesactivarCupon(cupon.cuponID, accion).subscribe(r => {
          Alertas.ok('¡Correcto!', `Se ${mensajeResultado} el cupón "${ r.descripcion }"`);
          this.listaCuponesConSucursales.splice(indexCupon, 1);
          this.ObtenerListadoCuponesConSucursal();
        }, error => {
          Alertas.showHttpResponse(error, '¡ERROR!', true);
        });
      });
  }

  EditarCupon(cupon) {
    this.router.navigate(['mercadeo/cupones/editarCupon', cupon.cuponID]);
  }

  CambiarFondoInactivo(event) {
    if (event.rowType === 'data' && event.data.activo === false) {
      // if (!isUndefined(event.rowElement)) {
      //       if (event.data.activo === false) {
      //         event.rowElement.style.backgroundColor = '#f77e7e';
      //         event.rowElement.childNodes.forEach(r => {
      //           r.
      //         });
      //   }
      // }
    }
  }
}
