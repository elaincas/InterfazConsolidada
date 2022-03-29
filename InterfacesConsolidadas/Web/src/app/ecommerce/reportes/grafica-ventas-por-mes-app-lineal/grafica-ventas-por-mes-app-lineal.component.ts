import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafica-ventas-por-mes-app-lineal',
  templateUrl: './grafica-ventas-por-mes-app-lineal.component.html',
  styleUrls: ['./grafica-ventas-por-mes-app-lineal.component.css']
})
export class GraficaVentasPorMesAppLinealComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() title: string = "";
  @Input() icon: string = "";

  constructor() { }

  ngOnInit() {
  }

}
