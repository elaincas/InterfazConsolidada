import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../../../../login/services/login.service';
import {AdministrarConserjesService} from '../../services/administrar.conserjes.service';
import {Alertas} from '../../../../../helpers/notificaciones/notificaciones';
import {Router} from '@angular/router';
import {Conserje, FiltrosConjerje} from '../../models/Conserje';

@Component({
  selector: 'app-lista-conserjes',
  templateUrl: './lista-conserjes.component.html',
  styleUrls: ['./lista-conserjes.component.css'],
  providers: [AdministrarConserjesService, LoginService]
})
export class ListaConserjesComponent implements OnInit {

  constructor(private service: AdministrarConserjesService,
    private router: Router) { }

    ListaConserjes: Conserje[] = [];
    filtrosLista: FiltrosConjerje = {
      nombre: ""
    }
    popupConserjeVisible = false;
    fotografiasGaleria: string[] = [];

  ngOnInit() {
    this.ObtenerLista();
  }

  ObtenerLista() {
    Alertas.load();
    this.service.ObtenerConserjes(this.filtrosLista)
      .subscribe(r => {
        this.ListaConserjes = r;
        Alertas.close();
      });
  }

  EditarConserje(conserje: Conserje) {
    this.router.navigate(['sad/conserjes/editar/',conserje.id]);
  }

  NavegarARegistrarConserje() {
    this.router.navigate(['sad/conserjes/registrar']);
  }

  InactivarConserje(conserje:Conserje) {
    Alertas.question('¿Está seguro de que desea inactivar este conserje?')
      .then(() => {
        conserje.idUsuarioUltimaModificacion = 777;
        this.service.InactivarConserje(conserje).subscribe(x => {
          this.ObtenerLista();
          Alertas.ok("¡Éxito!","El registro se inactivó correctamente.")
        });
    });
  }

  onHidePopPupConserje() {
    this.fotografiasGaleria = [];
  }

  VerFotografiaConserje(detalle) {
    this.popupConserjeVisible = true;

    if(detalle.rutaFotografia != "" && detalle.rutaFotografia != null)
      this.fotografiasGaleria.push(detalle.rutaFotografia);
  }
}