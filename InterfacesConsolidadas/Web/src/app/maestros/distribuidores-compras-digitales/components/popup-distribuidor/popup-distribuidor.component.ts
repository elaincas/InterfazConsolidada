import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { Distribuidor } from "../../models/distribuidor.model";
import { DistribuidoresComprasDigitalesService } from "../../services/distribuidores-compras-digitales.service";

@Component({
  selector: "app-popup-distribuidor",
  templateUrl: "./popup-distribuidor.component.html",
  styleUrls: ["./popup-distribuidor.component.css"],
})
export class PopupDistribuidorComponent implements OnInit {
  @Input() esPopupModificarDistribuidorVisible: boolean;
  @Input() distribuidor: Distribuidor;
  @Output() cerrarModal = new EventEmitter();

  constructor(
    private distribuidoresComprasDigitalesService: DistribuidoresComprasDigitalesService
  ) {}

  ngOnInit() {}

  onCerrarModal(e): void {
    this.cerrarModal.emit();
  }

  modificarDistribuidor(e): void {
    if (this.esFormularioValido(e)) {
      Alertas.load();
      this.distribuidoresComprasDigitalesService
        .actualizarDistribuidor(this.distribuidor)
        .subscribe(
          (data) => {
            this.esPopupModificarDistribuidorVisible = false;
            Alertas.ok(
              "Datos guardados",
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
      this.distribuidor.enviarCorreoDeCompra == true &&
      !this.distribuidor.email
    ) {
      Alertas.warning(
        "Advertencia",
        "Debe ingresar un correo si habilita el envio de compra."
      );
      return false;
    }
    
    return true;
  }
}
