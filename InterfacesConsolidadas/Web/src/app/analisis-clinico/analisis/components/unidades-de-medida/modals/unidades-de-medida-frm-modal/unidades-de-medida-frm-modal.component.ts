import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { RespuestaModal } from '../../../../models/respuestaModal';
import { UnidadDeMedida } from '../../../../models/unidadMedida.model';
import { UnidadesDeMedidasService } from '../../../../services/unidadDeMedidaService';

@Component({
  selector: 'app-unidades-de-medida-frm-modal',
  templateUrl: './unidades-de-medida-frm-modal.component.html',
  styleUrls: ['./unidades-de-medida-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'unidadMedida', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class UnidadesDeMedidaFrmModalComponent implements OnInit {

  Modo: Forms.Modo;
  tituloModal: string;
  unidadMedida: UnidadDeMedida;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<UnidadDeMedida>> = new EventEmitter();
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;

  constructor(private unidadDeMedidaService: UnidadesDeMedidasService) { }

  ngOnInit() {
    this.ConfigurarModal();
    if (this.Modo == Forms.Modo.Agregar) {
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.unidadMedida = new UnidadDeMedida;
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

  GuardarUnidadMedida(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<UnidadDeMedida>();

    this.unidadDeMedidaService.GuardarUnidadDeMedida(this.unidadMedida).subscribe(data => {
      let respuesta = data as RespuestaAC<UnidadDeMedida>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        respuestaModal.data = respuesta.data.data;
        respuestaModal.modo = Forms.Modo.Agregar
        respuestaModal.tipo = respuesta.respuestaTipo;
        this.onSubmit.emit(respuestaModal);
        this.Mostrar = false;
        this.MostrarChange.emit(this.Mostrar);
        this.LimpiarData();
        this.loadingVisible = false;
        Alertas.info(MensajesGenericosAC.registroGuardado);
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

  EditarUnidadMedida(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<UnidadDeMedida>();

    this.unidadDeMedidaService.EditarUnidadDeMedida(this.unidadMedida).subscribe(data => {
      let respuesta = data as RespuestaAC<UnidadDeMedida>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroEditado)
        respuestaModal.data = this.unidadMedida;
        respuestaModal.modo = Forms.Modo.Actualizar;
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

  OnCerrarModal(e) {
    this.Mostrar = false;
    this.MostrarChange.emit(this.Mostrar);
  }

}
