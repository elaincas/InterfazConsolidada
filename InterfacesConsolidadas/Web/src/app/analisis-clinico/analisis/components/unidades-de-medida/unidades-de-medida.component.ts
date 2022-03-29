import { Component, OnInit } from '@angular/core';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { UnidadDeMedida } from '../../models/unidadMedida.model';
import { UnidadesDeMedidasService } from '../../services/unidadDeMedidaService';

@Component({
  selector: 'app-unidades-de-medida',
  templateUrl: './unidades-de-medida.component.html',
  styleUrls: ['./unidades-de-medida.component.css']
})
export class UnidadesDeMedidaComponent implements OnInit {
  unidadesDeMedida: UnidadDeMedida[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  unidadDeMedida: UnidadDeMedida = new UnidadDeMedida;
  titulo:string;
  constructor(private unidadDeMedidaService: UnidadesDeMedidasService) { }

  ngOnInit() {
    this.GetAllUnidadDeMedidas();
  }

  GetAllUnidadDeMedidas(): void {
    this.unidadDeMedidaService.ObtenerUnidadesDeMedidas().subscribe(data => {
      this.unidadesDeMedida = data as UnidadDeMedida[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarUnidadDeMedida(unidadDeMedida: UnidadDeMedida): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(msgDelete).then(response => {
        this.unidadDeMedidaService.EliminarUnidadDeMedida(unidadDeMedida.id).subscribe(response => {
          let respuesta = response as RespuestaAC<UnidadDeMedida>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            unidadDeMedida.activo = false;
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarUnidadDeMedida(unidadDeMedida: UnidadDeMedida): void {
    this.mostrarPopUp = true;
    this.unidadDeMedida = unidadDeMedida;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Nueva Unidad de medida";
  }

  NuevoUnidadDeMedida(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Unidad de medida";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<UnidadDeMedida>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.unidadesDeMedida.push(respuestaModal.data);
      }else{
        let unidadDeMedida = this.unidadesDeMedida.find(i => i.id == respuestaModal.data.id);
        unidadDeMedida.nombre = respuestaModal.data.nombre;
        unidadDeMedida.abreviacion = respuestaModal.data.abreviacion;
      }
    }
  }

}
