import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit,
  Input,
  EventEmitter,
} from '@angular/core';
import { EncuestasService } from '../../services/encuestas.service';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import notify from 'devextreme/ui/notify';
import swal from 'sweetalert2';
import {
  DxDataGridComponent,
  DxTextBoxComponent,
  DxDropDownBoxComponent,
  DxRadioGroupComponent,
  DxListComponent,
} from 'devextreme-angular';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { PedidoTipoValido } from '../../models/pedido-tipo-valido.model';
import { SwalPosition } from '../../../../helpers/notificaciones/SwalPosition';
import { InfomacionPreview } from '../../models/informacion-preview.model';
import { MomentoEvaluarPedido } from '../../models/momento-evaluar.model';
import { TipoPregunta } from '../../models/tipoPregunta.model';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css'],
})
export class EncuestasComponent implements OnInit, AfterContentInit {
  //#region propiedades
  radioGroupTiposPreguntas: DxRadioGroupComponent;
  @ViewChild('listPedidosTipos') pedidosTiposList: DxListComponent;
  @ViewChild('pregunta') _pregunta: DxTextBoxComponent;
  @ViewChild('dropdownPedidoTipo')
  _dropdownPedidosTipos: DxDropDownBoxComponent;
  @ViewChild('dxDataGridListadoPreguntas')
  _dxDataGridListadoPreguntas: DxDataGridComponent;
  @ViewChild('radioGroupTiposPedidos')
  radioGroupTiposPedidos: DxRadioGroupComponent;
  @Input() limpiarControles: EventEmitter<any>;

  listaPreguntas: any[];
  filtros: any[];
  listaPedidosTipos: any[];
  idSeleccionados: any[];
  pedidosTiposKeysSeleccionadas = [];
  pedidosTiposSeleccionadosDDL: any[];
  fileUploaderDesaprobacion: any[];
  fileUploaderAprobacion: any[];
  momentos: any[];
  tiposPreguntas: any[];
  tiposPreguntasTipo = TipoPregunta;
  tiposMomentosTipo = MomentoEvaluarPedido;

  submit: Boolean;
  esEdicion: Boolean;
  mostrarInfoPreviaPreview: Boolean;
  haCambiadoCheckActivo: Boolean;
  satisfechoSeleccionado: Boolean;
  insatisfechoSeleccionado: Boolean;
  _mostrarPopup: Boolean;
  _mostrarPopupInactivar: Boolean;
  estadoOriginal: Boolean;

  preguntaOriginalEdicion: string;
  imagenAprobacion: string;
  imagenDesaprobacion: string;
  url: string;
  urlAssets: string;
  urlImagenAprobacion: string;
  urlImagenDesaprobacion: string;

  momento: MomentoEvaluarPedido;
  idPregunta: number;
  idPreguntaActivar: number;
  pedidoSeleccionadoPreview: number;
  cantidadPedidosTiposPorPregunta: number;
  calificacion: number;
  calificaciones: number;
  tipoPregunta: TipoPregunta;

  validacion: any;
  detallesPreguntasPedidosTipos: any;
  dataSourcePedidosTipos: any;
  private checkSeleccioanar: any;
  informacionPreview: InfomacionPreview;
  infoPreviaAMostrarPreview: any;

  formGroupEncuestas: FormGroup;
  formGroupResultadoEncuesta: FormGroup;
  validacionPedidoTipo: PedidoTipoValido;
  validacionPedidoTipoModal: PedidoTipoValido;
  //#endregion

