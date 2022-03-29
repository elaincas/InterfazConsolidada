import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DxDataGridComponent } from "devextreme-angular";
import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";
import { environment } from "../../../../../../environments/environment";
import { TrasladarProductosService } from "../../../../../desarrollo-productos/Inventario-Productos/componentes/trasladar-productos/trasladar-productos.service";
import { ProductoGrid } from "../../../../../desarrollo-productos/Inventario-Productos/_Clases/GridTrasladoProductos";
import { ConfiguracionProductosRecompraService } from "../../../../../ecommerce/recompra/_services/configuracion-productos.service";
import { Alertas } from "../../../../../helpers/notificaciones/notificaciones";
import { LoginService } from "../../../../../login/services/login.service";
import { ProductodDescuentoExclusivoListado } from "../../../models/producto-descuento-exclusivo-listado.model";
import { ProductosDescuentosExclusivosService } from "../../../services/productos-descuentos-exclusivos.service";
import { helpers } from "../../../../../helpers/utils";

@Component({
  selector: "app-productos-descuentos-exclusivos",
  templateUrl: "./productos-descuentos-exclusivos.component.html",
  styleUrls: ["./productos-descuentos-exclusivos.component.css"],
})
export class ProductosDescuentosExclusivosComponent implements OnInit {
  _productoSeleccionado: string;
  productosSeleccionadoDataSource: any;
  productos: any;
  validacion: any;
  formGroupProductosDescuentosExclusivos: FormGroup;
  productosDescuentosExclusivos: ProductodDescuentoExclusivoListado[];
  productoGrid: ProductoGrid;
  cantidadTotal: number;
  cantidadRestante: number;
  submit: Boolean;
  botonAgregarDeshabilitado: Boolean;
  botonEditarDeshabilitado: Boolean;
  esEdicion: Boolean;
  productoExclusivoId: number;
  estadoOriginal: boolean;
  esPrimeraBusqueda: boolean;
  public archivosExcel: Array<File>;
  excelProductos: File;
  url: string;

  @ViewChild("gridProductos") gridProductos: DxDataGridComponent;

