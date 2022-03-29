import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { Forms } from "../../../../../helpers/forms";
import {
  Alertas,
  Notificaciones,
} from "../../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../../helpers/utils";
import { LoginService } from "../../../../../login/services/login.service";
import { ProductLookup } from "../../../../../productos/product-lookup/models/product-lookup.model";
import { ProductoService } from "../../../../../productos/producto.service";
import { MensajesGenericosStickers } from "../../../helpers/mensajes";
import { StickerConfiguracionProducto } from "../../../models/stickerConfiguracionProducto.model";
import { ProductoStickerService } from "../../../services/producto-sticker.service";

@Component({
  selector: "productos-stickers",
  templateUrl: "./productos-stickers.component.html",
  styleUrls: ["./productos-stickers.component.css"],
})
export class ProductosStickersComponent implements OnInit {
  @Output() onProductosStickerChange: EventEmitter<
    StickerConfiguracionProducto[]
  >;

  @Input()
  productosStickers: StickerConfiguracionProducto[];

  @Input() nombreSticker: string;

  @ViewChild("cantidadRegala") _cantidadRegala: any;
  @ViewChild("cantidadRequerida") _cantidadRequerida: any;
  @ViewChild("productosStickersDataGrid") grid: DxDataGridComponent;

  formDataStickersProductos: StickerConfiguracionProducto;
  producto: ProductLookup;
  modo: Forms.Modo = Forms.Modo.Agregar;
  mensaje = MensajesGenericosStickers;
  lookupProductosEditTemp: ProductLookup[];
  formsModo = Forms;
  productoSeleccionado: any;

  productoSeleccionadoId: string;
  productoIdAnterior: string;
  productoSeleccionadoDescripcion: string;

  elProductoEsReadonly: boolean;
  botonEditarDeshabilitado: boolean;
  readOnlyAgregar: boolean;
  productoValido: boolean;
  mostrarMensajeProductoValido: boolean;
  botonAgregarDeshabilitado: boolean;
  submit: boolean;
  esEdicion: boolean;
  limpiando: boolean;

  constructor(
    private _loginService: LoginService,
    private _productoService: ProductoService,
    private _productoStickerService: ProductoStickerService
  ) {
    this.productoValido = true;
    this.readOnlyAgregar = false;
    this.submit = false;
    this.esEdicion = false;
    this.botonAgregarDeshabilitado = false;
    this.modo = this.formsModo.Modo.Agregar;
    this.producto = this.productoVacio();
    this.elProductoEsReadonly = false;
    this.configurarFormulario();
    this.productosStickers = <StickerConfiguracionProducto[]>[];
    this.onProductosStickerChange = new EventEmitter<
      StickerConfiguracionProducto[]
    >();
    this.limpiando = false;
  }

  ngOnInit() {
    setTimeout(() => {
      $("#lookupProductos").hover((x) => {
        this.mostrarMensajeProductoValido = x.type == "mouseenter";
      });
    }, 500);
  }

  configurarFormulario() {
    this.formDataStickersProductos = <StickerConfiguracionProducto>{
      activo: true,
      fechaAgrega: null,
      cantidadNecesaria: null,
      cantidadRegala: null,
      stickerConfiguracionId: helpers.VALOR_POR_DEFECTO_ID,

      productoId: null,
      usuarioAgregaId: this.obtenerUsuarioId(),
    };
  }

  private obtenerUsuarioId(): number {
    return helpers.obtenerUsusarioIdInt(this._loginService.Usuario.id);
  }

  productoVacio(): ProductLookup {
    return { producto: "", productoId: "" };
  }

  onProductoSeleccionado(producto: any) {
    this.productoSeleccionado = this.productoVacio();
    this.productoSeleccionadoId = "";
    this.formDataStickersProductos.productoId = "";

    if (producto) {
      if (producto.productoId) {
        this.productoSeleccionado = producto;
        this.productoSeleccionadoId = producto.productoId;
        this.formDataStickersProductos.productoId = this.productoSeleccionadoId;
        this.validarProductoSeleccionado();
      }

      if (producto.producto) {
        this.productoSeleccionadoDescripcion = producto.producto;
      }
    }
  }

  validarProductoSeleccionado = () => {
    if (this.limpiando) {
      this.productoValido = true;
      return true;
    }

    if (!this.formDataStickersProductos) {
      this.productoValido = false;
      return false;
    }

    if (!this.formDataStickersProductos.productoId) {
      this.productoValido = false;
      return false;
    }
    const LENGTH_PRODUCTO = 9;
    if (this.formDataStickersProductos.productoId.length !== LENGTH_PRODUCTO) {
      this.productoValido = false;
      return false;
    }

    this.productoValido = true;
    return true;
  };

  onProductoLimpiado(e) {
    if (this.modo !== Forms.Modo.Actualizar) {
      this.formDataStickersProductos.productoId = "";
    }
  }

