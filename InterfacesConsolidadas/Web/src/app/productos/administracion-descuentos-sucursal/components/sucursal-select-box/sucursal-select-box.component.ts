import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { Sucursal } from "../../models/sucursal.model";
import { DescuentosSucursalService } from "../../services/descuentos-sucursal.service";

@Component({
  selector: "app-sucursal-select-box",
  templateUrl: "./sucursal-select-box.component.html",
  styleUrls: ["./sucursal-select-box.component.css"],
})
export class SucursalSelectBoxComponent implements OnInit {
  public sucursales: Sucursal[] = [];

  @Output() obtenerCodigoSucursal = new EventEmitter<number>();

  constructor(private descuentosSucursalService: DescuentosSucursalService) {}

  ngOnInit() {
    this.obtenerSucursales();
  }

  obtenerSucursales(): void {
    this.descuentosSucursalService.obtenerSucursales().subscribe(
      (data) => {
        this.sucursales = data;
      },
      (error) => {
        Alertas.error(
          "Error",
          "No se pudo obtener el listado de sucursales."
        );
      }
    );
  }

  alSeleccionarSucursal(e): void {
    this.obtenerCodigoSucursal.emit(e.value);
  }
}
