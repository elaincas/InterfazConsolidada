import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DxFileUploaderComponent } from "devextreme-angular";
import { environment } from "../../../../../../environments/environment";
import { Alertas } from "../../../../../helpers/notificaciones/notificaciones";
import { ImagenTipo } from "../../../models/imagenTipo";
import { Respuesta, RespuestaTipo } from "../../../helpers/respuestav2";
import { Imagen } from "../../../models/imagen";
import { ActivatedRoute } from "@angular/router";
import { helpers } from "../../../../../helpers/utils";
import { StickerImagenesService } from "../../../services/sticker-imagenes.service";
import { StickerConfiguracionImagen } from "../../../models/stickerImagen";
import { Forms } from "../../../../../helpers/forms";
import { MensajesGenericosStickers } from "../../../helpers/mensajes";
import { LoginService } from "../../../../../login/services/login.service";

@Component({
  selector: "sticker-imagenes",
  templateUrl: "./imagenes.component.html",
  styleUrls: ["./imagenes.component.css"],
})
export class ImagenesComponent implements OnInit {
  @Input()
  stickerConfiguracionImagenes: StickerConfiguracionImagen[];
  @Input() onTabChange: EventEmitter<void>;

  @Output() onImagenSubida: EventEmitter<StickerConfiguracionImagen[]>;

  @ViewChild("dxFile")
  _dxFile: DxFileUploaderComponent;

  urlSubirImagen: string;

  imagenTipo = ImagenTipo;
  modo: Forms.Modo = Forms.Modo.Agregar;
  mensaje = MensajesGenericosStickers;

  submit: boolean;
  subiendoImagenWeb: boolean;
  subiendoImagenMovil: boolean;

  constructor(
    private route: ActivatedRoute,
    private _stickerImagenService: StickerImagenesService,
    private _loginService: LoginService,
  ) {
    const endpointSticker: string = `${environment.stickersApi}/api/StickerImagen`;
    this.urlSubirImagen = `${endpointSticker}/SubirImagen`;
    this.onImagenSubida = new EventEmitter<StickerConfiguracionImagen[]>();
    this.stickerConfiguracionImagenes = <StickerConfiguracionImagen[]>[];
    this.submit = false;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      let stickerId = helpers.convertirAInt(params.stickerId);

      if (stickerId) {
        this.modo = Forms.Modo.Actualizar;
        this.cargarInformacionImagenesSticker(stickerId);
      }
    });

    if (this.onTabChange) {
      this.onTabChange.subscribe(() => {
        this.submit = true;
      });
    }
  }

  cargarInformacionImagenesSticker(stickerId: number) {
    this._stickerImagenService
      .obtenerImagenesDeSticker(stickerId)
      .subscribe((res) => {
        this.stickerConfiguracionImagenes = res.data;
      });
  }

  onUploadStarted(imagenTipo: ImagenTipo) {
    this.subiendoImagenWeb = imagenTipo === ImagenTipo.Web;
    this.subiendoImagenMovil = imagenTipo === ImagenTipo.App;
    this.submit = true;
  }

  onUploaded(e, imagenTipo: ImagenTipo) {
    this.submit = false;
    const respuesta: Respuesta<Imagen> = JSON.parse(e.request.response);

    if (respuesta.respuestaTipo !== RespuestaTipo.Ok) {
      Alertas.errorEnServidor("Error", respuesta.mensaje);
      this._dxFile.instance.reset();
      return;
    }

    switch (imagenTipo) {
      case ImagenTipo.App:
        this.subiendoImagenMovil = false;

        if (this.modo === Forms.Modo.Agregar) {
          this.stickerConfiguracionImagenes =
            this.stickerConfiguracionImagenes.filter((x) => !x.esMovil);

          this.agregarImagen(respuesta, true);

        } else {
          let hayAlgunaImagenTipoMovil: boolean = this.stickerConfiguracionImagenes.some(x => x.esMovil);

          if (!hayAlgunaImagenTipoMovil) {
            this.agregarImagen(respuesta, true);
          } else {
            this.stickerConfiguracionImagenes.map(x => {
              if (x.esMovil) {
                x.rutaUrl = respuesta.data.src;
                x.usuarioModificaId = this.obtenerUsuarioId();
                x.fueEditado = true;
              }
            })
          }
        }
        break;

      case ImagenTipo.Web:
        this.subiendoImagenWeb = false;
        if (this.modo === Forms.Modo.Agregar) {
          this.stickerConfiguracionImagenes =
            this.stickerConfiguracionImagenes.filter((x) => x.esMovil);

          this.agregarImagen(respuesta, false);
        } else {
          this.stickerConfiguracionImagenes.map(x => {
            if (!x.esMovil) {
              x.rutaUrl = respuesta.data.src;
              x.usuarioModificaId = this.obtenerUsuarioId();
              x.fueEditado = true;
            }
          });
        }
        break;

      default:
        break;
    }

    this.onImagenSubida.emit(this.stickerConfiguracionImagenes);

    Alertas.ok("La imagen se ha subido éxitosamente.");
  }

  private obtenerUsuarioId(): number {
    return helpers.obtenerUsusarioIdInt(this._loginService.Usuario.id);
  }

  private agregarImagen(respuesta: Respuesta<Imagen>, esMovil: boolean) {
    this.stickerConfiguracionImagenes.push(<StickerConfiguracionImagen>{
      activo: true,
      rutaUrl: respuesta.data.src,
      esMovil: esMovil,
      usuarioAgregaId: this.obtenerUsuarioId()
    });
  }

  get imagenDesktop(): StickerConfiguracionImagen {
    if (this.stickerConfiguracionImagenes)
      return this.stickerConfiguracionImagenes.find((x) => !x.esMovil);
    else return null;
  }

  get imagenMobile(): StickerConfiguracionImagen {
    if (this.stickerConfiguracionImagenes)
      return this.stickerConfiguracionImagenes.find((x) => x.esMovil);
    else return null;
  }

  onUploadedError(e) {
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
}
