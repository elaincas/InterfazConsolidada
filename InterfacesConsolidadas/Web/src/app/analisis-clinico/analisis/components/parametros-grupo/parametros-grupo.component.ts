import { Component, OnInit } from '@angular/core';
import { param } from 'jquery';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { ParametroGrupo } from '../../models/parametroGrupo.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { ParametrosGrupoService } from '../../services/parametrosGrupoService';

@Component({
  selector: 'app-parametros-grupo',
  templateUrl: './parametros-grupo.component.html',
  styleUrls: ['./parametros-grupo.component.css']
})
export class ParametrosGrupoComponent implements OnInit {

  parametroGrupos: ParametroGrupo[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  parametroGrupoModal: ParametroGrupo;
  titulo:string;
  constructor(private parametroGruposService: ParametrosGrupoService) { }

  ngOnInit() {
    this.GetAllParametroGrupos();
  }

  GetAllParametroGrupos(): void {
    this.parametroGruposService.ObtenerParametrosGrupos().subscribe(data => {
      this.parametroGrupos = data as ParametroGrupo[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarParametroGrupo(parametroGrupo: ParametroGrupo): void {
    Alertas.question(MensajesGenericosAC.eliminar).then(response => {
        this.parametroGruposService.EliminarParametroGrupo(parametroGrupo.id).subscribe(response => {
          let respuesta = response as RespuestaAC<ParametroGrupo>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            parametroGrupo.activo = false;
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarParametroGrupo(parametroGrupo: ParametroGrupo): void {
    this.mostrarPopUp = true;
    this.parametroGrupoModal = parametroGrupo;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Editar Grupo";
  }

  NuevoParametroGrupo(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Grupo";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<ParametroGrupo>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.parametroGrupos.push(respuestaModal.data);
      }else{
        let parametroGrupo = this.parametroGrupos.find(i => i.id == respuestaModal.data.id);
        parametroGrupo.nombre = respuestaModal.data.nombre;
      }
    }
  }

}
