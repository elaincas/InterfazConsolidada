import { Component, OnInit } from '@angular/core';
import { EcommerceDashboardService } from '../reportes/services/ecommerce-dashboard.service';

declare let $:any;

@Component({
  selector: 'app-ecommerce-dashboard',
  templateUrl: './ecommerce-dashboard.component.html',
  styleUrls: ['./ecommerce-dashboard.component.css']
})
export class EcommerceDashboardComponent implements OnInit {

  constructor(public ecommerceDashboardService: EcommerceDashboardService) { }
  usuarioMesActualIndicadorColor: string = "red";
  fueronVentasDelMesPasadoSuperadas: boolean = false;

  ngOnInit() {
    this.load();
  }

  load(){
    this.ecommerceDashboardService.cargarInformacion().subscribe(data => {
      this.asignarIndicadorColorUsuarioMesActual();
      this.asignarIndicadorColorVentasMesActual();
    });
  }

  asignarIndicadorColorUsuarioMesActual(){

    let hayMenosUsuariosQueMesAnterior = this.ecommerceDashboardService.resumen.usuarios.usuariosRegistradosUltimoMes >
                                         this.ecommerceDashboardService.resumen.usuarios.usuariosRegistradosMesActual;
    if (hayMenosUsuariosQueMesAnterior) {
      this.usuarioMesActualIndicadorColor = "red";
     // this.cambiarColorHeader("usuariosRegistradosMesActualHeader","red");
      return;
    }
   // this.cambiarColorHeader("usuariosRegistradosMesActualHeader","green");
  }

  asignarIndicadorColorVentasMesActual(){

    this.fueronVentasDelMesPasadoSuperadas = this.ecommerceDashboardService.resumen.pedidos.totalVentasUltimoMes <
                                             this.ecommerceDashboardService.resumen.pedidos.totalVentasMesActual;
  }


  cambiarColorHeader(id:string, color:string){
    $(`#${id}`).attr("data-background-color", color);
  }

}
