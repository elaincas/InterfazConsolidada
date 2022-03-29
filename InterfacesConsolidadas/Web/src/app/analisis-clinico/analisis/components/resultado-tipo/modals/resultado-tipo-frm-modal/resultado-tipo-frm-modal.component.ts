import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas } from '../../../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { RespuestaModal } from '../../../../models/respuestaModal';
import { ResultadoTipo } from '../../../../models/resultadoTipo.model';
import { ResultadoTipoService } from '../../../../services/tiposDeResultadoService';

@Component({
  selector: 'app-resultado-tipo-frm-modal',
  templateUrl: './resultado-tipo-frm-modal.component.html',
  styleUrls: ['./resultado-tipo-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'resultadoTipo', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class ResultadoTipoFrmModalComponent implements OnInit {

  Modo: Forms.Modo;
  tituloModal: string;
  resultadoTipo: ResultadoTipo;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<ResultadoTipo>> = new EventEmitter();
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;


  constructor(private resultadoTipoService: ResultadoTipoService) { }

  ngOnInit() {
    this.ConfigurarModal();
    if(this.Modo == Forms.Modo.Agregar){
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.resultadoTipo = new ResultadoTipo;
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

  GuardarResultadoTipo() {
    let respuestaModal = new RespuestaModal<ResultadoTipo>();

    this.resultadoTipoService.GuardarResultadoTipo(this.resultadoTipo).subscribe(data => {
      let respuesta = data as RespuestaAC<ResultadoTipo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroGuardado);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje);
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje);
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

  EditarResultadoTipo() {
    let respuestaModal = new RespuestaModal<ResultadoTipo>();

    this.resultadoTipoService.EditarResultadoTipo(this.resultadoTipo).subscribe(data => {
      let respuesta = data as RespuestaAC<ResultadoTipo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroEditado);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje);
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje);
        return;
      }
      respuestaModal.data = this.resultadoTipo;
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
    this.Mostrar = false;
    this.MostrarChange.emit(this.Mostrar);
  }


}
