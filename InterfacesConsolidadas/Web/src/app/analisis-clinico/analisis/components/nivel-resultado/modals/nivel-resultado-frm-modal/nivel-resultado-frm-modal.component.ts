import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas } from '../../../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { NivelResultado } from '../../../../models/nivelResultado.model';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { RespuestaModal } from '../../../../models/respuestaModal';
import { NivelResultadoService } from '../../../../services/nivelResultadoService';

@Component({
  selector: 'app-nivel-resultado-frm-modal',
  templateUrl: './nivel-resultado-frm-modal.component.html',
  styleUrls: ['./nivel-resultado-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'nivelResultado', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class NivelResultadoFrmModalComponent implements OnInit {

  Modo: Forms.Modo;
  tituloModal: string;
  nivelResultado: NivelResultado;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<NivelResultado>> = new EventEmitter();
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;


  constructor(private nivelResultadoService: NivelResultadoService) { }

  ngOnInit() {
    this.ConfigurarModal();
    if(this.Modo == Forms.Modo.Agregar){
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.nivelResultado = new NivelResultado;
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

  GuardarNivelResultado() {
    let respuestaModal = new RespuestaModal<NivelResultado>();

    this.nivelResultadoService.GuardarNivelResultado(this.nivelResultado).subscribe(data => {
      let respuesta = data as RespuestaAC<NivelResultado>;
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

  EditarNivelResultado() {
    let respuestaModal = new RespuestaModal<NivelResultado>();

    this.nivelResultadoService.EditarNivelResultado(this.nivelResultado).subscribe(data => {
      let respuesta = data as RespuestaAC<NivelResultado>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroEditado)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje);
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje);
        return;
      }
      respuestaModal.data = this.nivelResultado;
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
