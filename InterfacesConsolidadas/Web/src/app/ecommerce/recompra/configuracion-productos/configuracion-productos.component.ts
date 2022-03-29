import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { ConfiguracionProductosRecompraService } from '../_services/configuracion-productos.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'recompra-configuracion-productos',
  templateUrl: './configuracion-productos.component.html',
  styleUrls: ['./configuracion-productos.component.css'],
  providers: [ConfiguracionProductosRecompraService]
})
export class ConfiguracionProductosRecompraComponent implements OnInit {

  // Variables de control
  now: Date = new Date();
  distribuidoresResult: any;
  lineasResult: any;
  proveedoresResult: any;
  productosFiltradosResult: any;
  productosTodosResult: any;

  usoContinuoOpciones = [
    { "id": 1, "texto": "Cualquiera" },
    { "id": 2, "texto": "Sí" },
    { "id": 3, "texto": "No" },
  ];

  @ViewChild('gridProveedores') proveedoresDataGrid: DxDataGridComponent;
  _proveedoresSeleccionados: string[];
  set proveedoresSeleccionadosChange(value: any[]) {
    this._proveedoresSeleccionados = value.map(v => v.identificador) || [];
  }
  set proveedoresSeleccionados(value: string[]) {
    this._proveedoresSeleccionados = value || [];
    if (!value)
      this.proveedoresDataGrid.instance.deselectAll();
  }
  get proveedoresSeleccionados(): string[] {
    return this._proveedoresSeleccionados;
  }

  @ViewChild('gridProductos') productosDataGrid: DxDataGridComponent;
  _productosSeleccionados: string[];
  set productosSeleccionadosChange(value: any[]) {
    this._productosSeleccionados = value.map(v => v.identificador) || [];
  }
  set productosSeleccionados(value: string[]) {
    this._productosSeleccionados = value || [];
    if (!value)
      this.productosDataGrid.instance.deselectAll();
  }
  get productosSeleccionados(): string[] {
    return this._productosSeleccionados;
  }

  @ViewChild('gridDistribuidores') distribuidoresDataGrid: DxDataGridComponent;
  _distribuidoresSeleccionados: string[];
  set distribuidoresSeleccionadosChange(value: any[]) {
    this._distribuidoresSeleccionados = value.map(v => v.identificador) || [];
  }
  set distribuidoresSeleccionados(value: string[]) {
    this._distribuidoresSeleccionados = value || [];
    if (!value)
      this.distribuidoresDataGrid.instance.deselectAll();
  }
  get distribuidoresSeleccionados(): string[] {
    return this._distribuidoresSeleccionados;
  }

  @ViewChild('gridLineas') lineasDataGrid: DxDataGridComponent;
  _lineasSeleccionadas: string[];
  set lineasSeleccionadasChange(value: any[]) {
    this._lineasSeleccionadas = value.map(v => v.identificador) || [];
  }
  set lineasSeleccionadas(value: string[]) {
    this._lineasSeleccionadas = value || [];
    if (!value)
      this.lineasDataGrid.instance.deselectAll();
  }
  get lineasSeleccionadas(): string[] {
    return this._lineasSeleccionadas;
  }

  usoContinuoValorSeleccionado: number = 1;

  // Variables persistentes
  productosConfigurar: any[];
  porcentajeDescuento: any;
  porcentajeDePuntos: number = 1;
  cantidadFijaPuntos: any;

  constructor(
    private configuracionProductosService: ConfiguracionProductosRecompraService
  ) { }

  ngOnInit() {
    this.Limpiar();

    this.CargarInformacionMaestros();
  }

