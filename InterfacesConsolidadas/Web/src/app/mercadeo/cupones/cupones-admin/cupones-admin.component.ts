import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../../login/services/login.service';
import {CuponesAdminService} from '../services/cupones-admin.service';
import {Cupon} from './models/Cupon';
import {CuponesSucursales} from './models/CuponesSucursales';
import {Sucursal} from './models/Sucursal';
import DevExpress from 'devextreme/bundles/dx.all';
import {AddCuponSucursales} from './models/AddCuponSucursales';
import {Alertas} from '../../../helpers/notificaciones/notificaciones';
import {ActivatedRoute, Router} from '@angular/router';
import {helpers} from '../../../helpers/utils';
import {Forms} from '../../../helpers/forms';

@Component({
  selector: 'app-cupones-admin',
  templateUrl: './cupones-admin.component.html',
  styleUrls: ['./cupones-admin.component.css'],
  providers: [CuponesAdminService, LoginService]
})
export class CuponesAdminComponent implements OnInit {
  constructor(private cuponService: CuponesAdminService,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private router: Router) {
    this.cupon = new Cupon();
    this.cuponSucursal = new AddCuponSucursales();
    this.minDate = new Date(Date.now());
    this.Ids_SucursalesSeleccionadas = [];
    this.Ids_SucursalesEliminadas = [];
    this.sucursalesSeleccionadas = [];
  }

  // Modelos
  cupon: Cupon;
  cuponSucursal: AddCuponSucursales;
  listaSucursales: Array<any>;
  Ids_SucursalesSeleccionadas: Array<any>;
  Ids_SucursalesEliminadas: Array<any>;
  sucursalesSeleccionadas: Array<any>;
  ejemploPuntosPorPorcentaje = 0;

  // Control
  minDate: Date = new Date();
  sucursalID_seleccionada = 0;
  modo: Forms.Modo = Forms.Modo.Agregar;

  ngOnInit() {
    this.configurarModoFormulario();
    this.ObtenerSucurales();
  }

  ObtenerSucurales() {
    this.cuponService.ObtenerSucurales().subscribe(r => {
        this.listaSucursales = r;
      });
  }

  configurarModoFormulario() {
    this.route.url.subscribe(rutas => {
      const ruta = rutas.find(x => x.path == 'crearCupon');
      if (!helpers.isNull(ruta)) {
        window.loader.hide();
        return;
      }

      this.modo = Forms.Modo.Actualizar;
      this.route.params.subscribe(params => {
        const id = params.cuponId as number;
        this.ObtenerCuponConSucursalesPorId(id);
      });
    });
  }

  ObtenerCuponConSucursalesPorId(cuponId) {
    this.cuponService.ObtenerCuponConSucursalesPorId(cuponId).subscribe(r => {
      this.cupon = r;
      this.minDate = r.fechaInicio;
      this.sucursalesSeleccionadas = r.sucursales;
      this.sucursalesSeleccionadas.forEach(s => {
        this.Ids_SucursalesSeleccionadas.push(s.codigo);
        this.cuponSucursal.sucursales = this.Ids_SucursalesSeleccionadas;
      });
      const valorRestar = 1;
      this.cupon.factorPuntosExtra = this.cupon.factorPuntosExtra - valorRestar;
    });
  }
  AgregarSucursal() {
    this.cupon.todasLasSucursales = false;
    const self = this;
    if (this.sucursalID_seleccionada === 0) {
      return;
    }
    if (!this.sucursalHaSidoSeleccionada(this.sucursalID_seleccionada)) {
      this.Ids_SucursalesSeleccionadas.push(this.sucursalID_seleccionada);
      this.sucursalesSeleccionadas.push(
        this.listaSucursales.find(function (sucursal){
          return sucursal.codigo === self.sucursalID_seleccionada;
        } ));
    }
  }

  EliminarSucursalDeLista(sucursal) {
    const indexSucursal = this.sucursalesSeleccionadas.indexOf(sucursal);
    this.sucursalesSeleccionadas.splice(indexSucursal, 1);
    this.Ids_SucursalesSeleccionadas.splice(indexSucursal, 1);
    if (this.modo === Forms.Modo.Actualizar) {
      this.Ids_SucursalesEliminadas.push(sucursal.codigo);
    }
  }

  GuardarCupon() {
    if (!this.validarCupon()) {
      return;
    }
    this.cupon.usuarioId = this.loginService.Usuario.id;
    this.cuponSucursal.sucursales = this.Ids_SucursalesSeleccionadas;
    this.cuponSucursal.sucursalesEliminadas = this.Ids_SucursalesEliminadas;
    Alertas.load();
    if (this.modo === Forms.Modo.Actualizar) {
      this.cuponService.EditarCupon(this.cupon, this.cuponSucursal).subscribe( r => {
        Alertas.ok('¡Correcto!', `${ r.respuesta }`);
        this.limpiar();
      }, error => {
        Alertas.showHttpResponse(error, '¡ERROR!', true);
      });
      return;
    }

    this.cuponService.CrearCupon(this.cupon, this.cuponSucursal).subscribe( r => {
      Alertas.ok('¡Correcto!', `${ r.respuesta }`);
      this.limpiar();
    }, error => {
      Alertas.showHttpResponse(error, '¡ERROR!', true);
    });
  }

  // FUNCIONES Secundarias
  validarCupon(): boolean {
    if (this.cupon.descripcion === '') {
      Alertas.error('¡ERROR!', 'Debe ingresar una descripción');
      return false;
    }

    if (this.cupon.rangoFin <= this.cupon.rangoInicio) {
      Alertas.error('¡ERROR!', 'El valor del rango final debe ser mayor al rango de inicio');
      return false;
    }

    if (this.cupon.tieneLimiteMontoEnFactura && this.cupon.montoMaximoFactura === 0 && this.cupon.montoMinimoFactura === 0) {
      Alertas.error('¡ERROR!', 'Si desea establecer un límite en la factura, debe ingresar el valor del monto mínimo o del máximo.');
      return false;
    }

    return true;
  }

  onTodasSucursalesChanged(event) {
    if (this.cupon.todasLasSucursales && this.sucursalesSeleccionadas.length > 0) {
      Alertas.question('Se limpiará la lista de sucursales',
        `¿Está seguro de que desea asignar todas las sucursales al cupón?`)
        .then(r => {
          this.Ids_SucursalesSeleccionadas = [];
          this.sucursalesSeleccionadas = [];
          this.cuponSucursal = new AddCuponSucursales();
        })
        .catch(r => {
          this.cupon.todasLasSucursales = false;
        });
    }
  }

  sucursalHaSidoSeleccionada(sucursalId): boolean {
    let seSelecciono = false;
    if (this.sucursalesSeleccionadas.length > 0) {
      seSelecciono = !!this.sucursalesSeleccionadas.find(function (s){
        return s.codigo === sucursalId;
      });
    }
    return seSelecciono;
  }

  limpiar() {
    this.cupon = new Cupon();
    this.Ids_SucursalesSeleccionadas = [];
    this.sucursalesSeleccionadas = [];
    this.cuponSucursal = new AddCuponSucursales();
    this.router.navigate(['mercadeo/cupones/listadoCupones']);
  }
}
