import { Component, OnDestroy, OnInit } from '@angular/core';
import { Conserje, FiltrosConjerje } from '../../../Administrar-Conserjes/models/Conserje';
import { AdministrarConserjesService } from '../../../Administrar-Conserjes/services/administrar.conserjes.service';

@Component({
  selector: 'app-conserjes-activos',
  templateUrl: './conserjes-activos.component.html',
  styleUrls: ['./conserjes-activos.component.css']
})
export class ConserjesActivosComponent implements OnInit, OnDestroy {
  fecha: Date;
  conserjes: Conserje[];
  loadingVisible: boolean;
  filtros: FiltrosConjerje;
  minutosTranscurridos: number;
  timeoutConserjes: NodeJS.Timer;
  intervalDeMinutosConserjes: NodeJS.Timer;

  constructor(private conserjesService: AdministrarConserjesService) {
    this.fecha = new Date();
    this.conserjes = [];
    this.filtros = {
      nombre: '',
      fechaComienzo: this.fecha,
      fechaFin: this.fecha,
      cargarPedidosPendientes: true,
      cargarUltimaUbicacion: true
    };
    this.minutosTranscurridos = undefined;
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalDeMinutosConserjes);
    clearTimeout(this.timeoutConserjes);
  }

  ngOnInit() {
    this.cargarConserjesRecursivo();
  }

  cargarConserjes() {
    this.loadingVisible = true;
    this.conserjesService.ObtenerConserjes(this.filtros)
      .subscribe(x => {
        this.conserjes = x;
        this.loadingVisible = false;
        this.minutosTranscurridos = 0;
        clearInterval(this.intervalDeMinutosConserjes);
        this.intervalDeMinutosConserjes = setInterval(() => this.minutosTranscurridos++, 60000);
      });
  }

  cargarConserjesRecursivo() {
    this.cargarConserjes();
    clearTimeout(this.timeoutConserjes);
    this.timeoutConserjes = setTimeout(() => this.cargarConserjes(), 600000);
  }

  onDateValueChanged(e) {
    this.filtros.fechaComienzo = e.value;
    this.filtros.fechaFin = e.value;
    this.cargarConserjes();
  }

}
