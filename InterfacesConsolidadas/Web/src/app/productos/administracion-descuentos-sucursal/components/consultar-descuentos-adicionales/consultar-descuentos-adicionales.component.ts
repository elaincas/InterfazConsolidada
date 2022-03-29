import { Component, OnInit } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { ProductoDescuentoSucursal } from "../../models/producto-descuento-sucursal.model";
import { DescuentosSucursalService } from "../../services/descuentos-sucursal.service";

@Component({
  selector: "app-consultar-descuentos-adicionales",
  templateUrl: "./consultar-descuentos-adicionales.component.html",
  styleUrls: ["./consultar-descuentos-adicionales.component.css"],
})
export class ConsultarDescuentosAdicionalesComponent implements OnInit {
  public productosDescuentosSucursal: ProductoDescuentoSucursal[] = [];
  public productoDescuentoSucursalPorProductoId: ProductoDescuentoSucursal;
  public fechaDesde: Date;
  public fechaHasta: Date;
  public esPopupModificarDescuentosVisible: boolean = false;
  public codigoSucursal: number;

  constructor(private descuentosSucursalService: DescuentosSucursalService) {}

  ngOnInit() {}

  obtenerCodigoSucursal(codigoSucursal: number): void {
    this.codigoSucursal = codigoSucursal;
  }

  obtenerProductosDescuentosSucursalPorFechas(): void {
    this.productosDescuentosSucursal = [];
    if (this.esFormularioValido()) {
      Alertas.load();
      this.descuentosSucursalService
        .obtenerProductosDescuentosSucursalPorFechas(
          this.codigoSucursal,
          this.fechaDesde,
          this.fechaHasta
        )
        .subscribe(
          (data) => {
            Alertas.close();
            this.productosDescuentosSucursal = data;
          },
          (error) => {
            Alertas.error(
              "Error",
              "No se pudo obtener el listado de descuentos adicionales de esta sucursal."
            );
          }
        );
    }
  }

  consultarProductoDescuentoSucursalPorProductoId(
    productoDescuentoSucursal: ProductoDescuentoSucursal
  ): void {
    this.esPopupModificarDescuentosVisible =
      !this.esPopupModificarDescuentosVisible;
    this.productoDescuentoSucursalPorProductoId = productoDescuentoSucursal;
  }

  onCerrarModal(): void {
    this.esPopupModificarDescuentosVisible = false;
  }

  esFormularioValido(): boolean {
    if (this.codigoSucursal == null) {
      Alertas.warning("Advertencia", "Debe seleccionar una sucursal.");
      return false;
    }

    if (this.fechaDesde == null || this.fechaHasta == null) {
      Alertas.warning("Advertencia", "Debe ingresar ambas fechas.");
      return false;
    }

    if (this.fechaDesde > this.fechaHasta) {
      Alertas.warning(
        "Advertencia",
        "La fecha inicial no puede ser mayor a la fecha final."
      );
      return false;
    }
    return true;
  }
}