  constructor(
    private _encuestasService: EncuestasService,
    private _formBuilder: FormBuilder
  ) {
    this.cargarFormGroup();

    this.listaPreguntas = [];
    this.listaPedidosTipos = [];
    this.idSeleccionados = [];
    this.pedidosTiposSeleccionadosDDL = [];
    this.detallesPreguntasPedidosTipos = [];
    this.fileUploaderDesaprobacion = [];
    this.fileUploaderAprobacion = [];

    this.cantidadPedidosTiposPorPregunta = 0;
    this.tipoPregunta = 0;
    this.momento = 0;

    this.submit = false;
    this.mostrarInfoPreviaPreview = false;
    this.esEdicion = false;
    this.haCambiadoCheckActivo = false;
    this.satisfechoSeleccionado = false;
    this.insatisfechoSeleccionado = false;
    this._mostrarPopup = false;
    this._mostrarPopupInactivar = false;
    this.estadoOriginal = false;

    this.preguntaOriginalEdicion = '';
    this.url = environment.mercadeoApi;
    this.urlAssets = environment.experienciaUsuarioAssets;

    this.validacion = {
      pedidosTiposAgregados: {
        error: false,
        mensaje: '',
      },
      imagenAprobacion: {
        error: false,
        mensaje: '',
      },
      imagenDesaprobacion: {
        error: false,
        mensaje: '',
      },
      pregunta: {
        error: false,
        mensaje: '',
      },
      momento: {
        error: false,
        mensaje: '',
      },
      tipoPregunta: {
        error: false,
        mensaje: '',
      },
      extremoSuperiorTexto: {
        error: false,
        mensaje: '',
      },
      extremoInferiorTexto: {
        error: false,
        mensaje: '',
      },
    };

    this.validacionPedidoTipo = <PedidoTipoValido>{
      esCorrecto: true,
      id: 0,
      mensajes: [],
    };

    this.validacionPedidoTipoModal = <PedidoTipoValido>{
      esCorrecto: true,
      id: 0,
      mensajes: [],
    };

    this.informacionPreview = <InfomacionPreview>{
      id: -1,
      descripcion: '',
      imagenSatisfechoURL: '',
      imagenInsatisfechoURL: '',
      extremoInferiorTexto: '',
      extremoSuperiorTexto: '',
      tipoPregunta: 0,
      fecha: new Date(),
    };

    this.momentos = [
      {
        id: MomentoEvaluarPedido.Inmediatamente,
        descripcionMomento: 'Al momento de hacer el pedido web',
      },
      {
        id: MomentoEvaluarPedido.AlSerEntregado,
        descripcionMomento: 'Cuando el pedido haya sido entregado',
      },
    ];

    this.tiposPreguntas = [
      {
        id: 1,
        descripcionPregunta: 'Satisfecho/Insatisfecho',
      },
      {
        id: 2,
        descripcionPregunta: 'NPS del 0 al 10',
      },
    ];

    this.limpiarControles = new EventEmitter();
  }

