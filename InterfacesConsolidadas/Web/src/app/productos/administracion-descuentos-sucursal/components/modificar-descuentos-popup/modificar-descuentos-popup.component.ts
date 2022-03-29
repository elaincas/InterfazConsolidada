import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { LoginService } from "../../../../login/services/login.service";
import { ProductoDescuentoSucursal } from "../../models/producto-descuento-sucursal.model";
import { DescuentosSucursalService } from "../../services/descuentos-sucursal.service";

@Component({
  selector: "app-modificar-descuentos-popup",
  templateUrl: "./modificar-descuentos-popup.component.html",
  styleUrls: ["./modificar-descuentos-popup.component.css"],
})
export class ModificarDescuentosPopupComponent implements OnInit {
  @Input() esPopupModificarDescuentosVisible: boolean;
  @Input() productoDescuentoSucursal: ProductoDescuentoSucursal;
  @Input() codigoSucursal: number;
  @Output() cerrarModal = new EventEmitter();

  constructor(
    private descuentoSucursalService: DescuentosSucursalService,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  onCerrarModal(e): void {
    this.cerrarModal.emit();
  }

  modificarProductoDescuentoSucursal(e) {
    if (this.esFormularioValido(e)) {
      Alertas.load();
      this.descuentoSucursalService
        .modificarProductoDescuentoSucursal(
          this.codigoSucursal,
          this.productoDescuentoSucursal,
          this.loginService.Usuario.id
        )
        .subscribe(
          (data) => {
            this.esPopupModificarDescuentosVisible = false;
            Alertas.ok(
              "Datos Guardados",
              "Los datos se han guardado satisfactoriamente."
            );
          },
          (error) => {
            Alertas.error("Error", "No se pudieron guardar los datos");
          }
        );
    }
  }

  esFormularioValido(e): boolean {
    const res = e.validationGroup.validate();
    if (!res.isValid) {
      return false;
    }

    if (
      this.productoDescuentoSucursal.desde >
      this.productoDescuentoSucursal.hasta
    ) {
      Alertas.warning("Advertencia", "La fecha inicial no puede ser mayor a la fecha final.")
      return false;
    }
    return true;
  }
}
