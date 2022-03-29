import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import {AdministracionPedidosService} from '../../services/administracion.pedidos.service';
import {EstadoPedido, ReportePedido, Marker, Sucursal} from '../../models/ReportePedido';
import CustomStore from 'devextreme/data/custom_store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Conserje } from '../../../Conserjes/Administrar-Conserjes/models/Conserje';
import { Ciudad } from '../../../../maestros/colonias/models/ciudad.model';
import { AdministrarConserjesService } from '../../../Conserjes/Administrar-Conserjes/services/administrar.conserjes.service';
import { ColoniaService } from '../../../../maestros/colonias/services/coloniaService.service';
import { DxDataGridComponent } from 'devextreme-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reporte-administracion-pedidos',
  templateUrl: './reporte-administracion-pedidos.component.html',
  styleUrls: ['./reporte-administracion-pedidos.component.css'],
  providers: [AdministracionPedidosService]
})
export class ReporteAdministracionPedidosComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  dataSource: any;
  formReporte: FormGroup;
  fechaPedidoRealizado: Date;

  conserjes: Conserje[];
  ciudades: Ciudad[];
  estados: EstadoPedido[];
  sucursales: Sucursal[];

  popupFiltrosVisible: boolean = true;
  popupMapaGeneralVisible: boolean = false;

  customMarkerUrl: string;
  markers: Marker[];

  constructor(private _AdministracionPedidosService: AdministracionPedidosService,
    private conserjesService: AdministrarConserjesService,
    private coloniaService: ColoniaService,
    private _formBuilder: FormBuilder,
    public _httpClient: HttpClient,
    private router: Router,)
    {
      this.fechaPedidoRealizado = new Date();
      this.customMarkerUrl = "https://s3.amazonaws.com/assets.farmaciasiman.com/public/logos/marker_sad.png";
      this.cargarReporte = this.cargarReporte.bind(this);
    }

    cargarReporte(): void{

      let service = this;
      this.dataSource = new CustomStore({
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
            if (i in loadOptions && service.isNotEmpty(loadOptions[i]))
              params = params.set(i, JSON.stringify(loadOptions[i]));
          });

          params = params.set('noIdentidad', `${service.formReporte.get('noIdentidad').value}`);
          params = params.set('conserjeId', `${service.formReporte.get('conserjeId').value}`);
          params = params.set('sucursalId', `${service.formReporte.get('sucursalId').value}`);
          params = params.set('estadoPedidoId', `${service.formReporte.get('estadoPedidoId').value}`);
          if(service.fechaPedidoRealizado != undefined){
            params = params.set('fechaPedidoRealizado', service.fechaPedidoRealizado.toDateString());
          }
          params = params.set('ciudad', `${service.formReporte.get('ciudad').value}`);
          params = params.set('codigoPedido', `${service.formReporte.get('codigoPedido').value}`);
          params = params.set('facturaId', `${service.formReporte.get('facturaId').value}`);

          return service._httpClient.get(`${environment.conserjesApi}/api/Conserjes/ObtenerReportePedidos`,{params: params})
            .toPromise()
            .then((data: any) => {

              if(service.popupFiltrosVisible){
                service.popupFiltrosVisible = false;
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
        }
      });
    }

    ngOnInit() {
      this.obtenerCiudades();
      this.obtenerConserjes();
      this.obtenerEstadosPedidos();
      this.ObtenerSucursales();
      this.formReporte = this._formBuilder.group({
        noIdentidad: new FormControl(),
        conserjeId: new FormControl(),
        sucursalId: new FormControl(),
        estadoPedidoId: new FormControl(),
        fechaPedidoRealizado: new FormControl(),
        ciudad: new FormControl(),
        codigoPedido: new FormControl(),
        facturaId: new FormControl(),
      });
    }

    obtenerCiudades(): void {
      this.coloniaService.ObtenerCiudades().subscribe(data => {
        this.ciudades = data;
      });
    }

    obtenerEstadosPedidos(): void {
      this._AdministracionPedidosService.ObtenerEstados().subscribe(data => {
        this.estados = data.data.estados;
      });
    }

    obtenerConserjes(): void {
      this.conserjesService.ObtenerConserjes({
        nombre: "",
        cargarUltimaUbicacion: false,
        cargarPedidosPendientes: false,
      }).subscribe(data => {
        this.conserjes = data;
      });
    }

    ObtenerSucursales() {
      this._AdministracionPedidosService.ObtenerSucursales().subscribe(data => {
        this.sucursales = data;
      });
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
          location: 'before',
          widget: 'dxButton',
          options: {
              width: 140,
              text: 'Abrir Mapa',
              onClick: this.NavegarAMapaDeConserjes.bind(this)
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

    refreshDataGrid() {
      this.dataGrid.instance.refresh();
    }

    ObtenerEstadoPedidoPorId(estadoPedidoId: number){
      return this.estados.find(x => x.estadoPedidoID == estadoPedidoId).descripcion;
    }

    VisualizarMarcadorEnMapa(pedido: ReportePedido){
      this.markers = [];
      this.markers.push({
        location: [pedido.latitudFacturaRecibida.toString().replace(',','.'), pedido.longitudFacturaRecibida.toString().replace(',','.')],
        tooltip: {
            isShown: false,
            text: 'Conserje: <b>' + pedido.conserje.nombre + ' #' + pedido.conserje.codigoVhur + '</b><br/> Fecha de entrega: <b>' + new Date(pedido.fechaDeRecepcionPorCliente).toLocaleDateString() + ' ' + new Date(pedido.fechaDeRecepcionPorCliente).toLocaleTimeString() + '</b>'
        }
      });
      this.popupMapaGeneralVisible = true;
    }

    CambiarEstadoVisibePopUpDeFiltros(e) {
      this.popupFiltrosVisible = !this.popupFiltrosVisible;
    }

    NavegarAMapaDeConserjes(e) {
      this.router.navigate(['sad/mapa-conserjes']);
    }

    isNotEmpty(value: any): boolean {
      return value !== undefined && value !== null && value !== "";
    }

    conserjeCustomText(conserjeCellInfo: any){
      return  conserjeCellInfo.data.conserje != null ? 'VHUR: ' + conserjeCellInfo.data.conserje.codigoVhur: '';
    }

    clienteCustomText(clienteCellInfo: any){
      return  clienteCellInfo.data.cliente != null ? clienteCellInfo.data.cliente.nombre: '';
    }

    customCellDateText (cellDateInfo) {
      return new Date(cellDateInfo.value).toDateString() + '<br> <span class="text-muted">' + new Date(cellDateInfo.value).toTimeString() + '</span>';
    }
}