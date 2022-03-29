import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { Laboratorio } from '../../../../models/laboratorio.model';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { RespuestaModal } from '../../../../models/respuestaModal';
import { LaboratoriosService } from '../../../../services/laboratoriosService';

@Component({
  selector: 'app-laboratorios-frm-modal',
  templateUrl: './laboratorios-frm-modal.component.html',
  styleUrls: ['./laboratorios-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'laboratorio', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class LaboratoriosFrmModalComponent implements OnInit {
  Modo: Forms.Modo;
  tituloModal: string;
  laboratorio: Laboratorio;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<Laboratorio>> = new EventEmitter();
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;

  constructor(private laboratorioService: LaboratoriosService) { }

  ngOnInit() {
    this.ConfigurarModal();
    if(this.Modo == Forms.Modo.Agregar){
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.laboratorio = new Laboratorio;
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

  GuardarLaboratorio(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<Laboratorio>();

    this.laboratorioService.GuardarLaboratorio(this.laboratorio).subscribe(data => {
      let respuesta = data as RespuestaAC<Laboratorio>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroGuardado);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error,respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje)
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

  EditarLaboratorio(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<Laboratorio>();

    this.laboratorioService.EditarLaboratorio(this.laboratorio).subscribe(data => {
      let respuesta = data as RespuestaAC<Laboratorio>;
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
      respuestaModal.data = this.laboratorio;
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
