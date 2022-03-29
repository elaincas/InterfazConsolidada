import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DxFileUploaderComponent } from "devextreme-angular";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { LoginService } from "../../../../login/services/login.service";
import { Sucursal } from "../../../../productos/administracion-descuentos-sucursal/models/sucursal.model";
import { DescuentosSucursalService } from "../../../../productos/administracion-descuentos-sucursal/services/descuentos-sucursal.service";
import { AccionPopupEnum } from "../../enums/accionPopup.enum";
import { SucursalSello } from "../../models/sucursal-sello.model";
import { SucursalesSellosService } from "../../services/sucursales-sellos.service";

@Component({
  selector: "app-sucursales-sellos-popup",
  templateUrl: "./sucursales-sellos-popup.component.html",
  styleUrls: ["./sucursales-sellos-popup.component.css"],
})
export class SucursalesSellosPopupComponent implements OnInit {
  public sucursales: Sucursal[] = [];

  @Input() sucursalSello: SucursalSello;
  @Input() esPopupSucursalSelloVisible: boolean;
  @Input() accionPopup: AccionPopupEnum;
  @Input() esModoEdicion: boolean;
  @Output() onCerrarPopup = new EventEmitter();
  @Output() obtenerSucursalesSellos = new EventEmitter();

  @ViewChild("fuImagenSello") fuImagenSello: DxFileUploaderComponent;

  constructor(
    private sucursalesSellosService: SucursalesSellosService,
    private _descuentosAdicionalesService: DescuentosSucursalService,
    private _loginService: LoginService
  ) {}

  ngOnInit() {
    this.obtenerSucursales();
  }

  onHidingPopup(e): void {
    this.onCerrarPopup.emit();
    this.fuImagenSello.instance.reset();
  }

  obtenerSucursales(): void {
    this._descuentosAdicionalesService.obtenerSucursales().subscribe(
      (data) => {
        this.sucursales = data;
      },
      (error) => {
        Alertas.error(
          "Error",
          "Hubo un error al momento de obtener las sucursales"
        );
      }
    );
  }

  obtenerImagenSeleccionada(e: any) {
    if (e.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.sucursalSello.rutaImagenSello = event.target.result;
        this.sucursalSello.archivoImagen = e.value;
        this.obtenerDimensionesImagenSeleccionada();
      };
      reader.readAsDataURL(e.value[0]);
    }
  }

  obtenerDimensionesImagenSeleccionada(): void {
    const img = new Image();
    img.onload = () => {
      // console.log(img.width);
      // console.log(img.height);
    };
    img.src = this.sucursalSello.rutaImagenSello;
  }

  guardarSucursalSello(): void {
    if (this.accionPopup == AccionPopupEnum.agregar) {
      this.agregarSucursalSello();
    } else {
      this.editarSucursalSello();
    }
  }

  agregarSucursalSello(): void {
    Alertas.load();
    this.sucursalSello.usuarioAgrega = this._loginService.Usuario.id;
    this.sucursalesSellosService
      .GuardarSelloSucursal(this.sucursalSello)
      .subscribe(
        (data) => {
          this.obtenerSucursalesSellos.emit();
          Alertas.ok(
            "Datos Guardados",
            "Los datos se han guardado satisfactoriamente."
          );
          this.esPopupSucursalSelloVisible = false;
        },
        (error) => {
          Alertas.error(
            "Error",
            "Ocurrio un error al momento de guardar el sello."
          );
        }
      );
  }

  editarSucursalSello(): void {
    Alertas.load();

    this.sucursalSello.usuarioModifica = this._loginService.Usuario.id;

    if (this.sucursalSello.archivoImagen == null) {
      this.sucursalSello.archivoImagen = [];
    }

    this.sucursalesSellosService
      .EditarSucursalSello(this.sucursalSello)
      .subscribe(
        (data) => {
          this.obtenerSucursalesSellos.emit();
          Alertas.ok(
            "Datos Guardados",
            "Los datos se han guardado satisfactoriamente."
          );
          this.esPopupSucursalSelloVisible = false;
        },
        (error) => {
          Alertas.error(
            "Error",
            "Ocurrio un error al momento de guardar el sello."
          );
        }
      );
  }

  esFormularioValido(): boolean {
    if (this.sucursalSello.codigoSucursal == null) {
      Alertas.warning("Advertencia", "Debe ingresar una sucursal.");
      return false;
    }

    if (this.accionPopup == AccionPopupEnum.agregar) {
      if (this.sucursalSello.archivoImagen == null) {
        Alertas.warning("Advertencia", "Debe seleccionar una imagen.");
        return false;
      }
    }

    if (this.sucursalSello.archivoImagen) {
      const type = this.sucursalSello.archivoImagen[0].type;
      const formato = type
        .substring(type.indexOf("/") + 1, type.length)
        .toUpperCase();
      if (formato != "PNG" && formato != "JPG" && formato != "JPEG") {
        Alertas.warning(
          "Advertencia",
          "La imagen debe estar en los siguientes formatos: png, jpg o jpeg."
        );
        return false;
      }
    }

    return true;
  }

  obtenerCantidadSellosPorSucursalCodigo(): void {
    this.sucursalesSellosService
      .obtenerCantidadSellosPorSucursalCodigo(this.sucursalSello.codigoSucursal)
      .subscribe(
        (data) => {
          if (data == 1 && this.accionPopup == AccionPopupEnum.agregar) {
            Alertas.warning(
              "Advertencia",
              "La sucursal seleccionada ya cuenta con sello registrado."
            );
          } else if (
            data == 0 ||
            this.accionPopup == AccionPopupEnum.modificar
          ) {
            this.guardarSucursalSello();
          }
        },
        (error) => {
          Alertas.error(
            "Error",
            "No se pudo verificar si la sucursal cuenta con sello registrado. Intente de nuevo."
          );
        }
      );
  }

  onClickGuardarSucursalSello(): void {
    if (this.esFormularioValido()) {
      this.obtenerCantidadSellosPorSucursalCodigo();
    }
  }
}
