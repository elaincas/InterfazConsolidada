import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MovimientoDeProducto, MovimientoProductoDetalle } from '../../_Clases/MovimientoDeProducto'
import { Finalidades } from '../../_Clases/Finalidades';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';

import { RecepcionTrasladoService } from './recepcion-traslado.service';
import { ProductoGrid, ProductosGridTraslados } from '../../_Clases/GridTrasladoProductos';
import { DxButtonComponent, DxDataGridComponent } from 'devextreme-angular';
import { TrasladosEnviados } from '../../_Clases/TrasladosEnviados';
import { LoginService } from '../../../../login/services/login.service';
import customStorage from 'devextreme/data/custom_store';
import dataSource from 'devextreme/data/data_source';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';
import { InformacionEntregaRegalia } from '../../_Clases/informacion-entrega-regalia';

@Component({
  selector: 'app-recepcion-traslado',
  templateUrl: './recepcion-traslados.component.html',
  styleUrls: ['./recepcion-traslado.component.css'],
  providers: [RecepcionTrasladoService]
})


export class RecepcionTrasladosComponent implements OnInit {

  habilitarPopupIngreso: boolean = false;
  trasladosRecibidos: TrasladosEnviados[];
  trasladosDeSalida: TrasladosEnviados[];
  dataSourceSucursales: dataSource;
  sucursalSeleccionada: number;
  constructor(private service: RecepcionTrasladoService, private loginService: LoginService, private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService) {
    this.trasladosRecibidos = new Array<TrasladosEnviados>();
    this.trasladosDeSalida = new Array<TrasladosEnviados>();

  }

  ngOnInit() {
    this.configurarDataSource();
  };
  ObtenerTraslados() {
    this.service.ObtenerTraslados(this.sucursalSeleccionada).subscribe(data => {
      this.trasladosRecibidos = data as TrasladosEnviados[];
    });
  }
  _InformacionTrasladosProductosSalida: TrasladosEnviados[] = [];
  _validarSalida: boolean = false;
  _cantidadInformacionEntregaRegalia: number = 0;
  _cantidadInformacionEntregaRegaliaRecibida: number = 0;

  IngresarInventario(gridTrasladoRecibidos: DxDataGridComponent) {
    this.trasladosDeSalida = [];
    this._InformacionTrasladosProductosSalida = [];
    gridTrasladoRecibidos.instance.saveEditData();

    this.trasladosRecibidos.forEach(d => {
      if (d.CantidadSalida > 0) {
        d.UsuarioIdCrea = this.loginService.Usuario.id;
        d.FinalidadID = d.TipoSalida;
        d.InformacionEntregaRegalias = [];
        this.trasladosDeSalida.push(d)
        for (let i = 0; i < d.CantidadSalida; i++) {
          let salida = d;
          this._InformacionTrasladosProductosSalida.push(salida);

        }
        this._cantidadInformacionEntregaRegalia += d.CantidadSalida;
      }
    })
    if (this._cantidadInformacionEntregaRegalia == 0) {
      Alertas.error("No ingreso la cantidad de productos a la salida")
      return;
    }
    this._validarSalida = false;
    this.habilitarPopupIngreso = true;
  }

  onEditorPreparing(e: any): void {
    if (e.parentType == "dataRow" && e.dataField != "CantidadSalida") {
      e.editorOptions.readOnly = true;
    }
  }

  onRowUpdated(e: any): void {
    if (e.data.CantidadSalida > e.key.CantidadRestante) {
      Alertas.warning("Advertencia", "La cantidad de salida no puede ser mayor a la trasladada.");
      e.key.CantidadSalida = 0;
    }
  }

  Aceptar() {
Alertas.close();
    Alertas.load("Guardando")
    this._validarSalida = true;
  }

  Cancelar() {
    this.habilitarPopupIngreso = false;
    this._InformacionTrasladosProductosSalida = [];
    this._cantidadInformacionEntregaRegalia = 0;
    this._cantidadInformacionEntregaRegaliaRecibida = 0;
    this._validarSalida = false;
  }

  EsValidaSalida(): boolean {
    let esValido: boolean = true;

    this.trasladosDeSalida.forEach(data => {
      if (data.CantidadSalida <= 0) {
        esValido = false;
      }
      if (data.CantidadSalida > data.InformacionEntregaRegalias.length) {
        esValido = false;
      }
      data.InformacionEntregaRegalias.forEach(i => {
        if (!i.EsValidaInformacion) {
          Alertas.error("¡Error!", " La informacion Ingresada esta Incompleta.")
          esValido = false;
        }
      })
    });
    return esValido;
  }
  configurarDataSource() {



    const customs = new customStorage({
      load: this.buscarSucursales.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceSucursales = new dataSource({
      store: customs
    });
  }
  buscarSucursales(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceSucursales.searchValue();



      this.serviceInventarioProductoImpulsados.ObtenerSucursalesFiltradas(this.dataSourceSucursales.pageIndex().toString(), this.dataSourceSucursales.pageSize().toString(), textoBusqueda)
        .then(data => resolve(data));
    });
  }
  addItem(newItem: InformacionEntregaRegalia) {
    this.trasladosDeSalida.forEach(t => {
      if (t.MovimientoDetalleId == newItem.SalidaInventarioTrasladoId) {
        t.InformacionEntregaRegalias.push(newItem);
        this._cantidadInformacionEntregaRegaliaRecibida += 1;
        if (this._cantidadInformacionEntregaRegalia == this._cantidadInformacionEntregaRegaliaRecibida) {
          this.guardarSalida();
        }
      }
    })
  }

  guardarSalida(): void {

    if (this.EsValidaSalida()) {
      this.service.RealizarSalida(this.trasladosDeSalida).subscribe(data => {
        this.Cancelar()
        Alertas.ok("Éxito", "");
        this.ObtenerTraslados();
      }, error => {
        this._cantidadInformacionEntregaRegaliaRecibida = 0;
        this._validarSalida = false;
        this.trasladosDeSalida.forEach(t => {t.InformacionEntregaRegalias=[]});
        Alertas.warning("Advertencia", error)
      });
    }
    else {

      this._cantidadInformacionEntregaRegaliaRecibida = 0;
      this._validarSalida = false;
      this.trasladosDeSalida.forEach(t => {t.InformacionEntregaRegalias=[]});
    }
  }
}
