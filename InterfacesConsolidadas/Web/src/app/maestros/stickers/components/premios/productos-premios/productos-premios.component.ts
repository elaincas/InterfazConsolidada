import { Component, OnInit } from "@angular/core";
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
import { RespuestaTipo } from "../../../helpers/respuestav2";
import { StickerProductoPremio } from "../../../models/productoPremio.model";
import { PremiosService } from "../../../services/premios.service";

@Component({
  selector: "app-productos-premios",
  templateUrl: "./productos-premios.component.html",
  styleUrls: ["./productos-premios.component.css"],
})
export class ProductosPremiosComponent implements OnInit {
  mensajeLoader: string;
  productoSeleccionadoDescripcion: string;
  productoSeleccionadoId: string;

  productosPremios: StickerProductoPremio[];
  formDataProductosPremios: StickerProductoPremio;
  mensaje = MensajesGenericosStickers;
  productoSeleccionado: any;
  producto: ProductLookup;
  productosEdit: ProductLookup[];
  modo: Forms.Modo = Forms.Modo.Agregar;
  formsModo = Forms;

  cargandoVisible: boolean;
  productoValido: boolean;
  mostrarMensajeProductoValido: boolean;
  readOnlyAgregar: boolean;
  elProductoEsReadonly: boolean;
  submit: boolean;
  botonAgregarDeshabilitado: boolean;
  esEdicion: boolean;
  botonEditarDeshabilitado: boolean;

  constructor(
    private _loginService: LoginService,
    private _productoService: ProductoService,
    private _premiosService: PremiosService
  ) {
    this.mensajeLoader = helpers.cargando;
    this.cargandoVisible = true;
    this.productoValido = true;
    this.readOnlyAgregar = false;
    this.submit = false;
    this.esEdicion = false;
    this.botonAgregarDeshabilitado = false;
    this.producto = this.productoVacio();
    this.productosEdit = <ProductLookup[]>[];
    this.elProductoEsReadonly = false;
    this.configurarFormulario();
  }

  ngOnInit() {
    setTimeout(() => {
      this.cargandoVisible = false;
    }, 500);

    this.obtenerProductosPremios();
  }

  productoVacio(): ProductLookup {
    return { producto: "", productoId: "" };
  }

  configurarFormulario() {
    this.formDataProductosPremios = <StickerProductoPremio>{
      activo: true,
      fechaAgrega: null,
      monto: null,
      productoId: null,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };
  }

  obtenerProductosPremios() {
    this._premiosService.obtenerProductosPremios().subscribe((res) => {
      if (res.ok) {
        this.productosPremios = res.data;
      } else {
        helpers.mostrarMensajeSegunRespuesta(res.respuestaTipo, res.mensaje);
      }
    });
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._premiosService.obtenerProductosPremios().subscribe({
      next: (respuesta) => {
        Alertas.close();
        this.productosPremios = respuesta.data;
      },
      error: (error) => {
        helpers.procesarError(error);
      },
      complete: () => {
        Alertas.close();
        if (onComplete) {
          onComplete();
        }
      },
    });
  }

  obtenerDataEditar(data: StickerProductoPremio) {
    this.formDataProductosPremios = { ...data };
    this.modo = this.formsModo.Modo.Actualizar;

    this.elProductoEsReadonly = true;
    this._productoService.Buscador(data.productoId).subscribe((productos) => {
      this.producto = productos[0];
      this.productosEdit = productos.map(
        (x) => <ProductLookup>{ producto: x.producto, productoId: x.productoId }
      );
    });

    this.producto.productoId = data.productoId;
  }

  async editar(e) {
    this.submit = true;
    this.botonEditarDeshabilitado = true;

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

    Alertas.load();

    const dto: StickerProductoPremio = <StickerProductoPremio>{
      ...this.formDataProductosPremios,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    this._premiosService.editar(dto).subscribe(
      (res) => {
        if (res.respuestaTipo !== RespuestaTipo.Ok) {
          Alertas.error("Error", res.mensaje);
          this.botonEditarDeshabilitado = false;
          return;
        }

        this.actualizarGrid(() => {
          this.limpiar();

          Alertas.ok(
            "¡Correcto!",
            "Los datos se han actualizado exitosamente."
          );
          this.botonEditarDeshabilitado = false;
        });
      },
      (error) => {
        helpers.procesarError(error);
        this.botonEditarDeshabilitado = false;
      }
    );

    this.submit = false;
    this.esEdicion = false;
    Alertas.close();
  }

  limpiar() {
    this.configurarFormulario();
    this.productoSeleccionadoId = "";
    this.producto = this.productoVacio();
    this.productoSeleccionadoDescripcion = "";
    this.productosEdit = [];
    this.elProductoEsReadonly = false;
    this.mostrarMensajeProductoValido = false;
    this.productoValido = true;
    this.modo = Forms.Modo.Agregar;
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

    Alertas.load();

    this._premiosService.guardar(this.formDataProductosPremios).subscribe(
      (res) => {
        if (res.respuestaTipo !== RespuestaTipo.Ok) {
          Alertas.error("Error", res.mensaje);
          return;
        }
        this.actualizarGrid(() => {
          this.limpiar();

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

  mostrarLoader(): void {
    this.cargandoVisible = true;
  }
  activar(id: number) {
    Alertas.load();
    this._premiosService.activar(id).subscribe(
      (respuesta) => {
        if (respuesta.data) {
          this.productosPremios = this.productosPremios.map((registro) => {
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
  }

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._premiosService.inactivar(id).subscribe(
        (respuesta) => {
          if (respuesta.data) {
            this.productosPremios = this.productosPremios.map((registro) => {
              if (registro.id === id) {
                registro.activo = false;
                return registro;
              }
              return registro;
            });
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
  }

  validarProductoSeleccionado = () => {
    if (!this.formDataProductosPremios) {
      this.productoValido = false;
      return false;
    }

    if (!this.formDataProductosPremios.productoId) {
      this.productoValido = false;
      return false;
    }
    const LENGTH_PRODUCTO = 9;
    if (this.formDataProductosPremios.productoId.length !== LENGTH_PRODUCTO) {
      this.productoValido = false;
      return false;
    }

    this.productoValido = true;
    return true;
  };
  onProductoSeleccionado(producto: any) {
    this.productoSeleccionadoDescripcion = "";
    this.productoSeleccionado = this.productoVacio();
    this.productoSeleccionadoId = "";
    this.formDataProductosPremios.productoId = "";

    if (producto && producto.producto) {
      this.productoSeleccionadoDescripcion = producto.producto;
    }

    if (producto && producto.productoId) {
      this.productoSeleccionado = producto;
      this.productoSeleccionadoId = producto.productoId;
      this.formDataProductosPremios.productoId = this.productoSeleccionadoId;
      this.validarProductoSeleccionado();
    }
  }

  ocultarLoader(): void {
    setTimeout(() => {
      this.cargandoVisible = false;
    }, 1);
  }

  onProductoLimpiado(e) {
    this.formDataProductosPremios.productoId = "";
  }
}
