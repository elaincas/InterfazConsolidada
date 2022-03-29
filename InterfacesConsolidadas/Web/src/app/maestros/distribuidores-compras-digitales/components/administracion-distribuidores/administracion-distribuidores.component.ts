import { Component, OnInit } from "@angular/core";
import { Distribuidor } from "../../models/distribuidor.model";
import { DistribuidoresComprasDigitalesService } from "../../services/distribuidores-compras-digitales.service";

@Component({
  selector: "app-administracion-distribuidores",
  templateUrl: "./administracion-distribuidores.component.html",
  styleUrls: ["./administracion-distribuidores.component.css"],
})
export class AdministracionDistribuidoresComponent implements OnInit {
  public distribuidores: Distribuidor[] = [];

  public distribuidorPorId: Distribuidor;
  public esPopupModificarDistribuidorVisible: boolean;

  constructor(
    private distribuidoresComprasDigitalesService: DistribuidoresComprasDigitalesService
  ) {}

  ngOnInit() {
    this.obtenerDistribuidores();
  }

  obtenerDistribuidores(): void {
    this.distribuidoresComprasDigitalesService
      .obtenerDistribuidores()
      .subscribe(
        (data) => {
          this.distribuidores = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  cosultarDistribuidorPorId(distribuidor: Distribuidor): void {
    this.esPopupModificarDistribuidorVisible =
      !this.esPopupModificarDistribuidorVisible;
    this.distribuidorPorId = distribuidor;
  }

  onCerrarModal(): void {
    this.esPopupModificarDistribuidorVisible = false;
  }
}