  CargarInformacionMaestros() {
    const peticionesARealizar = 4;
    var peticionesYaFinalizadas = 0;

    Alertas.load();

    this.configuracionProductosService
      .ObtenerTodosProductos().subscribe(r => {
        this.productosTodosResult = r;
        peticionesYaFinalizadas++;

        if (peticionesYaFinalizadas >= peticionesARealizar)
          Alertas.close();

      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });

    this.configuracionProductosService
      .ObtenerDistribuidores().subscribe(r => {
        this.distribuidoresResult = r;
        peticionesYaFinalizadas++;

        if (peticionesYaFinalizadas >= peticionesARealizar)
          Alertas.close();

      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });

    this.configuracionProductosService
      .ObtenerLineas().subscribe(r => {
        this.lineasResult = r;
        peticionesYaFinalizadas++;

        if (peticionesYaFinalizadas >= peticionesARealizar)
          Alertas.close();

      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });

    this.configuracionProductosService
      .ObtenerProveedores().subscribe(r => {
        this.proveedoresResult = r;
        peticionesYaFinalizadas++;

        if (peticionesYaFinalizadas >= peticionesARealizar)
          Alertas.close();

      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });

  }

  ActualizarConfiguracionesGrupo(productos: any[], porcentajeDescuento: any, cantidadFijaPuntos: any, porcentajeDePuntos: any) {

    let productosConfigurar = [];

    for (var prod of productos) {
      productosConfigurar.push({
        PorcentajeDePuntos: porcentajeDePuntos,
        PorcentajeDescuento: porcentajeDescuento,
        CantidadFijaPuntos: cantidadFijaPuntos,
        Identificador: prod.identificador
      })
    }

    this.productosConfigurar = productosConfigurar;

    this.GuardarConfiguracionProductos();
  }

  GuardarConfiguracionProductos() {
    Alertas.question('', `¿Desea actualizar ` + this.productosConfigurar.length + ` productos?`, "Sí", "No").then(() => {
      Alertas.load();

      // for (var prod of this.productosConfigurar) {
      //   prod.PorcentajeDescuento = prod.PorcentajeDescuento / 100 + 1
      // }

      this.configuracionProductosService.GuardarConfiguracionProductos(this.productosConfigurar)
        .subscribe(r => {
          // setTimeout(() => {
          //   this.productosConfigurar = [];
          //   this.FiltrarProductos();
          // }, 5000);
          Alertas.ok("¡Éxito!", r.mensaje);
        }, error => {
          Alertas.close();
          Alertas.showHttpResponse(error, '¡Error!', false);
        });
    });
  }

  ActualizarConfiguracionesTodos() {

    let productosConfigurar = [];
    let productosUnificados = this.productosFiltradosResult.map(p => p.productos).flat(1);
    for (var prod of productosUnificados) {
      productosConfigurar.push({
        PorcentajeDePuntos: this.porcentajeDePuntos,
        PorcentajeDescuento: this.porcentajeDescuento,
        CantidadFijaPuntos: this.cantidadFijaPuntos,
        Identificador: prod.identificador
      })
    }

    this.productosConfigurar = productosConfigurar;
    this.GuardarConfiguracionProductos();
  }

  ActualizarConfiguracionesProducto(producto: any) {
    producto
    let productosConfigurar = [producto];
    this.productosConfigurar = productosConfigurar;
    this.GuardarConfiguracionProductos();
  }

  CargarProductosEspecificos() {
    Alertas.load();
    this.configuracionProductosService
      .ObtenerProductos(
        {
          ProductosId: this.productosSeleccionados
        }
      ).subscribe(r => {
        this.productosFiltradosResult = r;
        Alertas.close();
      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });
  }

  FiltrarProductos() {
    Alertas.load();

    let usoContinuoSeleccionado = this.usoContinuoValorSeleccionado == 1 ? null : this.usoContinuoValorSeleccionado == 2 ? true : false;

    this.configuracionProductosService
      .ObtenerProductos(
        {
          DistribuidoresId: this.distribuidoresSeleccionados,
          ProveedoresId: this.proveedoresSeleccionados,
          LineasId: this.lineasSeleccionadas,
          UsoContinuo: usoContinuoSeleccionado
        }
      ).subscribe(r => {
        this.productosFiltradosResult = r;
        Alertas.close();
      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });
  }

  Limpiar() {
    this.now = new Date();

    this.distribuidoresSeleccionados = [];
    this.proveedoresSeleccionados = [];
    this.lineasSeleccionadas = [];
    this.productosSeleccionados = [];

    this.productosConfigurar = [];
    this.porcentajeDescuento = 0.0;
    this.porcentajeDePuntos = 1;
    this.cantidadFijaPuntos = 0;
  }
}
