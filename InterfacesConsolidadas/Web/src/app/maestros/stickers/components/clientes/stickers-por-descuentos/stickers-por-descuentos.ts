import { Component, OnInit, ViewChild } from "@angular/core";
import { Forms } from "../../../../../helpers/forms";
import {
  Alertas,
  Notificaciones,
} from "../../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../../helpers/utils";
import { LoginService } from "../../../../../login/services/login.service";
import { MensajesGenericosStickers } from "../../../helpers/mensajes";
import { RespuestaTipo } from "../../../helpers/respuestav2";
import { StickerPorDescuento } from "../../../models/stickersPorDescuento.model";
import { StickersPorDescuentosService } from "../../../services/sticker-por-descuento.service";

@Component({
  selector: "app-canjes-tipos",
  templateUrl: "./stickers-por-descuento.html",
  styleUrls: ["./stickers-por-descuentos.css"],
})
export class StickersPorDescuentosComponent implements OnInit {
  @ViewChild("descripcion") _descripcion: any;
  @ViewChild("codigo") _codigo: any;
  @ViewChild("descuento") _descuento: any;
  @ViewChild("cantidadRequerida") _cantidadRequerida: any;

  mensajeLoader: string;

  formDataCanjesTipos: StickerPorDescuento;
  canjesTipos: StickerPorDescuento[];


  mensaje = MensajesGenericosStickers;
  modo: Forms.Modo = Forms.Modo.Agregar;
  formsModo = Forms;

  readOnlyAgregar: boolean;
  cargandoVisible: boolean;
  submit: boolean;
  botonAgregarDeshabilitado: boolean;
  esEdicion: boolean;
  botonEditarDeshabilitado: boolean;

  constructor(
    private _loginService: LoginService,
    private _canjesTiposService: StickersPorDescuentosService
  ) {
    this.configurarFormulario();
    this.cargandoVisible = true;
    this.mensajeLoader = helpers.cargando;
    this.botonEditarDeshabilitado = false;
  }

  ngOnInit() {
    this.actualizarGrid();
  }

  mostrarLoader(): void {
    this.cargandoVisible = true;
  }

  ocultarLoader(): void {
    setTimeout(() => {
      this.cargandoVisible = false;
    }, 1);
  }

  private obtenerUsuarioId(): number {
    return helpers.obtenerUsusarioIdInt(this._loginService.Usuario.id);
  }

  configurarFormulario() {
    this.formDataCanjesTipos = <StickerPorDescuento>{
      activo: true,
      fechaAgrega: null,
      id: helpers.VALOR_POR_DEFECTO_ID,
      codigo: "",
      descripcion: "",
      descuento: null,
      stickersCantidad: 0,
      usuarioAgregaId: this.obtenerUsuarioId(),
    };
  }

  agregar(e) {
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

    Alertas.load();

    this._canjesTiposService.guardar(this.formDataCanjesTipos).subscribe(
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

  limpiar() {
    this.configurarFormulario();
    this._descripcion.instance.resetValues();
    this._codigo.instance.resetValues();
    this._descuento.instance.resetValues();
    this._cantidadRequerida.instance.resetValues();
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._canjesTiposService.obtenerStickerClientesCanjesTipos().subscribe({
      next: (respuesta) => {
        Alertas.close();
        this.canjesTipos = respuesta.data;
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

  editar(e) {
    this.submit = true;
    this.botonEditarDeshabilitado = true;

    if (e.validationGroup != undefined) {
      const res = e.validationGroup.validate();
      if (!res.isValid) {
        Notificaciones.error(this.mensaje.datosIncompletos);
        return;
      }
    } else {
      return;
    }

    Alertas.load();

    let dto = {
      ...this.formDataCanjesTipos,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    this._canjesTiposService.editar(dto).subscribe(
      (res) => {
        if (res.respuestaTipo !== RespuestaTipo.Ok) {
          Alertas.error("Error", res.mensaje);
          return;
        }
        this.actualizarGrid(() => {
          this.limpiar();
          this.botonEditarDeshabilitado = false;

          Alertas.ok(
            "¡Correcto!",
            "Los datos se han actualizado exitosamente."
          );
        });
      },
      (error) => {
        helpers.procesarError(error);
      }
    );

    this.submit = false;
    this.botonEditarDeshabilitado = false;
    Alertas.close();
  }

  obtenerDataEditar(data: StickerPorDescuento) {
    this.formDataCanjesTipos = { ...data };
    this.modo = Forms.Modo.Actualizar;
  }

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._canjesTiposService.inactivar(id, this.obtenerUsuarioId()).subscribe(
        (respuesta) => {
          if (respuesta.data) {
            this.canjesTipos = this.canjesTipos.map((registro) => {
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

  activar(id: number) {
    Alertas.load();

    this._canjesTiposService.activar(id, this.obtenerUsuarioId()).subscribe(
      (respuesta) => {
        if (respuesta.data) {
          this.canjesTipos = this.canjesTipos.map((registro) => {
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
}
