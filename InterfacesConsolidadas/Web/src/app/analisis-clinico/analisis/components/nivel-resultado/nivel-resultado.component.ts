import { Component, OnInit } from '@angular/core';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { NivelResultado } from '../../models/nivelResultado.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { NivelResultadoService } from '../../services/nivelResultadoService';

@Component({
  selector: 'app-nivel-resultado',
  templateUrl: './nivel-resultado.component.html',
  styleUrls: ['./nivel-resultado.component.css']
})
export class NivelResultadoComponent implements OnInit {

  nivelResultados: NivelResultado[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  nivelResultado: NivelResultado = new NivelResultado;
  titulo:string;
  constructor(private nivelResultadosService: NivelResultadoService) { }

  ngOnInit() {
    this.GetAllNivelResultados();
  }

  GetAllNivelResultados(): void {
    this.nivelResultadosService.ObtenerNivelesResultado().subscribe(data => {
      this.nivelResultados = data as NivelResultado[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarNivelResultado(nivelResultado: NivelResultado): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(msgDelete).then(response => {
        this.nivelResultadosService.EliminarNivelResultado(nivelResultado.id).subscribe(response => {
          let respuesta = response as RespuestaAC<NivelResultado>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            let index = this.nivelResultados.indexOf(nivelResultado);
            this.nivelResultados.splice(index, 1);
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarNivelResultado(nivelResultado: NivelResultado): void {
    this.mostrarPopUp = true;
    this.nivelResultado = nivelResultado;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "editar Nivel Resultado";
  }

  NuevoNivelResultado(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Nivel Resultado";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<NivelResultado>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.nivelResultados.push(respuestaModal.data);
      }else{
        let nivelResultado = this.nivelResultados.find(i => i.id == respuestaModal.data.id);
        nivelResultado.descripcion = respuestaModal.data.descripcion;
      }
    }
  }

}
