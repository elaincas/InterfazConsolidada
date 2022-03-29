import { ReporteVenta } from './../_models/reporteVenta.model';
import { PedidosRecompraService } from './../_services/pedidos-recompra.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConfiguracionProductosRecompraService } from '../_services/configuracion-productos.service';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { Empresa } from '../../../shared/Models/Empresa.model';
import { MaestrosFarmaciaService } from '../../../maestros/maestros-farmacia.service'

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporteVenta.component.html',
  styleUrls: ['./reporteVenta.component.css']
})
export class ReporteVentaComponent implements OnInit {

  formReporte: FormGroup;
  reporteVenta: ReporteVenta[];
  fechaDesde: Date;
  fechaHasta: Date;
  empresaId : number = 2;

  listadoEmpresas: Empresa[];

  constructor(private _formBuilder: FormBuilder, 
    private _recompraService: PedidosRecompraService,
    private _maestrosService: MaestrosFarmaciaService) { }

  ngOnInit() {
    this.cargarVariables();
    this.ObtenerEmpresas();
  }

  cargarVariables(): void {
    let dateDesdeInicial = new Date(), dateHastaInicial = new Date();
    dateDesdeInicial.setHours(0, 0, 0, 0);
    dateHastaInicial.setHours(23, 59, 0, 0);

    this.formReporte = this._formBuilder.group({
      dateDesde: new FormControl(dateDesdeInicial),
      dateHasta: new FormControl(dateHastaInicial),
      lookupEmpresa: new FormControl()
    });
  }

  cargarReporte(): void {
    Alertas.load();
    this.empresaId = this.formReporte.get('lookupEmpresa').value;
    this.fechaDesde = this.formReporte.get('dateDesde').value;
    this.fechaHasta = this.formReporte.get('dateHasta').value;
    this._recompraService.ObtenerReporteDeVentas(this.fechaDesde, this.fechaHasta, this.empresaId
    ).subscribe(data => {
      this.reporteVenta = data;
      Alertas.close();
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  nombreArchivoExcel() {
    let nombreFechaDesde = '';
    let nombreFechaHasta = '';

    if (this.fechaDesde) {
      nombreFechaDesde = this.fechaDesde.toLocaleString();
    }
    if (this.fechaHasta) {
      nombreFechaHasta = this.fechaHasta.toLocaleString();
    }

    return `Reporte de ventas ${nombreFechaDesde} - ${nombreFechaHasta}`;
  }

  calculateSelectedRow(options) {
    if (options.name === "totalFactura") {
        if (options.summaryProcess === "start") {
            options.totalValue = 0;
        } else if (options.summaryProcess === "calculate") {

                options.totalValue = options.totalValue + (options.value.totalFactura-options.value.totalNC );

        }
    }
}
OnRowPrepared(e:any):void{
  if (e.rowType !== "data")  {
  return
}
if( e.data.totalNC >0){

  e.cellElement.style.color= "white";
  e.cellElement.style.backgroundColor="#F04137"
}
    // Tracks the `Amount` data field


}

ObtenerEmpresas() {
  this._maestrosService.ObtenerEmpresas().subscribe(
    (response) => {
      this.listadoEmpresas = response;
    },
    (error) => {
      //add error alert
      console.info("error", error);
    }
  );
}
}
