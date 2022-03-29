import { Component, ViewChild, OnInit } from "@angular/core";
import { DescuentoAdicionalService } from "./DescuentoAdicionalPorDia/Services/descuento-adicional-dia.service";
import { DescuentoAdicionalConfiguracionConsulta } from "./Models/DescuentoAdicionalConfiguracion";
import { Router } from "@angular/router";

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
  providers: [DescuentoAdicionalService]
})
export class DescuentosComponent implements OnInit {
  constructor(
    private router: Router,
    private descuentosService: DescuentoAdicionalService) { }

  listadoDescuentos: Array<DescuentoAdicionalConfiguracionConsulta>;
  top: number = 5;
  mostrarPopUp = false;
  ngOnInit(): void {
    this.ObtenerDescuentos();
  }

  ObtenerDescuentos() {
    this.descuentosService.ObtenerDescuentosConfigurados(this.top)
      .subscribe(r => { this.listadoDescuentos = r; });
  }

  VerTodosLosDescuentos() {
    this.router.navigate(['ConfiguracionesFarmacia/ListadoDescuentosAdicionales']);
  }

  onActualizarDescuento(){
    this.mostrarPopUp = true;
  }
}