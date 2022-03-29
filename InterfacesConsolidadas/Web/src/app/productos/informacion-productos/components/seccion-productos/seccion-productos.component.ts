import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { DxDataGridComponent, DxFileUploaderComponent, DxLookupComponent } from "devextreme-angular";
import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";
import { param } from "jquery";
import { Subject } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../helpers/utils";
import { LoginService } from "../../../../login/services/login.service";
import { ProductLookup } from "../../../product-lookup/models/product-lookup.model";
import { ProductoService } from "../../../producto.service";
import { LookupSeccion } from "../../models/lookup-seccion.model";
import { InformacionSeccionProductoDetalle } from "../../models/seccion-producto-detalle.model";
import { ProductoInformacionSeccionProductos } from "../../models/seccion-productos.model";
import { ProductoInformacionSeccionesTipo } from "../../models/secciones-tipo.model";
import { TipoEvento } from "../../models/tipos-eventos";
import { SeccionProductosService } from "../../services/seccion-productos.service";
import { SeccionService } from "../../services/seccion.service";

@Component({
  selector: "app-seccion-productos",
  templateUrl: "./seccion-productos.component.html",
  styleUrls: ["./seccion-productos.component.css"],
})
export class SeccionProductosComponent implements OnInit {
  //#region Propiedades

  @ViewChild("lookupSeccion")
  _lookupSeccion: DxLookupComponent;
  @ViewChild("dxFile")
  _dxFile: DxFileUploaderComponent;
  @ViewChild("dataGridProductos") dataGridProductos: DxDataGridComponent;
  eventsSubjectTable: Subject<TipoEvento> = new Subject<TipoEvento>();

  seccionLookup: LookupSeccion[];
  productosEdit: ProductLookup[];
  detallesListView: InformacionSeccionProductoDetalle[];
  customStoreSeccionProductos: any;

  formGroupSeccionProductos: FormGroup;
  formGroupTextArea: FormGroup;

  producto: ProductLookup;
  seccionSeleccionada: LookupSeccion;

  seccionTipo = ProductoInformacionSeccionesTipo;

  validacion: any;
  productoSeleccionado: any;

  seccionId: number;
  seccionProductoSeleccionadaId: number;

  html: string;
  productoSeleccionadoId: string;
  productoSeleccionadoDescripcion: string;
  urlProcesarCsv;
  urlListView;
  urlTable;

  submit: boolean;
  botonAgregarDeshabilitado: boolean;
  botonEditarDeshabilitado: boolean;
  esEdicion: boolean;
  _limpiarDetalle: boolean;
  elProductoEsReadonly: boolean;
  elDetalleTextAreaEsDistintoAlOriginal: boolean;

  //#endregion

