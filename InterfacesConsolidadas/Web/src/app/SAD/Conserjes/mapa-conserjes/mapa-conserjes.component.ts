/// <reference types="@types/google.maps" />
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { Colonia } from '../../../maestros/colonias/models/colonia.model';
import { Ciudad } from '../../../maestros/colonias/models/ciudad.model';
import { ColoniaService } from '../../../maestros/colonias/services/coloniaService.service';
import { AdministrarConserjesService } from '../Administrar-Conserjes/services/administrar.conserjes.service';
import * as signalR from "@aspnet/signalr";
import { Conserje } from '../Administrar-Conserjes/models/Conserje';
import { ConserjeMapMarker } from '../conserje-map-marker-model';
import { environment } from '../../../../environments/environment';
import { PedidoMetricas, PedidoMetricasRespuesta } from './models/PedidoMetricas';

@Component({
  selector: 'mapa-conserjes',
  templateUrl: './mapa-conserjes.component.html',
  styleUrls: ['./mapa-conserjes.component.css']
})
export class MapaConserjesComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  private hubConnection: signalR.HubConnection;

  opcionesFiltros: any = [
    {
      descripcion: "Todos",
      id: 1
    },
    {
      descripcion: "Con pedidos asignados",
      id: 2
    },
    {
      descripcion: "Sin pedidos asignados",
      id: 3
    },
    {
      descripcion: "No ha actualizado ubicación",
      id: 4
    }];

  markers: ConserjeMapMarker[];
  conserjes: Conserje[];

  ciudades: Ciudad[];

  formGroupFiltros: FormGroup;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  popupPedidosConserjeVisible = false;
  loadingVisible = false;
  closeButtonOptions: any;
  pedidosMetricas: PedidoMetricas[] = [];
  conserjeMarkerSeleccionado = new Conserje();
  infowindow = new google.maps.InfoWindow();
  markerDestino = new google.maps.Marker();
  infowindowDestino = new google.maps.InfoWindow();
  fechaComienzoFiltro: Date = new Date();
  fechaFinFiltro: Date = new Date();

  constructor(
    private coloniaService: ColoniaService, private route: Router,
    private conserjesService: AdministrarConserjesService,
    private _formBuilder: FormBuilder,
  ) {
    const _ = this;
    this.markers = new Array<ConserjeMapMarker>();
    this.closeButtonOptions = {
      text: "Cerrar",
      onClick: function(e) {
          _.popupPedidosConserjeVisible = false;
      }
  };
  }

  public startHubConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.conserjesRealtimeApi}/hubs/locations`)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() =>
        this.hubConnection.on('NewLocation', (ubicacion, repartidorId) => {
          this.markers.forEach(marker => {
            if (marker.conserje.codigoVhur == repartidorId) {
              marker.conserje.ultimaLatitud = ubicacion.split(',')[0];
              marker.conserje.ultimaLongitud = ubicacion.split(',')[1];
              this.actualizarMarker(
                marker
              );
              this.filtrarMarcadores();
            }
          });
        }))
      .catch(err => {
        console.log(err);
        console.log('Error while starting connection: ' + err);
      })
  }

  cambiarMarkersVisibles(filtroSeleccionado: number, conserjeId: number = null) {
    this.markers.forEach(marker => {

      if (filtroSeleccionado == 1)
        marker.marker.setMap(this.map);

      if (filtroSeleccionado == 2)
        if (marker.conserje.cantidadPedidosSinEntregar > 0) {
          marker.marker.setMap(this.map);
        }
        else
          marker.marker.setMap(null);

      if (filtroSeleccionado == 3)
        if (marker.conserje.cantidadPedidosSinEntregar == 0) {
          marker.marker.setMap(this.map);
        }
        else
          marker.marker.setMap(null);

      if (filtroSeleccionado == 4)
        if (new Date(marker.conserje.ultimaUbicacionFecha) <= new Date(Date.now() - 1000 * 60)) {
          marker.marker.setMap(this.map);
        }
        else
          marker.marker.setMap(null);

      if (conserjeId)
        if (marker.conserje.id == conserjeId) {
          marker.marker.setMap(this.map);
          this.map.setCenter(marker.marker.getPosition());
        }
        else
          marker.marker.setMap(null);

    });
  }

  ngOnInit() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});

    var mapProp = {
      center: new google.maps.LatLng(15.503616, -88.0360329),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.directionsRenderer.setMap(this.map);

    // this.map.setCenter(marker.getPosition());
    // marker = new google.maps.Marker({
    //   position: new google.maps.LatLng(18.5783, 73.8133),
    //   title: 'new marker',
    //   draggable: true,
    //   map: this.map
    // });
    // this.map.setCenter(marker.getPosition());

    this.obtenerCiudades();
    this.formGroupFiltros = this._formBuilder.group({
      ciudad: new FormControl("00"),
      filtro: new FormControl(1),
      conserje: new FormControl(),
      fechaComienzo: new FormControl(new Date()),
      fechaFin: new FormControl(new Date()),
    });
    this.obtenerConserjes();
    this.startHubConnection();



    const _ = this;
    google.maps.event.addListener(_.infowindow, 'domready', () => {
      const elementoBotonPedidos = document.getElementById('pedidos');
      elementoBotonPedidos.addEventListener('click', (event) => {
        _.abrirModalDePedidosDeConserjePendientes(_.conserjeMarkerSeleccionado);
      })
    });

    google.maps.event.addListener(this.markerDestino, 'click', function () {
      _.infowindowDestino.open(_.map, _.markerDestino);
    });
  }

  obtenerCiudades(): void {
    Alertas.load();
    this.coloniaService.ObtenerCiudades().subscribe(data => {
      Alertas.close();
      this.ciudades = data;
    });
  }

  obtenerConserjes(): void {
    Alertas.load();
    this.conserjesService.ObtenerConserjes({
      nombre: "",
      cargarUltimaUbicacion: true,
      cargarPedidosPendientes: true,
      fechaComienzo: this.formGroupFiltros.get("fechaComienzo").value,
      fechaFin: this.formGroupFiltros.get("fechaFin").value
    }).subscribe(data => {

      Alertas.close();
      this.conserjes = data;
      this.limpiarMarcadoresDelMapa();
      this.markers = new Array<ConserjeMapMarker>();

      data.forEach(element => {
        if (element.ultimaLongitud) {
          this.hubConnection.invoke('AddToGroup', element.codigoVhur).catch(err => console.error(err));
          this.agregarMarker(element);
        }
      });

      this.cambiarMarkersVisibles(
        this.formGroupFiltros.get('filtro').value,
        this.formGroupFiltros.get('conserje').value
      );
    });
  }

  filtrarMarcadores() {
    if(this.validarParametrosDelReporte()){
      this.obtenerConserjes();
    }
  }



  actualizarMarker(marker: ConserjeMapMarker) {
    marker.marker.setMap(null);

    var m = this.getMarker(marker.conserje);

    marker.marker = m;
  }

  ciudadSelectedChange(ciudad: string) {

    let ciudadObjeto = this.ciudades.filter(c => c.id == ciudad)[0];

    if(ciudadObjeto != undefined && ciudadObjeto != null && ciudadObjeto.id != '00'){
      this.coloniaService.ObtenerCoordenadasCiudad(ciudadObjeto.descripcion).subscribe(c => {
        this.map.setZoom(14);
        this.map.setCenter(new google.maps.LatLng(c[0], c[1]));
      });
    }
  }

  mostrarDetalleConserje(conserje: Conserje) {
    alert(conserje.nombre + "\nÚltimos pedidos entregados:\nNNN (dd-MM-yyyy)\n\nTiempo de entrega promedio:\nCantidad de pedidos entregados:");
  }

  getMarker(conserje: Conserje): google.maps.Marker {
    var location = new google.maps.LatLng(conserje.ultimaLatitud, conserje.ultimaLongitud);

    var m = new google.maps.Marker({
      position: location,
      title: conserje.nombre,
      draggable: false,
      map: this.map,
      icon: 'https://s3.amazonaws.com/assets.farmaciasiman.com/public/logos/marker_sad.png'
    });

    var contentString =
      '<div id="content" style="width:300px;">' +
      `<button id="pedidos">Pedidos</button>&nbsp;` +
      `<strong>${conserje.nombre}</strong><br>Fecha de la última ubicación: ${new Date(conserje.ultimaUbicacionFecha).toLocaleString()}` +
      '</div>';

    let _ = this;
    google.maps.event.addListener(m, 'click', function () {
      _.infowindow.setContent(contentString);

      _.conserjeMarkerSeleccionado = conserje;

      _.infowindow.open(_.map, m);
    });

    return m;
  }

  abrirModalDePedidosDeConserjePendientes(conserje: Conserje) {
    this.popupPedidosConserjeVisible = true;

    if (this.pedidosMetricas.length > 0) {
      const primerPedido = this.pedidosMetricas[0];

      if (primerPedido.pedido.usuarioAsignadoID.toString() == conserje.codigoVhur) {
        return;
      }
    }
    this.pedidosMetricas = [];
    this.loadingVisible = true;

    const _ = this;
    this.conserjesService.ObtenerPedidosPendientesMasCercanos(conserje).subscribe(data => {
      _.pedidosMetricas = data.data;
      _.loadingVisible = false;
      //_.mostrarMejorRutaDeConserje(data, conserje)
    }, error => {
      _.loadingVisible = false;
      this.popupPedidosConserjeVisible = false;
      Alertas.showHttpResponse(error, "¡Error!", false);
    });
  }

  mostrarMejorRutaDeConserje(pedidoConserje: PedidoMetricas) {
    const conserje = this.conserjes.find(x => x.codigoVhur == pedidoConserje.pedido.usuarioAsignadoID.toString());
    if (conserje) {
      const pedido = pedidoConserje.pedido;

      let _ = this;
      this.directionsService.route({
        origin: new google.maps.LatLng(conserje.ultimaLatitud, conserje.ultimaLongitud),
        destination: new google.maps.LatLng(Number(pedido.latitudFacturaRecibida), Number(pedido.longitudFacturaRecibida)),
        travelMode: google.maps.TravelMode.DRIVING
      }).then((response) => {
        let leg = response.routes[0].legs[0];
        _.makeMarker(leg.end_location, 'assets/img/marker_house.png', pedidoConserje.pedido.nombreCliente, _.map)
        _.popupPedidosConserjeVisible = false;
        _.directionsRenderer.setDirections(response);
      }).catch((e) => window.alert("Directions request failed due to " + e));
    }

  }

  private makeMarker(position: google.maps.LatLng, icon: string, title: string, map: google.maps.Map) {
    this.markerDestino.setOptions({
        position: position,
        map: map,
        icon: icon,
        title: title,
        visible: true
    });

    this.infowindowDestino.setContent(title);
  }

  agregarMarker(conserje: Conserje) {
    var m = this.getMarker(conserje);

    this.markers.push(new ConserjeMapMarker(conserje, m));
  }

  validarParametrosDelReporte(): boolean{

    if(this.formGroupFiltros.get("fechaComienzo") == undefined || this.formGroupFiltros.get("fechaComienzo") == null){
      Alertas.error('¡La fecha no es válida!', 'El campo Fecha Desde es requerido');
      return false;
    }

    if(this.formGroupFiltros.get("fechaFin") == undefined || this.formGroupFiltros.get("fechaFin") == null){
      Alertas.error('¡La fecha no es válida!', 'El campo Fecha Hasta es requerido');
      return false;
    }

    return true;
  }

  limpiarControles(): void {
    this.formGroupFiltros.get("ciudad").setValue("00");
    this.formGroupFiltros.get("filtro").setValue(1);
    this.formGroupFiltros.get("conserje").setValue(null);
    this.formGroupFiltros.get("fechaComienzo").setValue(new Date());
    this.formGroupFiltros.get("fechaFin").setValue(new Date());
    this.limpiarRutasDelMapa();
  }

  limpiarRutasDelMapa():void {
    this.directionsRenderer.setMap(null);
    this.directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    this.directionsRenderer.setMap(this.map);
    this.markerDestino.setVisible(false);
  }

  limpiarMarcadoresDelMapa():void {
    this.markers.forEach(marker => { marker.marker.setMap(null)});
  }
}