  constructor(
    private _administracionProductosDescuentosExclusivosService: ProductosDescuentosExclusivosService,
    private _formBuilder: FormBuilder,
    private _traspadarProductoService: TrasladarProductosService,
    public _httpClient: HttpClient,
  ) {
    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    this.botonEditarDeshabilitado = false;
    this.esEdicion = false;
    this.productoGrid = new ProductoGrid();
    this.archivosExcel = new Array<File>();

    this.cantidadTotal = 0;
    this.cantidadTotal = 0;
    this.productoExclusivoId = 0;
    this.esPrimeraBusqueda = true;
    this.url = `${environment.maestrosFarmaciaApi}/api/productosDescuentosExclusivos/SubirCsvProductos`;

    const POSICION_COLUMNA_IDENTIFICADOR = 0;
    const POSICION_NOMBRE_PRODUCTO = 1;

    this.productos = new CustomStore({
      key: "OrderNumber",
      load: (loadOptions: any) => {
        if (!loadOptions["filter"]) {
          const promesa = new Promise((resolve, reject) => {
            let data = [];
            resolve({
              data,
            });
          });

          return promesa;
        }
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
          if (i in loadOptions && this.isNotEmpty(loadOptions[i])) {
            // Si es la columna nombre de porducto
            if (
              (loadOptions[i].columnIndex === POSICION_NOMBRE_PRODUCTO ||
                loadOptions[i].columnIndex ===
                  POSICION_COLUMNA_IDENTIFICADOR) &&
              this.esPrimeraBusqueda
            ) {
              this.esPrimeraBusqueda = false;
              let loadOptionsTemp = loadOptions[i];
              loadOptionsTemp[1] = "contains";
              params = params.set(i, JSON.stringify(loadOptionsTemp));
              return;
            }
            params = params.set(i, JSON.stringify(loadOptions[i]));
          }
        });

        return _httpClient
          .get(
            `${environment.maestrosFarmaciaApi}/api/productos/ObtenerProductosServerSideRendering`,
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

    this.validacion = {
      productoId: {
        error: false,
        mensaje: "",
      },
      descuento: {
        error: false,
        mensaje: "",
      },
      fechaInicio: {
        error: false,
        mensaje: "",
      },
      fechaFin: {
        error: false,
        mensaje: "",
      },
    };
  }

  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }

  private procesarError(error) {
    switch (error.status) {
      case 400:
        Alertas.showValidationMessage(error);
        break;
      case 500:
        Alertas.errorEnServidor("Hubo un error en el servidor.", error._body);
        break;
      default:
        Alertas.showHttpResponse(error);
        break;
    }
  }

  ngOnInit() {
    console.log("hola mundo");
    this.construirFormulario();
    this.cargarDescuentosExclusivos();
  }

  buscarProducto() {
    this._traspadarProductoService
      .ObtenerProductosInventarioId(this.productoGrid.ProductoCod)
      .subscribe(
        (data) => {
          if (data.RespuestaMensaje != "OK") {
            Alertas.warning("Advertencia", data.RespuestaMensaje);
            return;
          }
          this.productoGrid.Precio = data.Precio;
          this.cantidadTotal = data.Cantidad;
          this.cantidadRestante = data.Cantidad;
          this.productoGrid.Costo = data.Costo;
          this.productoGrid.NombreProducto = data.DescripcionProducto;
        },
        (error) => {
          Alertas.warning("Advertencia", "Producto no existe o no está activo");
        }
      );
  }

  construirFormulario() {
    this.formGroupProductosDescuentosExclusivos = this._formBuilder.group({
      descuento: new FormControl(),
      productoId: new FormControl(),
      fechaInicio: new FormControl(),
      fechaFin: new FormControl(),
    });
  }

  cargarDescuentosExclusivos() {
    this._administracionProductosDescuentosExclusivosService
      .obtenerProductosDescuentosExclusivos()
      .subscribe(
        (data) => {
          Alertas.close();
          this.productosDescuentosExclusivos = data;
        },
        (error) => {
          console.log(error);

          Alertas.close();

          this.procesarError(error);
        }
      );
  }

  enter(data) {
    if (data.event.keyCode == 13) {
      this.buscarProducto();
    }
  }

  set productoSeleccionado(value: string) {
    this._productoSeleccionado = value;
  }
  get productoSeleccionado(): string {
    return this._productoSeleccionado;
  }

  filaClickeada(fila) {
    this.productosSeleccionadoDataSource = [fila.data];
    this._productoSeleccionado = fila.data.identificador;
  }

  mostrarErrorHttp(error) {
    Alertas.showHttpResponse(
      "",
      "Hubo un error inesperado, por favor inténtelo de nuevo."
    );
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._administracionProductosDescuentosExclusivosService
      .obtenerProductosDescuentosExclusivos()
      .subscribe({
        next: (data) => {
          Alertas.close();
          this.productosDescuentosExclusivos = data;
        },
        error: (error) => {
          this.procesarError(error);
        },
        complete: () => {
          Alertas.close();
          if (onComplete) {
            onComplete();
          }
        },
      });
  }

  async validarFormulario() {
    let todoBien = true;
    const DESCUENTO_MINIMO = 0;
    const DESCUENTO_MAXIMO = 100;

    let productoId: string = this.formGroupProductosDescuentosExclusivos.get(
      "productoId"
    ).value;

    if (!productoId && !this.esEdicion) {
      this.validacion.productoId.error = true;
      this.validacion.productoId.mensaje = "El campo Producto es obligatorio.";
      todoBien = false;
    }

    const descuento = parseFloat(
      this.formGroupProductosDescuentosExclusivos.get("descuento").value
    );

    if (
      isNaN(descuento) ||
      (descuento < DESCUENTO_MINIMO && descuento <= DESCUENTO_MAXIMO)
    ) {
      this.validacion.descuento.error = true;
      this.validacion.descuento.mensaje =
        "El descuento es inválido, tiene que estar entre 1 y 99.99.";
      todoBien = false;
    } else {
      this.validacion.descuento.error = false;
    }

    if (!todoBien && this.formGroupProductosDescuentosExclusivos.valid) {
      notify(
        "Por favor, revise que todos los campos sean correctos.",
        "error",
        3000
      );
    }
    return todoBien;
  }

  limpiar() {
    this.formGroupProductosDescuentosExclusivos.reset();

    this.productosSeleccionadoDataSource = [];
    this._productoSeleccionado = "";

    this.esEdicion = false;
    this.botonEditarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.gridProductos.instance.clearFilter();
    this.submit = false;
  }

  async agregar() {
    this.submit = true;
    this.botonAgregarDeshabilitado = true;

    if (!(await this.validarFormulario())) {
      this.botonAgregarDeshabilitado = false;
      return;
    }
    Alertas.load();

    const productoDescuentoExclusivo = {
      descuento:
        this.formGroupProductosDescuentosExclusivos.get("descuento").value /
        100,
      productoId: this.formGroupProductosDescuentosExclusivos.get("productoId")
        .value,
    };

    this._administracionProductosDescuentosExclusivosService
      .guardarProductoDescuentoExclusivo(productoDescuentoExclusivo)
      .subscribe(
        (res) => {
          if (res.respuestaTipo === 1) {
            Alertas.error("Error", res.respuesta);
            return;
          }
          this.actualizarGrid(() => {
            this.limpiar();

            Alertas.ok(
              "¡Correcto!",
              "El Producto con descuento exclusivo se ha agregado correctamente."
            );
          });
        },
        (error) => {
          this.procesarError(error);
        }
      );

    console.log(productoDescuentoExclusivo);

    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    Alertas.close();
  }

  obtenerValoresParaActualizar(val) {
    this.limpiar();
    this.productosSeleccionadoDataSource = [
      { identificador: val.productoId, nombre: val.descripcionProducto },
    ];
    this._productoSeleccionado = val.productoId;
    this.esEdicion = true;
    this.productoExclusivoId = val.id;
    this.estadoOriginal = val.activo;
    this.formGroupProductosDescuentosExclusivos
      .get("descuento")
      .setValue(val.descuento);
    this.formGroupProductosDescuentosExclusivos
      .get("fechaInicio")
      .setValue(val.fechaInicio);
    this.formGroupProductosDescuentosExclusivos
      .get("fechaFin")
      .setValue(val.fechaFin);
  }

  async editar() {
    this.submit = true;
    this.botonEditarDeshabilitado = true;

    if (!(await this.validarFormulario())) {
      this.botonEditarDeshabilitado = false;
      return;
    }
    Alertas.load();

    const productoDescuentoExclusivo = {
      id: this.productoExclusivoId,
      descuento:
        this.formGroupProductosDescuentosExclusivos.get("descuento").value /
        100,
      productoId: this.formGroupProductosDescuentosExclusivos.get("productoId")
        .value,
    };

    this._administracionProductosDescuentosExclusivosService
      .actualizarProductoDescuentoExclusivo(productoDescuentoExclusivo)
      .subscribe(
        (res) => {
          this.actualizarGrid(() => {
            this.limpiar();

            Alertas.ok(
              "¡Correcto!",
              "El Producto con descuento exclusivo se ha actualizado exitosamente."
            );
          });
        },
        (error) => {
          this.procesarError(error);
        }
      );

    this.submit = false;
    this.esEdicion = false;
    Alertas.close();
  }

  inactivar(id) {
    Alertas.question(
      "",
      "¿Desea inactivar este producto con descuento exclusivo?"
    ).then(() => {
      Alertas.load();
      this._administracionProductosDescuentosExclusivosService
        .inactivarProductoDescuentoExclusivo(id)
        .subscribe(
          (seInactivo) => {
            if (seInactivo) {
              this.productosDescuentosExclusivos = this.productosDescuentosExclusivos.map(
                (pde) => {
                  if (pde.id === id) {
                    pde.activo = false;
                    return pde;
                  }
                  return pde;
                }
              );
              Alertas.close();
              Alertas.ok(
                "¡Correcto!",
                "El producto con descuento exclusivo se ha inactivado correctamente."
              );
            } else {
              Alertas.error(
                "Error",
                "Hubo un error al inactivar el producto con descuento exclusivo."
              );
            }
          },
          (error) => {
            this.procesarError(error);
          }
        );
    });
  }

  activar(id) {
    Alertas.load();
    this._administracionProductosDescuentosExclusivosService
      .activarProductoDescuentoExclusivo(id)
      .subscribe(
        (seInactivo) => {
          if (seInactivo) {
            this.productosDescuentosExclusivos = this.productosDescuentosExclusivos.map(
              (pde) => {
                if (pde.id === id) {
                  pde.activo = true;
                  return pde;
                }
                return pde;
              }
            );
            Alertas.close();
            Alertas.ok(
              "¡Correcto!",
              "El producto con descuento exclusivo se ha activado correctamente."
            );
          } else {
            Alertas.error(
              "Error",
              "Hubo un error al activar el producto con descuento exclusivo."
            );
          }
        },
        (error) => {
          this.procesarError(error);
        }
      );
  }

  inputExcelChanged() {
    if (this.archivosExcel.length == 0) {
      this.excelProductos = null;
      return;
    }
    this.excelProductos = this.archivosExcel[0];
  }

  onUploadedCsv(e) {
    this.actualizarGrid(() => {
      Alertas.ok("Se han agregado éxitosamente los productos.");
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
  }
}
