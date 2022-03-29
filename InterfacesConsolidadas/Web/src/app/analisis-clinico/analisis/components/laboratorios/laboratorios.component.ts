import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { Laboratorio } from '../../models/laboratorio.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { LaboratoriosService } from '../../services/laboratoriosService';

@Component({
  selector: 'app-laboratorios',
  templateUrl: './laboratorios.component.html',
  styleUrls: ['./laboratorios.component.css']
})
export class LaboratoriosComponent implements OnInit {
  laboratorios: Laboratorio[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  laboratorio: Laboratorio = new Laboratorio;
  titulo:string;
  constructor(private laboratoriosService: LaboratoriosService,  private route: Router) { }

  ngOnInit() {
    this.GetAllLaboratorios();
  }

  GetAllLaboratorios(): void {
    this.laboratoriosService.ObtenerLaboratorios().subscribe(data => {
      this.laboratorios = data as Laboratorio[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarLaboratorio(laboratorio: Laboratorio): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(MensajesGenericosAC.eliminar).then(response => {
        this.laboratoriosService.EliminarLaboratorio(laboratorio.id).subscribe(response => {
          let respuesta = response as RespuestaAC<Laboratorio>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            laboratorio.activo = false;
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarLaboratorio(laboratorio: Laboratorio): void {
    this.mostrarPopUp = true;
    this.laboratorio = laboratorio;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Editar Laboratorio";
  }

  NuevoLaboratorio(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Laboratorio";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<Laboratorio>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.laboratorios.push(respuestaModal.data);
      }else{
        let laboratorio = this.laboratorios.find(i => i.id == respuestaModal.data.id);
        laboratorio.nombre = respuestaModal.data.nombre;
        laboratorio.microbiologoValidaResultados = respuestaModal.data.microbiologoValidaResultados;
      }
    }
  }

}
