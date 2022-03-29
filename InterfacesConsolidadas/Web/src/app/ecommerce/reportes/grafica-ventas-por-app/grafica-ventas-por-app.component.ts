import { Component, OnInit } from '@angular/core';
import { EcommerceDashboardService } from '../services/ecommerce-dashboard.service';

@Component({
  selector: 'app-grafica-ventas-por-app',
  templateUrl: './grafica-ventas-por-app.component.html',
  styleUrls: ['./grafica-ventas-por-app.component.css']
})
export class GraficaVentasPorAppComponent implements OnInit {

  constructor(public ecommerceDashboardService: EcommerceDashboardService) { }
  ngOnInit() {
  }

}
