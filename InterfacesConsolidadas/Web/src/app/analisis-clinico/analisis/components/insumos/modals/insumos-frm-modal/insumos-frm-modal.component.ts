import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Forms } from '../../../../../../helpers/forms';
import { Insumo } from '../../../../models/insumo.model';
import { RespuestaModal } from '../../../../models/respuestaModal';
import CustomStorage from 'devextreme/data/custom_store';
import { InsumosService } from '../../../../services/insumosService';
import { ProductoInsumoBusqueda } from '../../../../models/productoInsumoBusqueda';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';

@Component({
  selector: 'app-insumos-frm-modal',
  templateUrl: './insumos-frm-modal.component.html',
  styleUrls: ['./insumos-frm-modal.component.css'],
  inputs: ['Modo', 'Mostrar', 'insumo', 'tituloModal'],
  outputs: ['MostrarChange', 'onSubmit']
})
export class InsumosFrmModalComponent implements OnInit {

  Modo: Forms.Modo;
  tituloModal: string;
  insumo: Insumo;
  Mostrar: boolean;
  MostrarChange: EventEmitter<boolean> = new EventEmitter();
  onSubmit: EventEmitter<RespuestaModal<Insumo>> = new EventEmitter();
  productosInsumos: string;
  esModoEditar: boolean;
  loadingVisible: boolean;
  readOnlyEditar: boolean;
  dataSource: DataSource;
  comboProductos = { value: null };
  constructor(private insumoService: InsumosService) {
  }

  ngOnInit() {
    this.ConfigurarModal();
    this.configurarDataSource();
    if(this.Modo == Forms.Modo.Agregar){
      this.LimpiarData();
    }
  }

  LimpiarData() {
    this.insumo = new Insumo;
  }

  ConfigurarModal() {
    this.esModoEditar = this.Modo == Forms.Modo.Actualizar ? true : false;
    this.readOnlyEditar = this.Modo == Forms.Modo.Actualizar ? true : false;
    if (this.esModoEditar) {
      this.comboProductos.value = this.insumo.prodId;
    }
  }

  configurarDataSource() {
    let custom = new CustomStorage({
      load: this.buscarProductosInsumo.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
      }),
    });

    this.dataSource = new DataSource({
      store: custom
    });
  }

  buscarProductosInsumo(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let textoBusqueda = this.dataSource.searchValue();
      this.insumoService.buscarProductos(textoBusqueda)
        .then(data => resolve(data));
    });
  }

  mostrarLoader(): void {
    this.loadingVisible = true;
  }

  ocultarLoader(): void {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 1000);
  }

  GuardarInsumo(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<Insumo>();
    this.insumo.prodId = this.comboProductos.value;

    this.insumoService.GuardarInsumo(this.insumo).subscribe(data => {
      let respuesta = data as RespuestaAC<Insumo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroGuardado);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje)
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

  EditarInsumo(e) {
    const res = e.validationGroup.validate();
    if(!res.isValid){
      Notificaciones.error("Datos incompletos");
      return;
    }
    let respuestaModal = new RespuestaModal<Insumo>();

    this.insumoService.EditarInsumo(this.insumo).subscribe(data => {
      let respuesta = data as RespuestaAC<Insumo>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(MensajesGenericosAC.registroEditado)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.info(MensajesGenericosAC.errorValidacion, respuesta.mensaje)
      }
      respuestaModal.data = this.insumo;
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

  itemChange(e){
    let insumo = this.dataSource.items().find(x => x.productoId == e.value);
    this.insumo.descripcion = insumo.descripcion;
  }

  texto(){
    let a = "";
    return this.Modo == Forms.Modo.Actualizar ? this.insumo.descripcion:"Seleccione un producto";
  }

  OnCerrarModal(e) {
    this.Mostrar = false;
    this.MostrarChange.emit(this.Mostrar);
  }

}
