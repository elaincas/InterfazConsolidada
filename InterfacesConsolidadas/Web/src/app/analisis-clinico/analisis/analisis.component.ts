import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TimeInterval } from 'rxjs';
import { Alertas } from '../../helpers/notificaciones/notificaciones';
import { AnalisisClinicoService } from '../analisis-clinico.service';
import { ACTipoRespuesta } from './enums/TipoRespuesta';
import { MensajesGenericosAC } from './helpers/mensajes';
import { stringAc } from './helpers/stringFormat';
import { TimeSpan } from './helpers/timeSpan';
import { Analisis } from './models/analisis.model';
import { RespuestaAC } from './models/respuestaAC';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements OnInit {
  analisis: Analisis[];
  constructor(private analisisService: AnalisisClinicoService,  private route: Router) { }

  ngOnInit() {
    this.GetAllAnalisis();
  }

  GetAllAnalisis(): void {
    this.analisisService.ObtenerListaDeAnalisis().subscribe(data => {
      this.analisis = data as Analisis[];
      this.analisis.forEach(x =>{
        let dias = TimeSpan.fromMilliseconds(x.totalMilisegundos).days;
        let horas = TimeSpan.fromMilliseconds(x.totalMilisegundos).hours;
        let minutos = TimeSpan.fromMilliseconds(x.totalMilisegundos).minutes;

        x.tiempoDeEntrega = `${dias<10?'0'+dias:dias}:${horas<10?'0'+horas:horas}:${minutos<10?'0'+minutos:minutos}`
      });
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  DisplayTimeFormat(timeObj: any){
    var min = timeObj.Minutes < 10 ? "0" + timeObj.Minutes : timeObj.Minutes;
      var sec = timeObj.Seconds < 10 ? "0" + timeObj.Seconds : timeObj.Seconds;
      var hour = timeObj.Hours < 10 ? "0" + timeObj.Hours : timeObj.Hours;
      return hour + ':' + min + ':' + sec;
  }

  EliminarAnalisis(analisis: Analisis, data: Analisis[]): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(stringAc.Format(msgDelete, "análisis clínico", analisis.nombre)).then(response => {
        this.analisisService.EliminarAnalisis(analisis.prodId).subscribe(response => {
          let respuesta = response as RespuestaAC<Analisis>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            let index = this.analisis.indexOf(analisis);
            this.analisis.splice(index, 1);
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.data.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarAnalisis(analisis: Analisis): void {
    this.route.navigate([`/AnalisisClinicos/Editar/${analisis.prodId}`]);
  }

  NuevoAnalisis(): void {
    this.route.navigate(['/AnalisisClinicos/NuevoAnalisis']);
  }

}
