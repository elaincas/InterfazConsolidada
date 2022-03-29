import { Component, OnInit } from '@angular/core';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { MuestraTipo } from '../../models/muestraTipo.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { MuestraTiposService } from '../../services/tiposDeMuestraService';

@Component({
  selector: 'app-tipos-muestra',
  templateUrl: './tipos-muestra.component.html',
  styleUrls: ['./tipos-muestra.component.css']
})
export class TiposMuestraComponent implements OnInit {

  muestrasTipo: MuestraTipo[] = [];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  muestraTipo: MuestraTipo = new MuestraTipo;
  titulo: string;
  constructor(private muestrasTipoService: MuestraTiposService) { }

  ngOnInit() {
    this.GetAllMuestrasTipos();
  }

  GetAllMuestrasTipos(): void {
    this.muestrasTipoService.ObtenerMuestrasTipos().subscribe(data => {
      this.muestrasTipo = data as MuestraTipo[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarMuestraTipo(muestraTipo: MuestraTipo): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(stringAc.Format(msgDelete, "tipo de muestra", muestraTipo.descripcion)).then(response => {
      this.muestrasTipoService.EliminarMuestraTipo(muestraTipo.id).subscribe(response => {
        let respuesta = response as RespuestaAC<MuestraTipo>;
        if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
          Alertas.info(respuesta.data.mensaje);
          muestraTipo.activo = false;
        } else {
          let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error : MensajesGenericosAC.errorValidacion;
          Alertas.error(titulo, respuesta.mensaje);
        }
      }, error =>{
        Alertas.errorEnServidor();
      });
    });
  }

  EditarMuestraTipo(muestraTipo: MuestraTipo): void {
    this.mostrarPopUp = true;
    this.muestraTipo = muestraTipo;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Editar Tipo De Muestra";
  }

  NuevoMuestraTipo(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nuevo Tipo De Muestra";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<MuestraTipo>) {
    if (respuestaModal.tipo == ACTipoRespuesta.Ok) {
      if (respuestaModal.modo == Forms.Modo.Agregar) {
        this.muestrasTipo.push(respuestaModal.data);
      } else {
        let muestraTipo = this.muestrasTipo.find(i => i.id == respuestaModal.data.id);
        muestraTipo.descripcion = respuestaModal.data.descripcion;
      }
    }
  }

}
