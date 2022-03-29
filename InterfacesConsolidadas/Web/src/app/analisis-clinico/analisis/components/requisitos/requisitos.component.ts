import { Component, OnInit } from '@angular/core';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { Requisito } from '../../models/requisito.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { RequisitosService } from '../../services/requisitosService';

@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.css']
})
export class RequisitosComponent implements OnInit {
  requisitos: Requisito[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  requisito: Requisito = new Requisito;
  titulo:string;
  constructor(private requisitosService: RequisitosService) { }

  ngOnInit() {
    this.GetAllRequisitos();
  }

  GetAllRequisitos(): void {
    this.requisitosService.ObtenerRequisitos().subscribe(data => {
      this.requisitos = data as Requisito[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarRequisito(requisito: Requisito): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(MensajesGenericosAC.eliminar).then(response => {
        this.requisitosService.EliminarRequisito(requisito.id).subscribe(response => {
          let respuesta = response as RespuestaAC<Requisito>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            requisito.activo = false;
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarRequisito(requisito: Requisito): void {
    this.mostrarPopUp = true;
    this.requisito = requisito;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Editar Requisito";
  }

  NuevoRequisito(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Requisito";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<Requisito>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.requisitos.push(respuestaModal.data);
      }else{
        let requisito = this.requisitos.find(i => i.id == respuestaModal.data.id);
        requisito.descripcion = respuestaModal.data.descripcion;
        requisito.codigoExterno = respuestaModal.data.codigoExterno;
      }
    }
  }
}
