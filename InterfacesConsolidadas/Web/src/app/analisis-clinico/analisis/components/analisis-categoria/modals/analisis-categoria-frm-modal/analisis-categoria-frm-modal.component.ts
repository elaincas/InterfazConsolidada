import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { Categoria } from '../../../../models/categorias.model';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { RespuestaModal } from '../../../../models/respuestaModal';
import { AnalisisCategoriasService } from '../../../../services/analisisCategoriaService';

@Component({
  selector: 'app-analisis-categoria-frm-modal',
  templateUrl: './analisis-categoria-frm-modal.component.html',
  styleUrls: ['./analisis-categoria-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'analisisCategoria', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class AnalisisCategoriaFrmModalComponent implements OnInit {

  Modo: Forms.Modo;
  tituloModal: string;
  analisisCategoria: Categoria = new Categoria;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<Categoria>> = new EventEmitter();
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;


  constructor(private analisisCategoriaService: AnalisisCategoriasService) { }

  ngOnInit() {
    this.ConfigurarModal();
    if(this.Modo == Forms.Modo.Agregar){
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.analisisCategoria = new Categoria;
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

  GuardarCategoria(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<Categoria>();

    this.analisisCategoriaService.GuardarCategoria(this.analisisCategoria).subscribe(data => {
      let respuesta = data as RespuestaAC<Categoria>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error,respuesta.mensaje);
        this.loadingVisible = false;
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion,respuesta.mensaje);
        this.loadingVisible = false;
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroGuardado);
      }
      respuestaModal.data = respuesta.data.data;
      respuestaModal.modo = Forms.Modo.Agregar
      respuestaModal.tipo = respuesta.respuestaTipo;
      this.onSubmit.emit(respuestaModal);
      this.Mostrar = false;
      this.MostrarChange.emit(this.Mostrar);
      this.LimpiarData();
      this.loadingVisible = false;
    });
  }

  EditarCategoria(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<Categoria>();

    this.analisisCategoriaService.EditarCategoria(this.analisisCategoria).subscribe(data => {
      let respuesta = data as RespuestaAC<Categoria>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroEditado)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje);
        return;
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion,respuesta.mensaje);
        return;
      }
      respuestaModal.data = this.analisisCategoria;
      respuestaModal.modo = Forms.Modo.Actualizar;
      respuestaModal.tipo = respuesta.respuestaTipo;
      this.onSubmit.emit(respuestaModal);
      this.Mostrar = false;
      this.MostrarChange.emit(this.Mostrar);
      this.LimpiarData();
      this.loadingVisible = false;
    });
  }

  OnCerrarModal(e) {
    this.Mostrar = false;
    this.MostrarChange.emit(this.Mostrar);
  }

}
