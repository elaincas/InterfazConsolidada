import { Component, OnInit } from '@angular/core';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { ResultadoTipo } from '../../models/resultadoTipo.model';
import { ResultadoTipoService } from '../../services/tiposDeResultadoService';

@Component({
  selector: 'app-resultado-tipo',
  templateUrl: './resultado-tipo.component.html',
  styleUrls: ['./resultado-tipo.component.css']
})
export class ResultadoTipoComponent implements OnInit {

  resultadoTipos: ResultadoTipo[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  resultadoTipo: ResultadoTipo = new ResultadoTipo;
  titulo:string;

  constructor(private resultadoTiposService: ResultadoTipoService) { }
  ngOnInit() {
    this.GetAllResultadoTipo();
  }

  GetAllResultadoTipo(): void {
    this.resultadoTiposService.ObtenerResultadoTipos().subscribe(data => {
      this.resultadoTipos = data as ResultadoTipo[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarResultadoTipo(resultadoTipo: ResultadoTipo): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(stringAc.Format(msgDelete, "tipo de resultado", resultadoTipo.descripcion)).then(response => {
        this.resultadoTiposService.EliminarResultadoTipo(resultadoTipo.id).subscribe(response => {
          let respuesta = response as RespuestaAC<ResultadoTipo>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            let index = this.resultadoTipos.indexOf(resultadoTipo);
            this.resultadoTipos.splice(index, 1);
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarResultadoTipo(resultadoTipo: ResultadoTipo): void {
    this.mostrarPopUp = true;
    this.resultadoTipo = resultadoTipo;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Editar Tipo Resultado";
  }

  NuevoTipoResultado(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Tipo Resultado";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<ResultadoTipo>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.resultadoTipos.push(respuestaModal.data);
      }else{
        let resultadoTipo = this.resultadoTipos.find(i => i.id == respuestaModal.data.id);
        resultadoTipo.descripcion = respuestaModal.data.descripcion;
      }
    }
  }

}
