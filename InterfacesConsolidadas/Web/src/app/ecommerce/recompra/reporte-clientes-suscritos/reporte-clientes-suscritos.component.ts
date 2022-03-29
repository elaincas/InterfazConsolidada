import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { listaPedidoReorderEstados, listaPedidoTipos } from '../_models/FormReportePedidos';
import { AdministracionPedidosService } from '../../../SAD/administracion-pedidos/services/administracion.pedidos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Sucursal } from '../../../SAD/administracion-pedidos/models/ReportePedido';
import { Empresa } from '../../../shared/Models/Empresa.model'
import { MaestrosFarmaciaService } from '../../../maestros/maestros-farmacia.service';

@Component({
  selector: 'app-reporte-clientes-suscritos',
  templateUrl: './reporte-clientes-suscritos.component.html',
  styleUrls: ['./reporte-clientes-suscritos.component.css'],
  providers: [AdministracionPedidosService]
})
export class ReporteClientesSuscritosComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  dataSource: any;
  formReporte: FormGroup;
  popupFiltrosVisible: boolean = true;
  fechaDebeRealizarsePedidoDesde: Date;
  fechaDebeRealizarsePedidoHasta: Date;
  pedidoReorderEstados = listaPedidoReorderEstados;
  pedidoTipos = listaPedidoTipos;
  sucursales: Sucursal[];

  listadoEmpresas: Empresa[];

  constructor(private _AdministracionPedidosService: AdministracionPedidosService,
              private _formBuilder: FormBuilder,
              public _httpClient: HttpClient,
              private _maestrosService: MaestrosFarmaciaService)
  {
    this.dataSource = {};
    this.fechaDebeRealizarsePedidoDesde = new Date();
    this.fechaDebeRealizarsePedidoHasta = new Date();
  }

  cargarReporte(){
    var empresaId = this.formReporte.get('lookupEmpresa').value;
    this.dataSource = new CustomStore({
      key: 'identidad',
      load: (loadOptions: any) => {
        let params: HttpParams = new HttpParams();
        [
          'skip',
          'take',
          'requireTotalCount',
          'requireGroupCount',
          'sort',
          'filter',
          'totalSummary',
          'group',
          'groupSummary',
        ].forEach((i) => {
          if (i in loadOptions && this.isNotEmpty(loadOptions[i]))
            params = params.set(i, JSON.stringify(loadOptions[i]));
        });

        params = params.set('mostrarClientesSuscritos', `${this.formReporte.get('checkSuscrito').value}`);
        params = params.set('noIdentidad', `${this.formReporte.get('noIdentidad').value}`);
        params = params.set('nombreCliente', `${this.formReporte.get('nombreCliente').value}`);
        params = params.set('celularCliente', `${this.formReporte.get('celularCliente').value}`);
        params = params.set('productoId', `${this.formReporte.get('codigoProducto').value}`);
        params = params.set('sucursalId', `${this.formReporte.get('sucursalId').value}`);
        params = params.set('pedidoReorderEstadoId', `${this.formReporte.get('pedidoReorderEstado').value}`);
        params = params.set('pedidoTipoId', `${this.formReporte.get('tipoPedido').value}`);
        params = params.set('empresaId', `${this.formReporte.get('lookupEmpresa').value}`)

        if(this.fechaDebeRealizarsePedidoDesde != undefined){
          params = params.set('fechaDebeRealizarsePedidoDesde', this.fechaDebeRealizarsePedidoDesde.toDateString());
        }
        if(this.fechaDebeRealizarsePedidoHasta != undefined){
          params = params.set('fechaDebeRealizarsePedidoHasta', this.fechaDebeRealizarsePedidoHasta.toDateString());
        }

        return this._httpClient
          .get
          (
            `${environment.recompraConfiguracionProductos}/api/reportes/ObtenerClientesSuscritos`,
            {params: params}
          )
          .toPromise()
          .then((data: any) => {

            if(this.popupFiltrosVisible){
              this.popupFiltrosVisible = false;
            }

            return {
              data: data.data,
              totalCount: data.totalCount,
              summary: data.summary,
              groupCount: data.groupCount,
            };
          })
          .catch((error) => {
            throw 'Hubo un error';
          });
      },
    });
  }

  ngOnInit() {
    this.ObtenerSucursales();
    this.ObtenerEmpresas();
    this.formReporte = this._formBuilder.group({
      checkSuscrito: new FormControl(true),
      noIdentidad: new FormControl(),
      nombreCliente: new FormControl(),
      celularCliente: new FormControl(),
      codigoProducto: new FormControl(),
      sucursalId: new FormControl(),
      pedidoReorderEstado: new FormControl(),
      tipoPedido: new FormControl(),
      fechaDebeRealizarsePedidoDesde: new FormControl(),
      fechaDebeRealizarsePedidoHasta: new FormControl(),
      lookupEmpresa: new FormControl()
    });
  }

  ObtenerSucursales() {
    this._AdministracionPedidosService.ObtenerSucursales().subscribe(data => {
      this.sucursales = data;
    });
  }

  CambiarEstadoVisibePopUpDeFiltros(e) {
    this.popupFiltrosVisible = !this.popupFiltrosVisible;
  }

  refreshDataGrid() {
    this.dataGrid.instance.refresh();
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
            width: 140,
            text: 'Filtrar Reporte',
            onClick: this.CambiarEstadoVisibePopUpDeFiltros.bind(this)
          }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
            icon: 'refresh',
            onClick: this.refreshDataGrid.bind(this)
        }
    });
  }

  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }

  nombreArchivoExcel() {
    const date = new Date();
    return `Clientes Suscritos - ${date.toDateString()}`;
  }

  ObtenerEmpresas() {
    this._maestrosService.ObtenerEmpresas().subscribe(
      (response) => {
        this.listadoEmpresas = response;
      },
      (error) => {
        console.info("error", error);
      }
    );
  }

}
