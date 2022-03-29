import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { data } from 'jquery';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';
import { IConserjeMap, PedidoInformacion } from '../../models/PedidoInformacion';
import { PedidoMapMarker } from '../../models/PedidoMapMarker';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-mapa-pedidos',
  templateUrl: './mapa-pedidos.component.html',
  styleUrls: ['./mapa-pedidos.component.css']
})
export class MapaPedidosComponent implements OnInit, OnDestroy {
  fecha: Date;
  conserjeId: string;
  loadingVisible: boolean;
  isGetForDate: boolean;
  minutosTranscurridos: number;
  intervalMinutosTranscurridos: NodeJS.Timer;
  timeoutPedidos: NodeJS.Timer;

  get pedidos(): PedidoInformacion[] {
    return this._pedidos;
  }
  set pedidos(value: PedidoInformacion[]) {
    this._pedidos = value;
    if (this.isGetForDate) {
      this.obtenerConserjes(value); 
    }
    value.forEach(x => this.agregarMarker(x));
  }
  private _pedidos: PedidoInformacion[];
  conserjes: IConserjeMap[];

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  infowindow: google.maps.InfoWindow;
  markers: PedidoMapMarker[];
  
  constructor(private _dashboardService: DashboardService) {
    this.fecha = new Date();
    this.loadingVisible = false;
    this.markers = [];
    this.conserjes = [];
    this.isGetForDate = true;
    this.minutosTranscurridos = 0;
   }
  ngOnDestroy(): void {
    clearTimeout(this.timeoutPedidos);
    clearInterval(this.intervalMinutosTranscurridos);
  }

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(14.546982, -86.346275),
      zoom: 8,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.infowindow = new google.maps.InfoWindow();
    this.conserjeId = "";
    this.cargarPedidosRecursivo();
  }

  cargarPedidos(fecha: Date, conserjeId: string) {
    this.loadingVisible = true;
    this._dashboardService.obtenerInformacionDePedidosPorFecha(fecha, conserjeId)
      .subscribe(data => {
        this.pedidos = data;
        this.minutosTranscurridos = 0;
        clearInterval(this.intervalMinutosTranscurridos);
        this.intervalMinutosTranscurridos = setInterval(() => this.minutosTranscurridos++, 60000);
      }, (error) => {
        Alertas.close();
        Alertas.showHttpResponse(error, "¡Error!", false);
      }, () => this.loadingVisible = false);
  }

  cargarPedidosRecursivo() {
    this.cargarPedidos(this.fecha, this.conserjeId);
    clearTimeout(this.timeoutPedidos)
    this.timeoutPedidos = setTimeout(() => this.cargarPedidosRecursivo(), 600000);
  }

  agregarMarker(pedido: PedidoInformacion) {
    var m = this.getMarker(pedido);

    this.markers.push(new PedidoMapMarker(pedido, m));
  }

  deleteMarkers() {
    this.markers.forEach(m => m.marker.setMap(null));
    this.markers = [];
  }

  getMarker(pedido: PedidoInformacion): google.maps.Marker {
    const location = new google.maps.LatLng(pedido.latitud, pedido.longitud);

    const m = new google.maps.Marker({
      position: location,
      title: pedido.cliente,
      draggable: false,
      map: this.map,
      icon: 'assets/img/marker_sad_entrega.png'
    });

    const contentString =
      `<div id="content"">
         <dl class="dl-horizontal">
           <dt>Cliente</dt>
           <dd>${pedido.cliente}</dd>
           <dt>Conserje</dt>
           <dd>${pedido.conserje}</dd>
           <dt>Factura</dt>
           <dd>${pedido.facturaId}</dd>
           <dt>Tipo de Factura</dt>
           <dd>${pedido.tipoDeFactura}</dd>
           <dt>Total</dt>
           <dd>${pedido.total}</dd>
         </dl>
       </div>`;

    let _ = this;
    google.maps.event.addListener(m, 'click', function () {
      _.infowindow.setContent(contentString);
      _.infowindow.open(_.map, m);
    });

    return m;
  }

  obtenerConserjes(pedidos: PedidoInformacion[]) {
    let conserjesRepetidos = pedidos.map(x => ({ id: x.conserjeId.toString(), nombre: x.conserje }));
    let conserjesUnificados = conserjesRepetidos.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
    conserjesUnificados.unshift({ id: "", nombre: 'Todos' });
    this.conserjes = conserjesUnificados;
  }

  onDateValueChanged(e: any) {
    this.deleteMarkers();
    this.isGetForDate = true;
    this.cargarPedidos(e.value, "");
  }

  valueConserjeChanged(data: any) {
    this.deleteMarkers();
    this.isGetForDate = false;
    this.cargarPedidos(this.fecha, data.value);
  }

}
