import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { AccionPopupEnum } from "../../enums/accionPopup.enum";
import { SucursalSello } from "../../models/sucursal-sello.model";
import { SucursalesSellosService } from "../../services/sucursales-sellos.service";

@Component({
  selector: "app-administracion-sucursales-sellos",
  templateUrl: "./administracion-sucursales-sellos.component.html",
  styleUrls: ["./administracion-sucursales-sellos.component.css"],
})
export class AdministracionSucursalesSellosComponent implements OnInit {
  public esPopupSucursalSelloVisible: boolean = false;
  public accionPopup: AccionPopupEnum;
  public sucursalSelloPopup: SucursalSello;
  public esModoEdicion: boolean = false;

  public sucursalesSellos: SucursalSello[] = [];

  constructor(private _sucursalesSellosService: SucursalesSellosService) {}

  ngOnInit() {
    this.obtenerSucursalesSellos();
  }

  agregarSelloSucursal(): void {
    this.esPopupSucursalSelloVisible = !this.esPopupSucursalSelloVisible;
    this.accionPopup = AccionPopupEnum.agregar;
    this.sucursalSelloPopup = {};
  }

  mostrarPopupConsulta(sucursalSello: SucursalSello): void {
    sucursalSello.rutaImagenSello = `${sucursalSello.rutaImagenSello}?${
      Math.floor(Math.random() * 100) + 1
    }`;
    this.sucursalSelloPopup = sucursalSello;
    this.esPopupSucursalSelloVisible = !this.esPopupSucursalSelloVisible;
    this.accionPopup = AccionPopupEnum.modificar;
    this.esModoEdicion = true;
  }

  onCerrarPopup(): void {
    this.esPopupSucursalSelloVisible = !this.esPopupSucursalSelloVisible;
    this.esModoEdicion = false;
    this.sucursalSelloPopup = {};
  }

  obtenerSucursalesSellos(): void {
    this._sucursalesSellosService.ObtenerSucursalesSellos().subscribe(
      (data) => {
        this.sucursalesSellos = data;
      },
      (error) => {
        Alertas.error(
          "Error",
          "Ocurrio un error al momento de obtener los sellos de las sucursales."
        );
      }
    );
  }

  abrirImagenNuevaVentana(enlace: string): void {
    window.open(enlace);
  }
}
