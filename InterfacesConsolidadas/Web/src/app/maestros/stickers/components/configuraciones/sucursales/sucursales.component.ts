import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MaestrosServices } from "../../../../../entrenamiento/reembolsos/services/maestros/maestrosServices.service";
import { Forms } from "../../../../../helpers/forms";
import {
  Alertas,
  Notificaciones,
} from "../../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../../helpers/utils";
import { LoginService } from "../../../../../login/services/login.service";
import { MensajesGenericosStickers } from "../../../helpers/mensajes";
import { RespuestaTipo } from "../../../helpers/respuestav2";
import { StickerConfiguracionSucursal } from "../../../models/stickerSucursal.model";
import { StickerSucursalService } from "../../../services/sticker-sucursal.service";

@Component({
  selector: "stickers-sucursales",
  templateUrl: "./sucursales.component.html",
  styleUrls: ["./sucursales.component.css"],
})
export class SucursalesComponent implements OnInit {
  formDataStickerSucursal: StickerConfiguracionSucursal;
  mensaje = MensajesGenericosStickers;
  modo: Forms.Modo = Forms.Modo.Agregar;
  formsModo = Forms;

  @Input() onSucursalesReady: EventEmitter<void>;

  @Input()
  listadoSucursales: any[];

  @Input()
  stickerConfiguracionSucursales: StickerConfiguracionSucursal[];

  @Input() nombreSticker: string;

  readOnlyAgregar: boolean;
  botonAgregarDeshabilitado: boolean;
  submit: boolean;

  @ViewChild("sucursalDdl") _ddlSucursal: any;

  @Input() stickerId: number;
  @Output() onListadoStickerConfiguracionSucursalesChange: EventEmitter<
    StickerConfiguracionSucursal[]
  >;

  constructor(
    private _loginService: LoginService,
    private _maestrosServices: MaestrosServices,
    private _stickerSucursalService: StickerSucursalService
  ) {
    this.configurarFormulario();
    this.stickerConfiguracionSucursales = <StickerConfiguracionSucursal[]>[];
    this.readOnlyAgregar = false;
    this.onListadoStickerConfiguracionSucursalesChange = new EventEmitter<
      StickerConfiguracionSucursal[]
    >();
  }
  ngOnInit() {
    if (this.onSucursalesReady) {
      this.onSucursalesReady.subscribe(() => {
        this.renderizarSucursales();
      });
    }
  }

  configurarFormulario() {
    this.formDataStickerSucursal = <StickerConfiguracionSucursal>{
      id: helpers.VALOR_POR_DEFECTO_ID,
      activo: true,
      fechaAgrega: null,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
      stickerConfiguracionId: helpers.VALOR_POR_DEFECTO_ID,
      sucursalId: helpers.VALOR_POR_DEFECTO_ID,
    };
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._stickerSucursalService
      .obtenerStickersSucursalesPorStickerId(this.stickerId)
      .subscribe({
        next: (respuesta) => {
          Alertas.close();
          this.stickerConfiguracionSucursales = respuesta.data;
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

    if (!this.formDataStickerSucursal.id) {
      this.stickerConfiguracionSucursales.push({
        ...this.formDataStickerSucursal,
      });
      this.renderizarSucursales();
      this.limpiar();
      this.onListadoStickerConfiguracionSucursalesChange.emit(
        this.stickerConfiguracionSucursales
      );
      return;
    } else {
      Alertas.load();
    }

    this._stickerSucursalService
      .guardar(this.formDataStickerSucursal)
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

  limpiar() {
    this.configurarFormulario();
    setTimeout(() => {
      this._ddlSucursal.instance.resetValues();
    }, 10);
  }

  private obtenerUsuarioId(): number {
    return helpers.obtenerUsusarioIdInt(this._loginService.Usuario.id);
  }

  private renderizarSucursales() {
    if (this.listadoSucursales)
      this.listadoSucursales.forEach((item) => {
        let id: number = -1;
        let haceMatch = this.stickerConfiguracionSucursales.some((x) => {
          id++;
          return x.sucursalId === item.codigo;
        });

        if (haceMatch) {
          this.stickerConfiguracionSucursales[id].sucursalNombre =
            item.nombrePublico;
        }
      });
  }

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._stickerSucursalService
        .inactivar(id, this.obtenerUsuarioId())
        .subscribe(
          (respuesta) => {
            if (respuesta.data) {
              this.stickerConfiguracionSucursales =
                this.stickerConfiguracionSucursales.map((registro) => {
                  if (registro.id === id) {
                    registro.activo = false;
                    return registro;
                  }
                  return registro;
                });
              Alertas.close();
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
    this._stickerSucursalService.activar(id, this.obtenerUsuarioId()).subscribe(
      (respuesta) => {
        if (respuesta.data) {
          this.stickerConfiguracionSucursales =
            this.stickerConfiguracionSucursales.map((registro) => {
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
