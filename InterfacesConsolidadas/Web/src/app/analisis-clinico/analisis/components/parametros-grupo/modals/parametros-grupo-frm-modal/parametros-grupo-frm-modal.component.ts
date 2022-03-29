import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { ParametroGrupo } from '../../../../models/parametroGrupo.model';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { RespuestaModal } from '../../../../models/respuestaModal';
import { ParametrosGrupoService } from '../../../../services/parametrosGrupoService';

@Component({
  selector: 'app-parametros-grupo-frm-modal',
  templateUrl: './parametros-grupo-frm-modal.component.html',
  styleUrls: ['./parametros-grupo-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'parametroGrupo', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class ParametrosGrupoFrmModalComponent implements OnInit {

  Modo: Forms.Modo;
  tituloModal: string;
  parametroGrupo: ParametroGrupo = new ParametroGrupo;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<ParametroGrupo>> = new EventEmitter();
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;

  constructor(private parametroGrupoService: ParametrosGrupoService) { }

  ngOnInit() {
    this.ConfigurarModal();
    if(this.Modo == Forms.Modo.Agregar){
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.parametroGrupo = new ParametroGrupo;
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

  GuardarParametroGrupo(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<ParametroGrupo>();

    this.parametroGrupoService.GuardarParametroGrupo(this.parametroGrupo).subscribe(data => {
      let respuesta = data as RespuestaAC<ParametroGrupo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroGuardado);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error);
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje);
        return;
      }
      respuestaModal.data = respuesta.data.data;
      respuestaModal.modo = Forms.Modo.Agregar
      respuestaModal.tipo = respuesta.respuestaTipo;
      this.onSubmit.emit(respuestaModal);
      this.Mostrar = false;
      this.MostrarChange.emit(this.Mostrar);
      this.LimpiarData();
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EditarparametroGrupo(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<ParametroGrupo>();

    this.parametroGrupoService.EditarParametroGrupo(this.parametroGrupo).subscribe(data => {
      let respuesta = data as RespuestaAC<ParametroGrupo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroEditado);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error);
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje);
        return;
      }
      respuestaModal.data = this.parametroGrupo;
      respuestaModal.modo = Forms.Modo.Actualizar;
      respuestaModal.tipo = respuesta.respuestaTipo;
      this.onSubmit.emit(respuestaModal);
      this.Mostrar = false;
      this.MostrarChange.emit(this.Mostrar);
      this.LimpiarData();
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  OnCerrarModal(e) {
    this.LimpiarData();
    this.Mostrar = false;
    this.MostrarChange.emit(this.Mostrar);
  }

}
