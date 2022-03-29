import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { AnalisisClinicoService } from '../../../../../analisis-clinico.service';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { stringAc } from '../../../../helpers/stringFormat';
import { AnalisisLaboratorios } from '../../../../models/analisisLaboratorio.model';
import { Laboratorio } from '../../../../models/laboratorio.model';
import { RespuestaAC } from '../../../../models/respuestaAC';

@Component({
  selector: 'app-analisis-laboratorios-frm',
  templateUrl: './analisis-laboratorios-frm.component.html',
  styleUrls: ['./analisis-laboratorios-frm.component.css'],
  inputs: ['modo', 'analisisLaboratorios', 'analisisId'],
  outputs: ['analisisLaboratoriosChange']
})
export class AnalisisLaboratoriosFrmComponent implements OnInit {
  modo: Forms.Modo;
  analisisLaboratorios: AnalisisLaboratorios[];
  analisisLaboratoriosChange: EventEmitter<AnalisisLaboratorios[]> = new EventEmitter();
  laboratorios: Laboratorio[];
  analisisId: string;
  editarAnalisisLaboratorio: boolean = false;
  constructor(private analisisService: AnalisisClinicoService) { }

  ngOnInit() {
    this.CargarLaboratorios();
    if (this.analisisLaboratorios == undefined) {
      this.analisisLaboratorios = [];
    }
  }

  CargarLaboratorios(): void {
    this.analisisService.ObtenerLaboratorios().subscribe(data => {
      this.laboratorios = data as Laboratorio[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  GetDisplayExpr(item: Laboratorio) {
    if (!item) {
      return "";
    }

    return item.nombre;
  }

  Validar(item: Laboratorio, costo: number, predeterminado: boolean): void {
    if (item == undefined || costo < 0 || costo == undefined) {
      Notificaciones.error("Seleccione el laboratorio ó el costo esta en formato incorrecto");
      return;
    }

    if (this.EsLaboratorioAgregado(item.id)) {
      Notificaciones.error("El laboratorio ya se encuentra agregado");
      return;
    }
    this.AgregarLaboratorio(item, costo, predeterminado);
  }

  EsLaboratorioAgregado(laboratorioId: number) {
    if (this.analisisLaboratorios == undefined || this.analisisLaboratorios.length == 0) {
      return false;
    }
    const index = this.analisisLaboratorios.findIndex(p => p.laboratorioId === laboratorioId);
    return index != -1;
  }

  AgregarLaboratorio(laboratorio: Laboratorio, costo: number, predeterminado: boolean) {
    let analisisLaboratorio = new AnalisisLaboratorios;
    analisisLaboratorio.costo = costo;
    analisisLaboratorio.laboratorio = laboratorio;
    analisisLaboratorio.analisisProdId = this.analisisId;
    analisisLaboratorio.laboratorioId = laboratorio.id;
    analisisLaboratorio.predeterminado = predeterminado;
    this.analisisLaboratorios.push(analisisLaboratorio);
    this.analisisLaboratoriosChange.emit(this.analisisLaboratorios);
  }

  EliminarLaboratorio(analisisLaboratorio: AnalisisLaboratorios) {
    if (this.analisisLaboratorios == undefined || this.analisisLaboratorios.length == 0) {
      Notificaciones.error("No hay laboratorio que eliminar");
      return;
    }
    const index = this.analisisLaboratorios.indexOf(analisisLaboratorio);
    if (index === -1) {
      return;
    }
    if (this.modo == Forms.Modo.Actualizar) {
      let msgDelete = MensajesGenericosAC.eliminar;
      Alertas.question(msgDelete).then(response => {
        this.analisisLaboratorios.splice(index, 1);
        this.analisisLaboratoriosChange.emit(this.analisisLaboratorios);
      });
    } else {
      this.analisisLaboratorios.splice(index, 1);
      this.analisisLaboratoriosChange.emit(this.analisisLaboratorios);
    }
  }

  EditarLaboratorio(analisisLaboratorio: AnalisisLaboratorios) {
    if (this.modo == Forms.Modo.Actualizar) {
      if(this.editarAnalisisLaboratorio == false){
        this.editarAnalisisLaboratorio = true
        return;
      }
      if(this.editarAnalisisLaboratorio == true){
        this.editarAnalisisLaboratorio = false;
        return;
      }
    }
  }

}
