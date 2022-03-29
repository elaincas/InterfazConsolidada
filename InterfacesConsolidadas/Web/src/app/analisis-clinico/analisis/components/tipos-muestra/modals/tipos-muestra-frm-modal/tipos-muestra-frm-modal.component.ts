import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { MuestraTipo } from '../../../../models/muestraTipo.model';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { RespuestaModal } from '../../../../models/respuestaModal';
import { MuestraTiposService } from '../../../../services/tiposDeMuestraService';

@Component({
  selector: 'app-tipos-muestra-frm-modal',
  templateUrl: './tipos-muestra-frm-modal.component.html',
  styleUrls: ['./tipos-muestra-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'muestraTipo', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class TiposMuestraFrmModalComponent implements OnInit {

  Modo: Forms.Modo;
  tituloModal: string;
  muestraTipo: MuestraTipo;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<MuestraTipo>> = new EventEmitter();
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;


  constructor(private muestraTipoService: MuestraTiposService) { }

  ngOnInit() {
    this.ConfigurarModal();
    if (this.Modo == Forms.Modo.Agregar) {
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.muestraTipo = new MuestraTipo;
  }

  ConfigurarModal() {
    this.esModoEditar = this.Modo == Forms.Modo.Actualizar ? true : false;
    this.readOnlyEditar = this.Modo == Forms.Modo.Actualizar ? true : false;
  }

  mostrarLoader(): void {
    this.loadingVisible = true;
  }

  ocultarLoader(): void {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 1000);
  }

  GuardarTipoMuestra(e) {
    const res = e.validationGroup.validate();
    if (!res.isValid) {
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<MuestraTipo>();

    this.muestraTipoService.GuardarMuestraTipo(this.muestraTipo).subscribe(data => {
      let respuesta = data as RespuestaAC<MuestraTipo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroGuardado);
        respuestaModal.data = respuesta.data.data;
        respuestaModal.modo = Forms.Modo.Agregar
        respuestaModal.tipo = respuesta.respuestaTipo;
        this.onSubmit.emit(respuestaModal);
        this.Mostrar = false;
        this.MostrarChange.emit(this.Mostrar);
        this.LimpiarData();
        this.loadingVisible = false;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje)
      }
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EditarTipoMuestra(e) {
    const res = e.validationGroup.validate();
    if (!res.isValid) {
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<MuestraTipo>();

    this.muestraTipoService.EditarMuestraTipo(this.muestraTipo).subscribe(data => {
      let respuesta = data as RespuestaAC<MuestraTipo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        respuestaModal.data = this.muestraTipo;
        respuestaModal.modo = Forms.Modo.Actualizar;
        respuestaModal.tipo = respuesta.respuestaTipo;
        this.onSubmit.emit(respuestaModal);
        this.Mostrar = false;
        this.MostrarChange.emit(this.Mostrar);
        this.LimpiarData();
        this.loadingVisible = false;
        Alertas.info(MensajesGenericosAC.registroEditado)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje)
      }
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  OnCerrarModal(e) {
    this.Mostrar = false;
    this.MostrarChange.emit(this.Mostrar);
  }

}
