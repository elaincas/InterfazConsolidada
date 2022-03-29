import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { AnalisisClinicoService } from '../../../../../analisis-clinico.service';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { stringAc } from '../../../../helpers/stringFormat';
import { AnalisisInsumo } from '../../../../models/analisisInsumo.model';
import { Insumo } from '../../../../models/insumo.model';
import { RespuestaAC } from '../../../../models/respuestaAC';

@Component({
  selector: 'app-analisis-insumos-frm',
  templateUrl: './analisis-insumos-frm.component.html',
  styleUrls: ['./analisis-insumos-frm.component.css'],
  inputs: ['modo', 'analisisInsumos', 'analisisId'],
  outputs: ['analisisInsumosChange']
})
export class AnalisisInsumosFrmComponent implements OnInit {
  modo: Forms.Modo;
  analisisInsumos: AnalisisInsumo[];
  analisisInsumosChange: EventEmitter<AnalisisInsumo[]> = new EventEmitter();
  insumos: Insumo[];
  analisisId: string;
  editarAnalisisInsumo: boolean = false;
  constructor(private analisisService: AnalisisClinicoService) { }

  ngOnInit() {
    this.CargarInsumos();
    if (this.analisisInsumos == undefined) {
      this.analisisInsumos = [];
    }
  }

  CargarInsumos(): void {
    this.analisisService.ObtenerInsumos().subscribe(data => {
      this.insumos = data as Insumo[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  GetDisplayExpr(item: Insumo) {
    if (!item) {
      return "";
    }

    return item.prodId + " " + item.descripcion;
  }

  search(item: Insumo) {
    if (!item) {
      return "";
    }

    return item.prodId + " " + item.descripcion;
  }

  Validar(item: Insumo, cantidad: number): void {
    if (item == undefined || cantidad < 0 || cantidad == undefined) {
      Notificaciones.error("No ha seleccionado el insumo ó la cantidad esta en formato incorrecto");
      return;
    }

    if (this.EsInsumoAgregado(item.prodId)) {
      Notificaciones.error("El insumo ya se encuentra agregado");
      return;
    }
    this.AgregarInsumo(item, cantidad);
  }

  EsInsumoAgregado(insumoId: string) {
    if (this.analisisInsumos == undefined || this.analisisInsumos.length == 0) {
      return false;
    }
    const index = this.analisisInsumos.findIndex(p => p.insumoId === insumoId);
    return index != -1;
  }

  AgregarInsumo(insumo: Insumo, cantidad: number) {
    let analisisInsumo = new AnalisisInsumo;
    analisisInsumo.insumoId = insumo.prodId;
    analisisInsumo.analisisProdId = this.analisisId;
    analisisInsumo.insumo = insumo;
    analisisInsumo.cantidad = cantidad;
    analisisInsumo.nuevo = true;
    this.analisisInsumos.push(analisisInsumo);
    this.analisisInsumosChange.emit(this.analisisInsumos);
  }

  EliminarInsumo(analisisInsumo: AnalisisInsumo) {
    if (this.analisisInsumos == undefined || this.analisisInsumos.length == 0) {
      Notificaciones.error("No hay insumo que eliminar");
      return;
    }
    const index = this.analisisInsumos.indexOf(analisisInsumo);
    if (index === -1) {
      return;
    }
    if (this.modo == Forms.Modo.Actualizar) {
      let msgDelete = MensajesGenericosAC.eliminar;
      Alertas.question(msgDelete).then(response => {
        this.analisisInsumos.splice(index, 1);
        this.analisisInsumosChange.emit(this.analisisInsumos);
      });
    } else {
      this.analisisInsumos.splice(index, 1);
      this.analisisInsumosChange.emit(this.analisisInsumos);
    }
  }

  EditarInsumo() {
    if (this.modo == Forms.Modo.Actualizar) {
      if(this.editarAnalisisInsumo == false){
        this.editarAnalisisInsumo = true
        return;
      }
      if(this.editarAnalisisInsumo == true){
        this.editarAnalisisInsumo = false;
        return;
      }
    }
  }

  edit(e){
    if(e.newData != undefined){
      var rangoEditadoId = e.key.id;
      this.analisisInsumos.find(x => x.id == rangoEditadoId).editado = true;
    }
  }

  editCanceled(e){
    if(e.newData != undefined){
      var rangoEditadoId = e.key.id;
      this.analisisInsumos.find(x => x.id == rangoEditadoId).editado = false;
    }
  }

}
