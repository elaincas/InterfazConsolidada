import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Forms } from "../../../../helpers/forms";
import {
  Alertas,
  Notificaciones,
} from "../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../helpers/utils";
import { LoginService } from "../../../../login/services/login.service";
import { Lookup } from "../../../../productos/informacion-productos/models/lookup.model";
import { MensajesGenericosStickers } from "../../helpers/mensajes";
import { RespuestaTipo } from "../../helpers/respuestav2";
import { StickerConfiguracionProductoPremio } from "../../models/productosPremios.model";
import { PremiosService } from "../../services/premios.service";
import { ProductoStickerService } from "../../services/producto-sticker.service";
import { StickerPremiosService } from "../../services/sticker-premios.service";
import { StickersService } from "../../services/stickers.service";

@Component({
  selector: "sticker-premios",
  templateUrl: "./sticker-premios.component.html",
  styleUrls: ["./sticker-premios.component.css"],
})
export class StickerPremiosComponent implements OnInit {
  @Output()
  onComplete: EventEmitter<StickerConfiguracionProductoPremio>;

  @ViewChild("sticker") _sticker: any;

  @ViewChild("productoAGanar") _productoAGanar: any;

  formDataStickerConfiguracionProductoPremio: StickerConfiguracionProductoPremio;
  stickerConfiguracionProductoPremios: StickerConfiguracionProductoPremio[];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mensaje = MensajesGenericosStickers;
  formsModo = Forms;
  productosPremios: Lookup[];
  configuracionProductoPremio: StickerConfiguracionProductoPremio;
  stickerConfiguracionProductos: Lookup[];
  stickersLookup: Lookup[];

  mensajeLoader: string;

  cargandoVisible: boolean;
  readOnlyAgregar: boolean;
  botonAgregarDeshabilitado: boolean;
  botonEditarDeshabilitado: boolean;
  submit: boolean;

  constructor(
    private _premiosService: PremiosService,
    private _loginService: LoginService,
    private _stickersService: StickersService,
    private _stickerPremiosService: StickerPremiosService,
    private _productoStickerService: ProductoStickerService
  ) {
    this.stickerConfiguracionProductoPremios = <
      StickerConfiguracionProductoPremio[]
    >[];

    this.configuracionProductoPremio = <StickerConfiguracionProductoPremio>{};

    this._premiosService.obtenerLookup().subscribe((res) => {
      this.productosPremios = res.data;
    });

    this.configurarFormulario();
    this.cargandoVisible = true;
    this.mensajeLoader = helpers.cargando;
    this.botonEditarDeshabilitado = false;
    this.stickersLookup = <Lookup[]>[];
    this.stickerConfiguracionProductos = <Lookup[]>[];
  }

  ngOnInit() {
    setTimeout(() => {
      this.cargandoVisible = false;
    }, 500);

    this.obtenerData();
  }

  obtenerData() {
    this._stickersService.obtenerLookup().subscribe((res) => {
      this.stickersLookup = res.data;
    });

    this._stickerPremiosService
      .obtenerTodosLosStickersProductos()
      .subscribe((res) => {
        this.stickerConfiguracionProductoPremios = res.data;
      });
  }

  configurarFormulario() {
    this.formDataStickerConfiguracionProductoPremio = <
      StickerConfiguracionProductoPremio
    >{
      activo: true,
      fechaAgrega: null,
      stickerProductoPremioId: helpers.VALOR_POR_DEFECTO_ID,
      id: helpers.VALOR_POR_DEFECTO_ID,
      stickerConfiguracionId: helpers.VALOR_POR_DEFECTO_ID,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._stickerPremiosService.obtenerTodosLosStickersProductos().subscribe({
      next: (respuesta) => {
        Alertas.close();
        this.stickerConfiguracionProductoPremios = respuesta.data;
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

  private obtenerUsuarioId(): number {
    return helpers.obtenerUsusarioIdInt(this._loginService.Usuario.id);
  }

  onFieldDataChange(e) {}

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._stickerPremiosService
        .inactivar(id, this.obtenerUsuarioId())
        .subscribe(
          (respuesta) => {
            if (respuesta.data) {
              this.stickerConfiguracionProductoPremios =
                this.stickerConfiguracionProductoPremios.map((registro) => {
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

  obtenerValoresParaActualizar(data: StickerConfiguracionProductoPremio) {
    this.formDataStickerConfiguracionProductoPremio = {
      ...data,
    };
    this.modo = Forms.Modo.Actualizar;
  }

  activar(id: number) {
    Alertas.load();
    this._stickerPremiosService.activar(id, this.obtenerUsuarioId()).subscribe(
      (respuesta) => {
        if (respuesta.data) {
          this.stickerConfiguracionProductoPremios =
            this.stickerConfiguracionProductoPremios.map((registro) => {
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

  agregar(e) {
    console.log(this.formDataStickerConfiguracionProductoPremio);

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

    this.configuracionProductoPremio = {
      ...this.formDataStickerConfiguracionProductoPremio,
    };

    this._stickerPremiosService
      .guardar(this.configuracionProductoPremio)
      .subscribe(
        (res) => {
          console.log(res);

          if (res.respuestaTipo !== RespuestaTipo.Ok) {
            Alertas.error("Error", res.mensaje);
            return;
          }
          this.actualizarGrid(() => {
            this.limpiar();

            Alertas.ok(
              "¡Correcto!",
              "Los datos se han agregado correctamente."
            );
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

  editar(e) {
    console.log(this.formDataStickerConfiguracionProductoPremio);

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

    this.configuracionProductoPremio = {
      ...this.formDataStickerConfiguracionProductoPremio,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    this._stickerPremiosService
      .editar(this.configuracionProductoPremio)
      .subscribe(
        (res) => {
          console.log(res);

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

  limpiar() {
    this.configurarFormulario();
    this.modo = Forms.Modo.Agregar;

    setTimeout(() => {
      this._sticker.instance.resetValues();
      this._productoAGanar.instance.resetValues();
    }, 0);
  }
}