  //#region Constructor
  constructor(
    private _seccionServicio: SeccionService,
    private _formBuilder: FormBuilder,
    private _seccionProductosService: SeccionProductosService,
    private _productoService: ProductoService,
    private _loginService: LoginService,
    public _httpClient: HttpClient
  ) {
    this.submit = false;
    this._limpiarDetalle = true;
    this.botonAgregarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.esEdicion = false;
    this.elProductoEsReadonly = false;
    this.seccionId = helpers.VALOR_POR_DEFECTO_ID;
    this.seccionProductoSeleccionadaId = helpers.VALOR_POR_DEFECTO_ID;
    this.html = "";

    this.validacion = {
      productoId: {
        error: false,
        mensaje: "",
      },
      productoInformacionSeccionId: {
        error: false,
        mensaje: "",
      },
      valor: {
        error: false,
        mensaje: "",
      },
    };

    this.producto = {
      productoId: "",
      producto: "",
    };

    this.detallesListView = <InformacionSeccionProductoDetalle[]>[];

    this.customStoreSeccionProductos = new CustomStore({
      key: "ProductoId",
      load: (loadOptions: any) => {
        let params: HttpParams = new HttpParams();
        [
          "filter",
          "skip",
          "take",
          "requireTotalCount",
          "requireGroupCount",
          "sort",
          "totalSummary",
          "group",
          "groupSummary",
        ].forEach((i) => {
          if (i in loadOptions && helpers.isNotEmpty(loadOptions[i])) {
            params = params.set(i, JSON.stringify(loadOptions[i]));
          }

          if (i === 'take' && !helpers.isNotEmpty(loadOptions[i])) {
            params = params.set('take', JSON.stringify(20));
          }
        });
        return _httpClient
          .get(
            `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/obtenerSSR`,
            { params: params }
          )
          .toPromise()
          .then((data: any) => {
            return {
              data: data.data,
              totalCount: data.totalCount,
              summary: data.summary,
              groupCount: data.groupCount,
            };
          })
          .catch((error) => {
            throw "Hubo un error";
          });
      },
    });

    const endpointSeccionProductos: string = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos`;

    this.urlProcesarCsv = `${endpointSeccionProductos}/SubirCsv?usuarioId=${this._loginService.Usuario.id}`;
  }

  ngOnInit() {
    this.construirFormularios();
    this.obtener();
    this._limpiarDetalle = true;
  }

  construirFormularios() {
    this.formGroupSeccionProductos = this._formBuilder.group({
      id: new FormControl(helpers.VALOR_POR_DEFECTO_ID),
      productoInformacionSeccionId: new FormControl(
        helpers.VALOR_POR_DEFECTO_ID
      ),
      productoId: new FormControl(helpers.VALOR_POR_DEFECTO_ID),
      activo: new FormControl(true),
    });

    this.formGroupTextArea = this._formBuilder.group({
      id: new FormControl(helpers.VALOR_POR_DEFECTO_ID),
      informacionSeccionProductoId: new FormControl(
        helpers.VALOR_POR_DEFECTO_ID
      ),
      activo: new FormControl(true),
      valor: new FormControl(""),
      fueEditado: new FormControl(""),
      visibleWeb: new FormControl(false),
    });
  }

  //#endregion

  //#region Funciones
  procesarError() {
    return (error) => {
      console.log(error);
      Alertas.close();
      helpers.procesarError(error);
    };
  }

  limpiarDetalle(limpiar: boolean) {
    console.log("Limpiar Detalle:", limpiar);
    this._limpiarDetalle = limpiar;
  }

  inputExcelChanged(seccionTipo: ProductoInformacionSeccionesTipo) {
    switch (seccionTipo) {
      case ProductoInformacionSeccionesTipo.TextArea:
        console.log("Text Area");

        break;

      case ProductoInformacionSeccionesTipo.ListView:
        console.log("List View");
        break;

      case ProductoInformacionSeccionesTipo.Table:
        console.log("Table");
        break;

      default:
        break;
    }
  }

  onUploadedCsv(e) {
    const respuesta = JSON.parse(e.request.response);
    const RESPUESTA_TIPO_ERROR: number = 1;
    if (respuesta.respuestaTipo === RESPUESTA_TIPO_ERROR) {
      Alertas.errorEnServidor("Error", respuesta.mensaje);
      this._dxFile.instance.reset();
      return;
    }

    this.actualizarGridProductos(() => {
      Alertas.ok("Los datos se han agregado éxitosamente.");
      this._dxFile.instance.reset();
    });
  }

  onUploadedErrorCsv(e) {
    switch (e.request.status) {
      case 400:
        Alertas.errorEnServidor("Validación", e.request.response);
        break;
      case 500:
        Alertas.errorEnServidor(
          "Hubo un error en el servidor",
          e.request.response
        );
        break;
      default:
        Alertas.errorEnServidor("Error", "Ha ocurrido un error desconocido.");
        break;
    }
    this._dxFile.instance.reset();
  }

  //#endregion

  //#region Maestro Producto
  actualizarGridProductos(
    onComplete?: Function,
    mostrarAlerta: boolean = true
  ): void {
    if (mostrarAlerta) Alertas.load();

    this.dataGridProductos.instance
      .refresh()
      .then((x) => {
        if (mostrarAlerta) Alertas.close();
        if (onComplete) onComplete();
      })
      .catch((error) => {
        helpers.procesarError(error);
      });
  }

  obtener(): void {
    this._seccionServicio.obtenerLookup().subscribe((data) => {
      Alertas.close();
      this.seccionLookup = data;
    }, this.procesarError());
  }

  productoSeleccionadoPorDefecto() {
    return {
      productoId: "",
      producto: "",
    };
  }

  onProductoSeleccionado(producto: any) {
    this.productoSeleccionadoDescripcion = producto
      ? producto.producto || ""
      : "";

    this.productoSeleccionado = producto
      ? producto.productoId || ""
      : (this.productoSeleccionado =
          producto || this.productoSeleccionadoPorDefecto());

    this.productoSeleccionadoId = producto
      ? producto.productoId || ""
      : (this.productoSeleccionado = producto || "");

    this.formGroupSeccionProductos
      .get("productoId")
      .setValue(this.productoSeleccionadoId);
  }

  limpiarProducto(limpiarEdicion: boolean = true) {
    if (this._limpiarDetalle) {
      this.formGroupSeccionProductos.reset();
      this.formGroupSeccionProductos.get("activo").setValue(true);
      this.formGroupSeccionProductos
        .get("id")
        .setValue(helpers.VALOR_POR_DEFECTO_ID);
      this.seccionProductoSeleccionadaId = helpers.VALOR_POR_DEFECTO_ID;
    }

    this.formGroupTextArea.reset();
    this.formGroupTextArea.get("id").setValue(helpers.VALOR_POR_DEFECTO_ID);
    this.formGroupTextArea.get("activo").setValue(true);
    this.formGroupTextArea.get("visibleWeb").setValue(false);
    this.formGroupTextArea.get("valor").setValue("");
    this.formGroupTextArea
      .get("informacionSeccionProductoId")
      .setValue(helpers.VALOR_POR_DEFECTO_ID);

    if (limpiarEdicion) {
      this.esEdicion = false;
    }

    this.botonEditarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;

    if (this._limpiarDetalle) {
      this.submit = false;
      this.seccionSeleccionada = null;
      this.seccionId = helpers.VALOR_POR_DEFECTO_ID;
      this.seccionSeleccionada = null;
      this.seccionId = helpers.VALOR_POR_DEFECTO_ID;
      this._lookupSeccion.value = helpers.VALOR_POR_DEFECTO_ID;
      this.producto = <ProductLookup>{};
      this.elProductoEsReadonly = false;
      this.productosEdit = <ProductLookup[]>[];
      this.producto.productoId = "";
      this.detallesListView = <InformacionSeccionProductoDetalle[]>[];
    }

    this.elDetalleTextAreaEsDistintoAlOriginal = false;
  }

  validarFormularioProductos(): boolean {
    let todoBien = true;

    const productoInformacionSeccionId: number =
      this.formGroupSeccionProductos.get("productoInformacionSeccionId").value;

    if (!productoInformacionSeccionId) {
      this.validacion.productoInformacionSeccionId.error = true;
      this.validacion.productoInformacionSeccionId.mensaje =
        "La sección es requerida.";
      todoBien = false;
    } else {
      this.validacion.productoInformacionSeccionId.error = false;
    }

    const productoId = this.formGroupSeccionProductos.get("productoId").value;

    if (helpers.isNotEmpty(productoId)) {
      this.validacion.productoId.error = false;
    } else {
      this.validacion.productoId.error = true;
      this.validacion.productoId.mensaje = "El producto es Requerido.";
      todoBien = false;
    }

    if (!todoBien && this.formGroupSeccionProductos.valid) {
      notify(
        "Por favor, revise que todos los campos sean correctos.",
        "error",
        3000
      );
    }

    return todoBien;
  }

  validarFormularioTextArea(mostrarMensajes: boolean = true): boolean {
    let todoBien = true;

    const valor: number = this.formGroupTextArea.get("valor").value;

    if (helpers.isNotEmpty(valor)) {
      this.validacion.valor.error = false;
    } else {
      this.validacion.valor.error = true;

      if (mostrarMensajes)
        this.validacion.valor.mensaje =
          "Por favor escriba una descripción para el producto seleccionado.";

      todoBien = false;
    }

    if (!todoBien && this.formGroupSeccionProductos.valid && mostrarMensajes) {
      notify(
        "Por favor, revise que todos los campos sean correctos.",
        "error",
        3000
      );
    }

    return todoBien;
  }

  validarFormularioListView(mostrarMensajes: boolean = true): boolean {
    let todoBien = true;

    this.detallesListView.forEach((detalle) => {
      if (!helpers.isNotEmpty(detalle.valor)) {
        if (mostrarMensajes)
          notify(
            "Por favor, asegúrse que todos los valores de la lista son válidos.",
            "error",
            3000
          );
        todoBien = false;
      }

      if (
        !todoBien &&
        this.formGroupSeccionProductos.valid &&
        mostrarMensajes
      ) {
        notify(
          "Por favor, revise que todos los campos sean correctos.",
          "error",
          3000
        );
      }
    });

    const LISTA_VACIA: number = 0;
    if (this.detallesListView.length === LISTA_VACIA) {
      todoBien = false;
      if (mostrarMensajes) notify("Los detalles vienen vacíos", "error", 3000);
    }

    return todoBien;
  }

  agregarDetalles(
    dto: ProductoInformacionSeccionProductos,
    esEdicion: boolean = false
  ): boolean {
    switch (this.seccionSeleccionada.seccionTipoId) {
      case ProductoInformacionSeccionesTipo.TextArea:
        if (!this.validarFormularioTextArea(false)) {
          return true;
        }
        const detalle: InformacionSeccionProductoDetalle = <
          InformacionSeccionProductoDetalle
        >{
          ...this.formGroupTextArea.value,
          fueEditado: this.elDetalleTextAreaEsDistintoAlOriginal,
        };

        detalle[esEdicion ? "usuarioModificaId" : "usuarioAgregaId"] =
          helpers.obtenerUsusarioIdInt(this._loginService.Usuario.id);

        dto.informacionSeccionProductoDetalles.push(detalle);
        return true;
      case ProductoInformacionSeccionesTipo.ListView:
        if (!this.validarFormularioListView(false)) {
          return true;
        }
        dto.informacionSeccionProductoDetalles = this.detallesListView;
        return true;
      case ProductoInformacionSeccionesTipo.Table:
        return true;
      default:
        return false;
    }
  }

  async agregarProducto() {
    this.submit = true;
    this.botonAgregarDeshabilitado = true;

    if (!(await this.validarFormularioProductos())) {
      this.botonAgregarDeshabilitado = false;
      return;
    }

    const dto: ProductoInformacionSeccionProductos = <
      ProductoInformacionSeccionProductos
    >{
      ...this.formGroupSeccionProductos.value,
      productoInformacionSeccionId: this.seccionId,
      productoId: this.productoSeleccionadoId,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
      informacionSeccionProductoDetalles: [],
    };

    var respuestaSeAgregaronDetalles = this.agregarDetalles(dto);

    if (!respuestaSeAgregaronDetalles) {
      this.botonAgregarDeshabilitado = false;
      return;
    }

    Alertas.load();

    this._seccionProductosService.guardar(dto).subscribe(
      (res) => {
        if (res.respuestaTipo === 1) {
          Alertas.error("Error", res.respuesta);
          return;
        }

        this.formGroupSeccionProductos.get("id").setValue(res.id);
        this.seccionProductoSeleccionadaId = res.id;

        this.actualizarGridProductos(() => {
          this.limpiarProducto();

          Alertas.ok("¡Correcto!", "Los datos se han agregado correctamente.");
        });
      },
      (error) => {
        helpers.procesarError(error);
      }
    );

    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    Alertas.close();
  }

  async editarProducto() {
    this.submit = true;
    this.botonEditarDeshabilitado = true;
    if (!(await this.validarFormularioProductos())) {
      this.botonEditarDeshabilitado = false;
      return;
    }

    const dto: ProductoInformacionSeccionProductos = <
      ProductoInformacionSeccionProductos
    >{
      ...this.formGroupSeccionProductos.value,
      productoInformacionSeccionId: this.seccionId,
      productoId: this.productoSeleccionadoId,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
      informacionSeccionProductoDetalles: [],
    };

    var respuestaSeAgregaronDetalles = this.agregarDetalles(dto, true);

    if (!respuestaSeAgregaronDetalles) {
      this.botonEditarDeshabilitado = false;
      return;
    }

    Alertas.load();

    this._seccionProductosService.editar(dto).subscribe(
      (res) => {
        if (res.respuestaTipo === 1) {
          Alertas.error("Error", res.respuesta);
          return;
        }

        this.actualizarGridProductos(() => {
          this.limpiarProducto(false);
          Alertas.ok(
            "¡Correcto!",
            "Los datos se han actualizado exitosamente."
          );
          this.esEdicion = false;
        });
      },
      (error) => {
        helpers.procesarError(error);
      }
    );
    this.submit = false;
    this.botonEditarDeshabilitado = false;
  }

  inactivarProducto(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._seccionProductosService.inactivar(id).subscribe(
        (seInactivo) => {
          if (seInactivo) {
            Alertas.close();
            this.actualizarGridProductos(null, false);
          } else {
            Alertas.error("Error", "Hubo un error al inactivar el registro.");
          }
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    });
  }

  activarProducto(id: number) {
    Alertas.load();
    this._seccionProductosService.activar(id).subscribe(
      (seInactivo) => {
        if (seInactivo) {
          Alertas.close();
          this.actualizarGridProductos(null, false);
        } else {
          Alertas.error("Error", "Hubo un error al activar el registro.");
        }
      },
      (error) => {
        helpers.procesarError(error);
      }
    );
  }

  obtenerValoresParaActualizarProducto(
    data: ProductoInformacionSeccionProductos
  ) {
    this.limpiarProducto();
    this.emitEventToTableComponent(TipoEvento.LimpiarTabla);

    this.esEdicion = true;
    this.elProductoEsReadonly = true;

    this.formGroupSeccionProductos.get("productoId").setValue(data.productoId);
    this.formGroupSeccionProductos.get("id").setValue(data.id);
    this.seccionProductoSeleccionadaId = data.id;
    this.formGroupSeccionProductos.get("activo").setValue(data.activo);
    this.formGroupSeccionProductos
      .get("productoInformacionSeccionId")
      .setValue(data.productoInformacionSeccionId);

    this.seccionId = data.productoInformacionSeccionId;
    this.seccionSeleccionada = this.seccionLookup.filter(
      (x) => x.id === data.productoInformacionSeccionId
    )[0];

    this._productoService.Buscador(data.productoId).subscribe((productos) => {
      this.producto = productos[0];
      this.productosEdit = productos.map(
        (x) => <ProductLookup>{ producto: x.producto, productoId: x.productoId }
      );
    });

    this.producto.productoId = data.productoId;

    let seccionTipoId = this.seccionLookup.filter(
      (x) => x.id === data.productoInformacionSeccionId
    )[0];

    switch (seccionTipoId.seccionTipoId) {
      case ProductoInformacionSeccionesTipo.TextArea:
        this._seccionProductosService
          .obtenerDetalles(data.id)
          .subscribe(
            (seccionProductoDetalles: InformacionSeccionProductoDetalle[]) => {
              if (seccionProductoDetalles.length === 0) {
                return;
              }

              this.formGroupTextArea
                .get("valor")
                .setValue(seccionProductoDetalles[0].valor || "");

              this.formGroupTextArea
                .get("id")
                .setValue(
                  seccionProductoDetalles[0].id || helpers.VALOR_POR_DEFECTO_ID
                );

              this.formGroupTextArea
                .get("activo")
                .setValue(seccionProductoDetalles[0].activo);

              this.formGroupTextArea
                .get("informacionSeccionProductoId")
                .setValue(
                  seccionProductoDetalles[0].informacionSeccionProductoId ||
                    helpers.VALOR_POR_DEFECTO_ID
                );

              this.formGroupTextArea
                .get("visibleWeb")
                .setValue(seccionProductoDetalles[0].visibleWeb);
            },
            this.procesarError()
          );
        break;
      case ProductoInformacionSeccionesTipo.ListView:
        this._seccionProductosService
          .obtenerDetalles(data.id)
          .subscribe(
            (seccionProductoDetalles: InformacionSeccionProductoDetalle[]) => {
              this.detallesListView = seccionProductoDetalles;
            },
            this.procesarError()
          );
        break;
      case ProductoInformacionSeccionesTipo.Table:
        setTimeout(() => {
          this.emitEventToTableComponent(TipoEvento.RecargarTabla);
        }, 0);
        break;
      default:
        break;
    }
  }

  onSeccionChanged() {
    this.seccionSeleccionada = this._lookupSeccion.selectedItem;

    if (this.seccionSeleccionada) {
      this.formGroupSeccionProductos
        .get("productoInformacionSeccionId")
        .setValue(this.seccionSeleccionada.id);
    }
  }

  setearDetalles(detalles: InformacionSeccionProductoDetalle[]) {
    this.detallesListView = detalles;
    console.log(this.detallesListView);
  }

  verificarSiElValorEsElMismoQueElOriginal(esDistinto: boolean) {
    this.elDetalleTextAreaEsDistintoAlOriginal = esDistinto;
  }

  emitEventToTableComponent(tipoEvento: TipoEvento) {
    this.eventsSubjectTable.next(tipoEvento);
  }
  //#endregion
}