  ngOnInit() {
    Alertas.load();
    this.actualizarGrid();

    this._encuestasService.ObtenerTodosLosPedidosTipos().subscribe(
      (res) => {
        this.listaPedidosTipos = res.map((pt) => ({
          text: pt.descripcion,
          value: pt.id,
        }));

        Alertas.close();
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._encuestasService.ObtenerTodasLasPreguntas().subscribe({
      next: (value) => {
        this.listaPreguntas = value;
      },
      error: (error) => {
        this.mostrarErrorHttp(error);
      },
      complete: () => {
        Alertas.close();
        if (onComplete) {
          onComplete();
        }
      },
    });
  }

  ngAfterContentInit(): void {
    this.limpiarControles.subscribe(
      (data) => {
        this.limpiar();
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  onUploaded(val, accion: string) {
    const regexUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const respuestaAPI = JSON.parse(val.request.response);
    const nombreImagen = respuestaAPI.nombreImagen;
    const src = respuestaAPI.src;

    if (regexUrl.test(src)) {
      switch (accion) {
        case 'aprobación':
          this.urlImagenAprobacion = src;
          this.imagenAprobacion = nombreImagen;
          break;
        case 'desaprobación':
          this.imagenDesaprobacion = respuestaAPI.nombreImagen;
          this.urlImagenDesaprobacion = src;
          break;
        default:
          break;
      }
    } else {
      Alertas.error(
        'Error',
        'Hubo un problema al subir la imagen, por favor inténtelo de nuevo.'
      );
    }
  }

  eliminarDetalle(id, cantidadPedidosTipos) {
    if (cantidadPedidosTipos.length === 1) {
      Alertas.error('Error', `Quedan muy pocos tipos de pedidos.`);
      return;
    }

    Alertas.question(
      `Eliminar tipo de pedido`,
      '¿Está seguro de que desea eliminar este tipo de pedido?'
    ).then((val) => {
      if (val) {
        Alertas.load();
        this._encuestasService.eliminarPreguntaPedidoTipo(id).subscribe(
          (res) => {
            if (res) {
              this.actualizarGrid();
            }
          },
          (error) => {
            this.mostrarErrorHttp(error);
          }
        );
      }
    });
  }

  cargarOpcionesDeFiltros(): void {
    this.filtros = this.infoPreviaAMostrarPreview.map((val) => ({
      text: `${val.text}, Pedido #${val.pedidoId}`,
      value: val.value,
    }));
  }

  agregarPedidosTiposGrid(e: any): void {
    let activo = this.formGroupEncuestas.get('checkActivo').value;

    if (!this.esEdicion) {
      this.validarSiSePuedeInsertar(e);
    }

    if (this.esEdicion) {
      if (
        this.cantidadPedidosTiposPorPregunta !== 0 &&
        this.estadoOriginal === true
      ) {
        this.cantidadPedidosTiposPorPregunta--;
      } else {
        this.validarSiSePuedeInsertar(e);
      }
    }

    this.eliminarMensajes(e);
  }

  validarSiSePuedeInsertar(e) {
    this.eliminarMensajes(e);

    e.addedItems.forEach((val) => {
      this._encuestasService.sePuedeAgregarPedido(val.value).subscribe(
        (sePuedeAgregar) => {
          if (!sePuedeAgregar.esCorrecto) {
            this.validacionPedidoTipo.esCorrecto = sePuedeAgregar.esCorrecto;
            sePuedeAgregar.mensajes.forEach((val) => {
              if (
                !this.validacionPedidoTipo.mensajes.some(
                  (mensaje) => mensaje.id === val.id
                )
              ) {
                this.validacionPedidoTipo.mensajes.push(val);
              }
            });
          }
        },
        (error) => {
          this.mostrarErrorHttp(error);
        }
      );
    });
  }

  private eliminarMensajes(e: any) {
    e.removedItems.forEach((val) => {
      this.validacionPedidoTipo.mensajes = this.validacionPedidoTipo.mensajes.filter(
        (x) => x.id !== val.value
      );
    });
  }

  limpiarFiltros(): void {
    try {
      this.pedidosTiposSeleccionadosDDL = [];
      this.validacionPedidoTipo.mensajes = [];
      this.validacionPedidoTipo.esCorrecto = true;

      this.pedidosTiposKeysSeleccionadas = [];
      this.pedidosTiposList.instance.unselectAll();
      this._dropdownPedidosTipos.instance.close();
      this.checkSeleccioanar.component.option('value', false);
      this.checkSeleccioanar.value = false;
    } catch (error) {}
  }

  emitEliminarPedidoTipo(pedidoTipoId: any) {
    this.removerPedidoTipo(pedidoTipoId);
  }

  removerPedidoTipo(pedidoTipoId: any): void {
    this.pedidosTiposKeysSeleccionadas = this.pedidosTiposKeysSeleccionadas.filter(
      (p) => p !== pedidoTipoId
    );
  }

  actualizar(val) {
    this.limpiarFiltros();
    this.limpiar();
    Alertas.load();
    this.esEdicion = true;
    this.idPregunta = val.id;
    this.estadoOriginal = val.activo;
    this.formGroupEncuestas.get('pregunta').setValue(val.descripcion);
    this.formGroupEncuestas
      .get('extremoInferiorTexto')
      .setValue(val.extremoInferiorTexto);
    this.formGroupEncuestas
      .get('extremoSuperiorTexto')
      .setValue(val.extremoSuperiorTexto);
    this.momento = val.momentoAEvaluar;
    this.tipoPregunta = val.tipoPregunta;
    this.preguntaOriginalEdicion = val.descripcion;
    this.formGroupEncuestas.get('checkActivo').setValue(val.activo);
    this.urlImagenAprobacion =
      val.imagenSatisfechoURL !== null &&
      val.imagenSatisfechoURL !== undefined &&
      val.imagenSatisfechoURL !== ''
        ? `${this.urlAssets}/${val.imagenSatisfechoURL}`
        : null;
    this.imagenAprobacion = val.imagenSatisfechoURL;
    this.urlImagenDesaprobacion =
      val.imagenInsatisfechoURL !== null &&
      val.imagenInsatisfechoURL !== undefined &&
      val.imagenInsatisfechoURL !== ''
        ? `${this.urlAssets}/${val.imagenInsatisfechoURL}`
        : null;
    this.imagenDesaprobacion = val.imagenInsatisfechoURL;
    this.calificaciones = val.calificaciones;
    this.obtenerDetalles(val.id);
  }

  async guardarCreacion() {
    this.submit = true;
    if (!(await this.validarFormulario())) {
      return;
    }
    Alertas.load();
    let descripcion = this.formGroupEncuestas.get('pregunta').value;
    let activo = this.formGroupEncuestas.get('checkActivo').value;
    const pedidosTiposIds = this.pedidosTiposKeysSeleccionadas;
    let imagenSatisfechoURL = this.imagenAprobacion;
    let imagenInsatisfechoURL = this.imagenDesaprobacion;
    let momentoAEvaluar = this.momento;
    let tipoPregunta = this.tipoPregunta;
    let extremoInferiorTexto = this.formGroupEncuestas.get(
      'extremoInferiorTexto'
    ).value;
    let extremoSuperiorTexto = this.formGroupEncuestas.get(
      'extremoSuperiorTexto'
    ).value;

    let pregunta = {
      descripcion,
      activo,
      imagenSatisfechoURL,
      imagenInsatisfechoURL,
      pedidosTiposIds,
      momentoAEvaluar,
      tipoPregunta,
      extremoSuperiorTexto,
      extremoInferiorTexto,
    };

    this._encuestasService.crearPregunta(pregunta).subscribe(
      (res) => {
        if (res.respuestaTipo === 0) {
          this.actualizarGrid(() => {
            this.limpiar();

            swal({
              type: 'success',
              title: '¡Correcto!',
              text: 'La pregunta se ha creado correctamente.',
              buttonsStyling: false,
              confirmButtonClass: 'mat-raised-button mat-accent',
              toast: false,
              position: SwalPosition.center,
            }).then((value) => {
              if (value) {
                setTimeout(() => {
                  document.getElementById('listadoEncuestas').scrollIntoView();
                }, 800);
              }
            });
          });
        } else if (res.respuestaTipo === 1) {
          Alertas.error('Error', res.respuesta);
        }
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  async guardarEdicion() {
    this.submit = true;
    if (!(await this.validarFormulario())) {
      return;
    }
    Alertas.load();

    let descripcion = this.formGroupEncuestas.get('pregunta').value;
    let activo = this.formGroupEncuestas.get('checkActivo').value;
    const pedidosTiposIds = this.pedidosTiposKeysSeleccionadas;
    let imagenSatisfechoURL = this.imagenAprobacion;
    let imagenInsatisfechoURL = this.imagenDesaprobacion;
    let id = this.idPregunta;
    let momentoAEvaluar = this.momento;
    let tipoPregunta = this.tipoPregunta;
    let extremoInferiorTexto = this.formGroupEncuestas.get(
      'extremoInferiorTexto'
    ).value;
    let extremoSuperiorTexto = this.formGroupEncuestas.get(
      'extremoSuperiorTexto'
    ).value;

    let pregunta = {
      id,
      descripcion,
      activo,
      imagenSatisfechoURL,
      imagenInsatisfechoURL,
      pedidosTiposIds,
      momentoAEvaluar,
      tipoPregunta,
      extremoSuperiorTexto,
      extremoInferiorTexto,
    };

    this._encuestasService.actualizarPregunta(pregunta).subscribe(
      (res) => {
        if (res.respuestaTipo === 1) {
          Alertas.error('Error', res.respuesta);
          return;
        }
        this.actualizarGrid(() => {
          this.limpiar();
          this.focusDataGrid();

          Alertas.ok(
            '¡Correcto!',
            'La pregunta se ha actualizado correctamente.'
          );
        });
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  focusDataGrid() {
    document.getElementById('listadoEncuestas').scrollIntoView();
  }

  async validarExistePregunta(descripcion): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._encuestasService.existePregunta(descripcion).subscribe(
        (res: boolean) => {
          if (res) {
            this.validacion.pregunta.error = true;
            this.validacion.pregunta.mensaje = 'Ya existe una pregunta igual.';
            resolve(false);
          } else {
            this.validacion.pregunta.error = false;
            resolve(true);
          }
        },
        (error) => {
          reject(false);
          this.mostrarErrorHttp(error);
        }
      );
    });
  }

  async validarFormulario() {
    let todoBien = true;
    let descripcion: string = this.formGroupEncuestas.get('pregunta').value;
    if (descripcion === '') {
      this.validacion.pregunta.error = true;
      this.validacion.pregunta.mensaje = 'El campo Pregunta es obligatorio.';
      todoBien = false;
    } else {
      if (this.esEdicion && this.preguntaOriginalEdicion !== descripcion) {
        todoBien = await this.validarExistePregunta(descripcion);
      } else if (!this.esEdicion) {
        todoBien = await this.validarExistePregunta(descripcion);
      }
    }

    const pedidosTiposIds = this.pedidosTiposKeysSeleccionadas;
    if (pedidosTiposIds.length === 0) {
      this.validacion.pedidosTiposAgregados.error = true;
      this.validacion.pedidosTiposAgregados.mensaje =
        'Seleccione al menos un Tipo de Pedido.';
      todoBien = false;
    } else {
      this.validacion.pedidosTiposAgregados.error = false;
    }

    if (this.tipoPregunta === this.tiposPreguntasTipo.SatisfechoInsatisfecho) {
      let imagenSatisfechoURL = this.imagenAprobacion || '';
      if (imagenSatisfechoURL === '') {
        this.validacion.imagenAprobacion.error = true;
        this.validacion.imagenAprobacion.mensaje =
          'Por favor suba una imagen de aprobación';
        todoBien = false;
      } else {
        this.validacion.imagenAprobacion.error = false;
      }

      let imagenInsatisfechoURL = this.imagenDesaprobacion || '';
      if (imagenInsatisfechoURL === '') {
        this.validacion.imagenDesaprobacion.error = true;
        this.validacion.imagenDesaprobacion.mensaje =
          'Por favor, suba una imagen de desaprobación';
        todoBien = false;
      } else {
        this.validacion.imagenDesaprobacion.error = false;
      }
    }

    if (this.tipoPregunta === this.tiposPreguntasTipo.NPS) {
      let extremoSuperiorTexto: string =
        this.formGroupEncuestas.get('extremoSuperiorTexto').value || '';
      let extremoInferiorTexto: string =
        this.formGroupEncuestas.get('extremoInferiorTexto').value || '';

      if (extremoSuperiorTexto === '') {
        this.validacion.extremoSuperiorTexto.error = true;
        this.validacion.extremoSuperiorTexto.mensaje =
          'Por favor, escriba un texto para el extremo superior de la calificación';
        todoBien = false;
      } else {
        this.validacion.extremoSuperiorTexto.error = false;
      }

      if (extremoInferiorTexto === '') {
        this.validacion.extremoInferiorTexto.error = true;
        this.validacion.extremoInferiorTexto.mensaje =
          'Por favor, escriba un texto para el extremo inferior de la calificación';
        todoBien = false;
      } else {
        this.validacion.extremoInferiorTexto.error = false;
      }
    }

    if (this.momento === 0) {
      this.validacion.momento.error = true;
      this.validacion.momento.mensaje = 'Por favor seleccione una opción.';
      todoBien = false;
    } else {
      this.validacion.momento.error = false;
    }

    if (this.tipoPregunta === 0) {
      this.validacion.tipoPregunta.error = true;
      this.validacion.tipoPregunta.mensaje = 'Por favor seleccione una opción.';
      todoBien = false;
    } else {
      this.validacion.tipoPregunta.error = false;
    }

    if (!todoBien) {
      notify(
        'Por favor, revise que todos los campos sean correctos.',
        'error',
        3000
      );
    }
    return todoBien;
  }

  obtenerDetalles(id) {
    this._encuestasService.ObtenerPedidosTiposPorPregunta(id).subscribe(
      (res) => {
        res.forEach((pedidoTipoDb) => {
          this.pedidosTiposSeleccionadosDDL.push({
            text: pedidoTipoDb.descripcion,
            value: pedidoTipoDb.id,
          });
        });
        this.cantidadPedidosTiposPorPregunta = res.length;

        Alertas.close();
        setTimeout(() => {
          this._pregunta.instance.focus();
        }, 1500);
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  inactivar(id) {
    Alertas.load();
    this._encuestasService.inactivarPregunta(id).subscribe(
      (seInactivo) => {
        if (seInactivo) {
          this.listaPreguntas = this.listaPreguntas.map((p) => {
            if (p.id === id) {
              p.activo = false;
              return p;
            }
            return p;
          });
          Alertas.close();
          Alertas.ok(
            '¡Correcto!',
            'La pregunta se ha inactivado correctamente.'
          );
        } else {
          Alertas.error('Error', 'Hubo un error al inactivar la pregunta.');
        }
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  mostrarErrorHttp(error) {
    Alertas.showHttpResponse(
      '',
      'Hubo un error inesperado, por favor inténtelo de nuevo.'
    );
  }

  activar(pregunta) {
    Alertas.load();
    this._encuestasService.sePuedeActivarPregunta(pregunta).subscribe(
      (sePuedeAgregar) => {
        this.idPreguntaActivar = pregunta;
        this.validacionPedidoTipoModal = sePuedeAgregar;
        Alertas.close();
        Alertas.close();
        this._mostrarPopupInactivar = true;
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  activarPregunta() {
    this.cerrarPreviewPedidosTipos();
    Alertas.load();
    this._encuestasService.activarPregunta(this.idPreguntaActivar).subscribe(
      (sePuedeActivar) => {
        this.actualizarGrid(() => {
          Alertas.ok('¡Correcto!', 'La pregunta se ha activado correctamente.');
        });
      },
      (error) => {
        this.mostrarErrorHttp(error);
      }
    );
  }

  limpiar() {
    this.esEdicion = false;
    this.calificaciones = 0;
    this.urlImagenAprobacion = '';
    this.validacionPedidoTipo = <PedidoTipoValido>{
      esCorrecto: false,
      mensajes: [],
    };
    this.momento = 0;
    this.tipoPregunta = 0;
    this.pedidosTiposKeysSeleccionadas = [];
    this.urlImagenDesaprobacion = '';
    this.imagenAprobacion = '';
    this.preguntaOriginalEdicion = '';
    this.imagenDesaprobacion = '';
    this.pedidosTiposKeysSeleccionadas = [];
    this.formGroupEncuestas.get('pregunta').setValue('');
    this.formGroupEncuestas.get('extremoInferiorTexto').setValue('');
    this.formGroupEncuestas.get('extremoSuperiorTexto').setValue('');
    this.formGroupEncuestas.get('checkActivo').setValue(false);
    this.fileUploaderDesaprobacion = [];
    this.fileUploaderAprobacion = [];
    this.estadoOriginal = false;
    this.submit = false;
  }

  cargarFormGroup(): void {
    this.formGroupEncuestas = this._formBuilder.group({
      checkActivo: new FormControl(false),
      pregunta: new FormControl(''),
      extremoInferiorTexto: new FormControl(''),
      extremoSuperiorTexto: new FormControl(''),
    });
    this.formGroupResultadoEncuesta = this._formBuilder.group({
      comentario: new FormControl(''),
    });
  }

  mostrarPreview(data: InfomacionPreview) {
    this._mostrarPopup = true;
    this.informacionPreview.id = data.id;
    this.informacionPreview.tipoPregunta = data.tipoPregunta;
    this.informacionPreview.descripcion = data.descripcion;
    this.informacionPreview.extremoSuperiorTexto = data.extremoSuperiorTexto;
    this.informacionPreview.extremoInferiorTexto = data.extremoInferiorTexto;
    this.informacionPreview.imagenSatisfechoURL = `${environment.experienciaUsuarioAssets}/${data.imagenSatisfechoURL}`;
    this.informacionPreview.imagenInsatisfechoURL = `${environment.experienciaUsuarioAssets}/${data.imagenInsatisfechoURL}`;
  }

  cambioDeValorRadioGroupTiposPedidos(e) {
    this.pedidoSeleccionadoPreview = e.value.value;
  }

  cerrarPreview() {
    this._mostrarPopup = false;
    this.informacionPreview.id = -1;
    this.informacionPreview.descripcion = '';
    this.informacionPreview.imagenSatisfechoURL = '';
    this.informacionPreview.imagenInsatisfechoURL = '';
    this.formGroupResultadoEncuesta.get('comentario').setValue('');
    this.satisfechoSeleccionado = false;
    this.insatisfechoSeleccionado = false;
  }

  cerrarPreviewPedidosTipos() {
    this._mostrarPopupInactivar = false;
    this.validacionPedidoTipoModal = <PedidoTipoValido>{
      esCorrecto: false,
      mensajes: [],
    };
    this._mostrarPopupInactivar = false;
  }

  seleccionarSatisfechoInsatisfecho(opcionSeleccionada) {
    switch (opcionSeleccionada) {
      case 'satisfecho':
        this.satisfechoSeleccionado = true;
        this.insatisfechoSeleccionado = false;
        break;
      case 'insatisfecho':
        this.insatisfechoSeleccionado = true;
        this.satisfechoSeleccionado = false;
        break;
      default:
        break;
    }
  }

  guardarPreviewFalsamente() {
    Alertas.ok(
      'Éxito',
      '¡Se ha calificado exitosamente! Gracias por tomarse su tiempo para calificarnos.'
    );
    this.cerrarPreview();
  }
}
