import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { param } from 'jquery';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { Parametro } from '../../models/parametro.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { ParametrosService } from '../../services/parametrosService';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {
  parametros: Parametro[];
  constructor(private parametrosService: ParametrosService,  private route: Router) { }

  ngOnInit() {
    this.GetAllParametros();
  }

  GetAllParametros(): void {
    this.parametrosService.ObtenerParametros().subscribe(data => {
      this.parametros = data as Parametro[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarParametro(parametro: Parametro): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(msgDelete).then(response => {
        this.parametrosService.EliminarParametro(parametro.id).subscribe(response => {
          let respuesta = response as RespuestaAC<Parametro>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            parametro.activo = false;
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarParametro(parametro: Parametro): void {
    this.route.navigate([`/AnalisisClinicos/EditarParametro/${parametro.id}`]);
  }

  NuevoParametro(): void {
    this.route.navigate(['/AnalisisClinicos/NuevoParametro']);
  }

}
