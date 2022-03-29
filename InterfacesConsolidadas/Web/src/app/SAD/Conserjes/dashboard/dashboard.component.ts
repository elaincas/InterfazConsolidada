import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPedidosEntregadosAsignadosResumen } from './models/IPedidosEntregadosAsignadosResumen';
import { IPedidosResumen } from './models/IPedidosResumen';
import { IPedidosVentasResumen } from './models/IPedidosVentasResumen';
import { IResumenDeConserjes } from './models/IResumenDeconserjes';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  pedidosResumen: IPedidosResumen[];
  pedidosEntregadosResumen: IPedidosEntregadosAsignadosResumen[];
  pedidosVentasResumen: IPedidosVentasResumen[];
  totalVentas: number;
  ventasMesActual: number;
  ventasMesAnterior: number;
  pedidosVentasResumenGrafico: IPedidosVentasResumen[];
  resumenDeConserjes: IResumenDeConserjes;
  meses: string[];
  fechaPedidos: Date;
  minutosTranscurridosResumenPedidos: number;
  minutosTranscurridosPedidos: number;
  minutosTranscurridosVentas: number;
  intervalDeMinutosResumenPedidos: NodeJS.Timer;
  intervalDeMinutosPedidos: NodeJS.Timer;
  intervalDeMinutosVentas: NodeJS.Timer;
  timeoutResumenPedidos: NodeJS.Timer;
  timeoutPedidos: NodeJS.Timer;
  timeoutVentas: NodeJS.Timer;
  loadingPedidos: boolean;
  loadingVentas: boolean;

  constructor(private _dashboardService: DashboardService) {
    this.customizeLabelPedidosVentas = this.customizeLabelPedidosVentas.bind(this);
    this.pedidosResumen = [];
    this.pedidosEntregadosResumen = [];
    this.pedidosVentasResumen = [];
    this.pedidosVentasResumenGrafico = [];
    this.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.fechaPedidos = new Date();
    this.minutosTranscurridosResumenPedidos = undefined;
    this.minutosTranscurridosPedidos = undefined;
    this.minutosTranscurridosVentas = undefined;
    this.loadingPedidos = false;
    this.loadingVentas = false;
    this.resumenDeConserjes = {
      cantidad: 0
    };
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalDeMinutosResumenPedidos);
    clearInterval(this.minutosTranscurridosPedidos);
    clearInterval(this.minutosTranscurridosVentas);
    clearTimeout(this.timeoutVentas);
    clearTimeout(this.timeoutPedidos);
    clearTimeout(this.timeoutResumenPedidos);
  }

  ngOnInit() {
    this.obtenerResumenDeConserjes();
    this.obtenerResumenDePedidos();
    this.obtenerDatosPedidos();
    this.obtenerResumenDeVentas();
  }

  obtenerResumenDeConserjes() {
    this._dashboardService.obtenerResumenDeConserjes().subscribe(data => this.resumenDeConserjes = data);

    setTimeout(() => this.obtenerResumenDeConserjes(), 600000)
  }

  obtenerResumenDePedidos() {
    let fechaFin = new Date();
    let fechaInicio = new Date();

    fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
    this._dashboardService.obtenerResumenPedidos(fechaInicio, fechaFin)
      .subscribe(data => {
        this.pedidosResumen = data;
        this.minutosTranscurridosResumenPedidos = 0;
        clearInterval(this.intervalDeMinutosResumenPedidos);
        this.intervalDeMinutosResumenPedidos = setInterval(() => this.minutosTranscurridosResumenPedidos++, 60000);
      });

    if (!this.timeoutResumenPedidos) clearTimeout(this.timeoutResumenPedidos);
    this.timeoutResumenPedidos = setTimeout(() => this.obtenerResumenDePedidos(), 600000)
  }

  obtenerDatosPedidos() {
    let fechaFin = new Date();
    let fechaInicio = new Date();
    this.loadingPedidos = true;

    fechaInicio.setDate(fechaFin.getDate() - 9);
    this._dashboardService.obtenerResumenPedidosEntregados(fechaInicio, fechaFin)
      .subscribe(data => {
        this.pedidosEntregadosResumen = data;
        this.minutosTranscurridosPedidos = 0;
        clearInterval(this.intervalDeMinutosPedidos);
        this.intervalDeMinutosPedidos = setInterval(() => this.minutosTranscurridosPedidos++, 60000);
      }, undefined, () => this.loadingPedidos = false);

    if (!this.timeoutPedidos) clearTimeout(this.timeoutPedidos);
    this.timeoutPedidos = setTimeout(() => this.obtenerDatosPedidos(), 600000)
  }

  obtenerResumenDeVentas() {
    this.loadingVentas = true;
    this._dashboardService.obtenerResumenVentas().subscribe(data => {
      this.pedidosVentasResumen = data;
      this.ventasMesActual = data[data.length - 1].total;
      this.ventasMesAnterior = data[data.length - 2].total;
      this.totalVentas = data.reduce((previousValue, currentValue) => previousValue + currentValue.total, 0)
      this.pedidosVentasResumenGrafico = data.slice(-4);
      this.minutosTranscurridosVentas = 0;
      clearInterval(this.intervalDeMinutosVentas);
      this.intervalDeMinutosVentas = setInterval(() => this.minutosTranscurridosVentas++, 60000);
    }, undefined, () => this.loadingVentas = false);

    if (!this.timeoutVentas) clearTimeout(this.timeoutVentas);
    this.timeoutVentas = setTimeout(() => this.obtenerResumenDeVentas(), 600000)
  }

  customizeLabelPedidosEntregados(args: any) {
    let options: any = {
      weekday: 'long',
      day: 'numeric'
    };

    let fecha = new Date(args.value);
    return fecha.toLocaleDateString('es-HN', options);
  }

  customizeLabelPedidosVentas(args: any) {
    return this.meses[args.value - 1];
  }

}
