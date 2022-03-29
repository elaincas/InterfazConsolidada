import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import dataSource from 'devextreme/data/data_source';
import { IngresoReembolsoService } from '../../services/ingresosreembolsos/ingresoReembolsoService.service'
import { ListadoReembolsoService } from '../../services/listadoreembolsos/listadoReembolsoService.service'
import { MaestrosServices } from '../../services/maestros/maestrosServices.service'
import customStorage from 'devextreme/data/custom_store';
import customStorareOptions from 'devextreme/data/custom_store';
import { helpers } from '../../.../../../../helpers/utils';
import { Alertas } from '.././../../../helpers/notificaciones/notificaciones';
import { Ciudades, ColaboradorVHUR, SupervisorSucursal } from '../../models/maestros.models'
import { ListadoReembolso } from '../../models/reembolsos.models'
import { LoginService } from '../../../../login/services/login.service';

declare var $: any;
@Component({
  selector: 'app-ingreso-listadoreembolso',
  templateUrl: './listadoreembolso.component.html',
  styleUrls: ['./listadoreembolso.component.css'],

})
export class ListadoReembolsoComponent implements OnInit {
  reembolsos: ListadoReembolso[];
  ciudades: Ciudades[];
  colaboradores: ColaboradorVHUR[];
  colaborador: ColaboradorVHUR;
  reembolso: ListadoReembolso;
  usuario: any;
  _mostrarPopup: boolean = false;
  visibleAlDenegar: boolean = false;
  private _valorAPagar: number = 0;

  constructor(private ingresoReembolsoService: IngresoReembolsoService,
    private maestrosService: MaestrosServices,
    private login: LoginService,
    private listadoService: ListadoReembolsoService) {
    this.usuario = this.login.Usuario.id;
    this.ObtenerReembolsosPorAprobar(this.usuario);
    this.obtenerColaboradores();
    this.ObtenerCiudades();

    this.colaborador = new ColaboradorVHUR();
    this.reembolso = new ListadoReembolso();

  }

  ngOnInit() {

  }

  MostrarError(error, titulo) {
    let errorAmostrar = error._body.split(":").toString();
    errorAmostrar = errorAmostrar.split('"');
    Alertas.warning(titulo, errorAmostrar[3]);
  }

  ObtenerReembolsosPorAprobar(usuarioSupervisorId) {
    this.listadoService.obtenerReembolsoPorAceptarSegunUsuario(usuarioSupervisorId).subscribe(data => {
      this.reembolsos = data as any;
    }, error => {
      this.MostrarError("Posiblemente no tenga solicitudes pendientes", "Ha ocurrido un error");
    });

  }
  ObtenerCiudades() {
    this.maestrosService.obtenerCiudades().subscribe(data => {
      this.ciudades = data as any;

    }, error => {
      this.MostrarError(error, "Ha ocurrido un Error");
    });
  }

  obtenerColaboradores() {
    this.maestrosService.obtenerColaboradores().subscribe(data => {
      this.colaboradores = data as any;
    }, error => {
      this.MostrarError(error, "Ha ocurrido un Error");
    });
  }

  ObtenerColaboradorPorID(colaboradorID) {
    this.ingresoReembolsoService.obtenerColaboradorPorID(colaboradorID).subscribe(data => {
      this.colaborador = data as any;
    }, error => {
      this.MostrarError(error, "Error al obtener Colaborador");
    });
  }
  ObtenerInformacionADenegar(reembolsoinfo) {
    this.visibleAlDenegar = true;
    this.ObtenerColaboradorPorID(reembolsoinfo.colaboradorId);
    this._valorAPagar = reembolsoinfo.valorAPagar;
    this.reembolso.usuarioSupervisorId = this.login.Usuario.id;
    this.reembolso.reembolsoID = reembolsoinfo.reembolsoID;
    this.reembolso.observaciones=reembolsoinfo.observaciones;
    this._mostrarPopup = true;
  }

  LimpiarControles() {
    this.reembolso = new ListadoReembolso();
    this.colaborador = new ColaboradorVHUR();
    this.reembolsos = new Array<ListadoReembolso>();
    this._valorAPagar = 0;
  }
  ObtenerInformacionAprobarReembolso(reembolsoInfo) {
    this.ObtenerColaboradorPorID(reembolsoInfo.colaboradorId);
    this._valorAPagar = reembolsoInfo.valorAPagar;
    this.reembolso.usuarioSupervisorId = this.usuario;
    this.reembolso.reembolsoID = reembolsoInfo.reembolsoID;
    this._mostrarPopup = true;
    this.visibleAlDenegar = false;
  }

  Aprobar() {
    this.listadoService.AprobarReembolso(this.reembolso).subscribe(data => {
      this.LimpiarControles();
      this.visibleAlDenegar = false;
      this._mostrarPopup = false;
      this.reembolsos = new Array<ListadoReembolso>();
      this.ObtenerReembolsosPorAprobar(this.usuario);
      Alertas.ok("Éxito");
    }, error => {
      this.MostrarError(error, "Ha ocurrido un Error!")
    });
  }

  Denegar() {

    if ((this.reembolso.observaciones == null || this.reembolso.observaciones == "") && this.visibleAlDenegar == true) {
      Alertas.warning("La observación no puede estar vacía");
      this._mostrarPopup = true;
      return;
    }
    if (/^\s+|\s+$/.test(this.reembolso.observaciones)) {
      Alertas.warning("La observación no puede estar vacía");
      this._mostrarPopup = true;
      return;
    }
    else {
      this.listadoService.DenegarReembolso(this.reembolso).subscribe(data => {
        Alertas.ok("Exito");
        this.LimpiarControles();
        this._mostrarPopup = false;
        this.visibleAlDenegar = false;
        this.reembolsos = new Array<ListadoReembolso>();
        this.ObtenerReembolsosPorAprobar(this.usuario);
      }, error => {
        this._mostrarPopup = false;
        this.visibleAlDenegar = false;
        this.MostrarError(error, "Ha Ocurrido un Error!");
      });
    }
  }

  Cancelar() {
    this._mostrarPopup = false;
  }
}
