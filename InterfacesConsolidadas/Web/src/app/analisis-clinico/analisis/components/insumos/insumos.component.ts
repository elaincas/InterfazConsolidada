import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { Insumo } from '../../models/insumo.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { InsumosService } from '../../services/insumosService';
import { InsumosFrmModalComponent } from './modals/insumos-frm-modal/insumos-frm-modal.component';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.css']
})
export class InsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  insumo: Insumo = new Insumo;
  titulo:string;
  constructor(private insumosService: InsumosService,  private route: Router) { }

  ngOnInit() {
    this.GetAllInsumos();
  }
  GetAllInsumos(): void {
    this.insumosService.ObtenerInsumos().subscribe(data => {
      this.insumos = data as Insumo[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarInsumo(insumo: Insumo): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(msgDelete).then(response => {
        this.insumosService.EliminarInsumo(insumo.prodId).subscribe(response => {
          let respuesta = response as RespuestaAC<Insumo>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            insumo.activo = false;
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarInsumo(insumo: Insumo): void {
    this.mostrarPopUp = true;
    this.insumo = insumo;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Editar Insumo";
  }

  NuevoInsumo(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Insumo";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<Insumo>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.insumos.push(respuestaModal.data);
      }else{
        let insumo = this.insumos.find(i => i.prodId == respuestaModal.data.prodId);
        insumo.cantidad = respuestaModal.data.cantidad;
        insumo.descripcion = respuestaModal.data.descripcion;
      }
    }
  }

}
