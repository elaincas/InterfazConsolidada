import { Component, EventEmitter, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Forms } from '../../../../../../helpers/forms';
import { AnalisisParametro } from '../../../../models/analisisParametro.model';
import { AnalisisClinicoService } from '../../../../../analisis-clinico.service';
import { Parametro } from '../../../../models/parametro.model';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { stringAc } from '../../../../helpers/stringFormat';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
@Component({
  selector: 'app-analisis-parametros-frm',
  templateUrl: './analisis-parametros-frm.component.html',
  styleUrls: ['./analisis-parametros-frm.component.css'],
  inputs: ['modo', 'analisisParametros', 'analisisId'],
  outputs: ['analisisParametrosChange']
})
export class AnalisisParametrosFrmComponent implements OnInit {
  modo: Forms.Modo;
  analisisId: string;
  analisisParametros: AnalisisParametro[];
  analisisParametrosChange: EventEmitter<AnalisisParametro[]> = new EventEmitter();
  parametros: Parametro[];
  _gridBoxValue: number[] = [];
  constructor(private analisisService: AnalisisClinicoService) { }

  ngOnInit() {
    this.CargarParametros();
    if (this.analisisParametros == undefined) {
      this.analisisParametros = [];
    }
  }

  CargarParametros(): void {
    this.analisisService.ObtenerParametros().subscribe(data => {
      this.parametros = data.filter(x => x.activo == true) as Parametro[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  GetDisplayExpr(item: Parametro) {
    if (!item) {
      return "";
    }

    return item && item.nombre + " " + item.descripcion;
  }

  set gridBoxValueSelect(value: Parametro[]) {
    this._gridBoxValue = [];

    if (value != null) {
      value.forEach(data => {
        this._gridBoxValue.push(data.id);
      });
    }
  }
  set gridBoxValue(value: number[]) {
    this._gridBoxValue = value || [];
  }
  get gridBoxValue(): number[] {
    return this._gridBoxValue;
  }

  Validar(Id: number): void {
    if (Id == undefined) {
      Notificaciones.error("Seleccione el parámetro");
      return;
    }

    if (this.EsParametroAgregado(Id)) {
      Notificaciones.error("El parámetro ya se encuentra agregado");
      return;
    }
    this.AgregarParametro(Id);
  }

  EsParametroAgregado(parametroId: number) {
    if (this.analisisParametros == undefined || this.analisisParametros.length == 0) {
      return false;
    }
    const index = this.analisisParametros.findIndex(p => p.parametroId === parametroId);
    return index != -1;
  }

  AgregarParametro(parametroId: number) {
    let analisisParametro = new AnalisisParametro;
    analisisParametro.prodId = this.analisisId;
    analisisParametro.parametroId = parametroId;
    analisisParametro.parametro = this.parametros.find(x => x.id == parametroId);
    this.analisisParametros.push(analisisParametro);
    this.analisisParametrosChange.emit(this.analisisParametros);
  }

  EliminarParametro(Analisisparametro: AnalisisParametro) {
    if (this.analisisParametros == undefined || this.analisisParametros.length == 0) {
      Notificaciones.error("No hay parámetro que eliminar");
      return;
    }
    const index = this.analisisParametros.indexOf(Analisisparametro);
    if (index === -1) {
      return;
    }
    if (this.modo == Forms.Modo.Actualizar) {
      let msgDelete = MensajesGenericosAC.eliminar;
      Alertas.question(stringAc.Format(msgDelete, "análisis parámetro", Analisisparametro.parametro.nombre)).then(response => {
        this.analisisParametros.splice(index, 1);
        this.analisisParametrosChange.emit(this.analisisParametros);
      });
    } else {
      this.analisisParametros.splice(index, 1);
      this.analisisParametrosChange.emit(this.analisisParametros);
    }
  }

}
