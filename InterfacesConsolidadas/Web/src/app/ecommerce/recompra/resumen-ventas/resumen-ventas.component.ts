import { ReporteVentasPorDia } from './../_models/reporteVentasPorDia.model';
import { PedidosRecompraService } from './../_services/pedidos-recompra.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { Empresa } from '../../../shared/Models/Empresa.model';
import { MaestrosFarmaciaService } from '../../../maestros/maestros-farmacia.service';

@Component({
  selector: 'app-resumen-ventas',
  templateUrl: './resumen-ventas.component.html',
  styleUrls: ['./resumen-ventas.component.css']
})
export class ResumenVentasComponent implements OnInit {

  formReporte: FormGroup;
  reporteVentasPorDia: ReporteVentasPorDia[];
  reporte: any[];
  graficoDataSorce: any[] = [];

  
  listadoEmpresas: Empresa[];

  constructor(private _pedidosService: PedidosRecompraService,
    private _formBuilder: FormBuilder,
    private _maestrosService: MaestrosFarmaciaService) { }

  ngOnInit() {
    this.cargarVariables();
    this.ObtenerEmpresas();
  }

  cargarVariables(): void {
    this.formReporte = this._formBuilder.group({
      dateDesde: new FormControl(new Date()),
      dateHasta: new FormControl(new Date()),
      lookupEmpresa: new FormControl()
    });
  }

  obtenerReporteDeVentas(): void {
    Alertas.load();
    var empresaId = this.formReporte.get('lookupEmpresa').value
    this._pedidosService.ObtenerResumenDeFacturas(this.formReporte.get('dateDesde').value,
      this.formReporte.get('dateHasta').value, empresaId)
      .subscribe(data => {
        this.reporteVentasPorDia = data;
        // this.obtenerResumen();
        Alertas.close();
      }, error => {
        Alertas.showHttpResponse(error);
      });
  }

  obtenerResumen(): void {
    this.graficoDataSorce = [];

    const cantidadFacturas = this.reporteVentasPorDia.reduce(
      (sum, data) => sum + data.cantidadFacturas,
      0
    );

    const meta = 300;
    const avance = (cantidadFacturas / meta) * 100;

    this.graficoDataSorce.push(
      {
        titulo: 'Total',
        total: 100
      },
      {
        titulo: 'Clientes Suscritos',
        total: avance
      },
    );
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