  agregar(e) {
    this.submit = true;
    this.botonAgregarDeshabilitado = true;

    if (e.validationGroup != undefined) {
      const res = e.validationGroup.validate();
      const resProductoValido = this.validarProductoSeleccionado();
      if (!res.isValid || !resProductoValido) {
        Notificaciones.error(this.mensaje.datosIncompletos);
        return;
      }
    } else {
      return;
    }

    if (!this.formDataStickersProductos.descripcionProducto) {
      this.formDataStickersProductos.descripcionProducto =
        this.productoSeleccionadoDescripcion;
    }

    this.productosStickers.push({ ...this.formDataStickersProductos });

    setTimeout(() => {
      this.limpiar();
      this.onProductosStickerChange.emit(this.productosStickers);
    }, 500);

    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    Alertas.close();
  }

  editar(e) {
    this.submit = true;
    this.botonAgregarDeshabilitado = true;

    if (e.validationGroup != undefined) {
      const res = e.validationGroup.validate();
      if (!res.isValid) {
        Notificaciones.error(this.mensaje.datosIncompletos);
        return;
      }
    } else {
      return;
    }

    this.productosStickers.map((x) => {
      if (x.id === this.formDataStickersProductos.id) {
        x.fueEditado = true;
        x.cantidadNecesaria = this.formDataStickersProductos.cantidadNecesaria;
        x.cantidadRegala = this.formDataStickersProductos.cantidadRegala;
        x.activo = this.formDataStickersProductos.activo;
        x.usuarioModificaId = helpers.obtenerUsusarioIdInt(
          this._loginService.Usuario.id
        );
      }
    });

    this.onProductosStickerChange.emit([...this.productosStickers]);

    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    setTimeout(() => {
      this.limpiar();
    }, 500);
  }

  limpiar() {
    this.limpiando = true;
    setTimeout(() => {
      this.productoSeleccionadoId = "";
      this.producto = this.productoVacio();
      this.elProductoEsReadonly = false;
      this.mostrarMensajeProductoValido = false;
      this.productoValido = true;
      this.submit = false;
      this.mostrarMensajeProductoValido = false;
      this.productoValido = true;
      this.configurarFormulario();
      this._cantidadRegala.instance.resetValues();
      this._cantidadRequerida.instance.resetValues();
      this.formDataStickersProductos.activo = true;
      this.limpiando = false;
    }, 100);
  }

  activar(id: number) {
    Alertas.load();

    this._productoStickerService.activar(id, this.obtenerUsuarioId()).subscribe(
      (respuesta) => {
        if (respuesta.data) {
          this.productosStickers = this.productosStickers.map((registro) => {
            if (registro.id === id) {
              registro.activo = true;
              return registro;
            }
            return registro;
          });

          Alertas.close();

          Alertas.ok("¡Correcto!", "El registro se ha activado correctamente.");
        } else {
          Alertas.error("Error", "Hubo un error al activar el registro.");
        }
      },
      (error) => {
        helpers.procesarError(error);
      }
    );

    this.onProductosStickerChange.emit(this.productosStickers);
  }

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._productoStickerService
        .inactivar(id, this.obtenerUsuarioId())
        .subscribe(
          (respuesta) => {
            if (respuesta.data) {
              this.productosStickers = this.productosStickers.map(
                (registro) => {
                  if (registro.id === id) {
                    registro.activo = false;
                    return registro;
                  }
                  return registro;
                }
              );
              Alertas.close();
              Alertas.ok(
                "¡Correcto!",
                "El registro se ha inactivado correctamente."
              );
            } else {
              Alertas.error("Error", "Hubo un error al inactivar el registro.");
            }
          },
          (error) => {
            helpers.procesarError(error);
          }
        );
    });
    this.onProductosStickerChange.emit(this.productosStickers);
  }

  get productosEdit(): ProductLookup[] {
    if (
      this.formDataStickersProductos.productoId !== this.productoIdAnterior &&
      this.formDataStickersProductos.productoId
    ) {
      this.productoIdAnterior = this.formDataStickersProductos.productoId;
      this._productoService
        .Buscador(this.formDataStickersProductos.productoId)
        .toPromise()
        .then((data) => {
          this.producto = data[0];
          this.lookupProductosEditTemp = data.map(
            (x) =>
              <ProductLookup>{
                producto: x.producto,
                productoId: x.productoId,
              }
          );

          return this.lookupProductosEditTemp;
        });
    }

    return this.lookupProductosEditTemp;
  }

  obtenerValoresParaActualizar(data: StickerConfiguracionProducto) {
    this.formDataStickersProductos = { ...data };
    this.modo = Forms.Modo.Actualizar;
    this.elProductoEsReadonly = true;
    this.productoIdAnterior = "";
  }

  removerRow(fila) {
    this.grid.instance.removeRow(fila.rowIndex);
  }

  verificarCantidadRegala = () => {
    let respuestaValidacion = this.validarProductoSeleccionado();

    if (!this.formDataStickersProductos.cantidadRegala) {
      return false;
    }

    if (this.formDataStickersProductos.cantidadRegala <= 0) {
      return false;
    }

    return respuestaValidacion;
  };

  get tooltipCantidadDeStickersARegalar() {
    let texto: string = `Cantidad de Stickers ${this.nombreSticker} a regalar`;

    if (this.productoSeleccionadoDescripcion) {
      texto += ` por la compra del producto ${this.productoSeleccionadoDescripcion}`;
    }

    return (texto += ".");
  }
}
