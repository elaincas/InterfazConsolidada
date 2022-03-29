import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { AnalisisClinicoService } from '../../../../../analisis-clinico.service';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { stringAc } from '../../../../helpers/stringFormat';
import { AnalisisRequisito } from '../../../../models/analisisRequisito.model';
import { Laboratorio } from '../../../../models/laboratorio.model';
import { Requisito } from '../../../../models/requisito.model';
import { RespuestaAC } from '../../../../models/respuestaAC';

@Component({
  selector: 'app-requisitos-frm',
  templateUrl: './requisitos-frm.component.html',
  styleUrls: ['./requisitos-frm.component.css'],
  inputs: ['modo', 'analisisRequisitos', 'analisisId'],
  outputs: ['analisisRequisitosChange']
})
export class RequisitosFrmComponent implements OnInit {
  modo: Forms.Modo;
  analisisRequisitos: AnalisisRequisito[];
  analisisRequisitosChange: EventEmitter<AnalisisRequisito[]> = new EventEmitter();
  requisitos: Requisito[];
  laboratorios: Laboratorio[];
  analisisId: string;
  constructor(private analisisService: AnalisisClinicoService) { }

  ngOnInit() {
    this.CargarRequisitos();
    this.CargarLaboratorios();
    if (this.analisisRequisitos == undefined) {
      this.analisisRequisitos = [];
    }
  }

  CargarRequisitos(): void {
    this.analisisService.ObtenerRequisitos().subscribe(data => {
      this.requisitos = data as Requisito[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  CargarLaboratorios(): void {
    this.analisisService.ObtenerLaboratorios().subscribe(data => {
      this.laboratorios = data as Laboratorio[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  GetDisplayExpr(item: Requisito) {
    if (!item) {
      return "";
    }

    return item.descripcion;
  }

  GetDisplayExprLab(item: Laboratorio) {
    if (!item) {
      return "";
    }

    return item.nombre;
  }

  Validar(requisito: Requisito, laboratorio: Laboratorio): void {
    if (requisito == undefined) {
      Notificaciones.error("Seleccione el requisito");
      return;
    }

    if (this.EsRequisitoAgregado(requisito.id)) {
      if (laboratorio != null && this.EsRequisitoDeMismoLaboratorio(requisito, laboratorio)) {
        Notificaciones.error("El requisito ya se encuentra agregado");
        return;
      }

    }
    this.AgregarRequisito(requisito, laboratorio);
  }

  EsRequisitoDeMismoLaboratorio(requisito: Requisito, laboratorio: Laboratorio) {
    if (this.analisisRequisitos == undefined || this.analisisRequisitos.length == 0) {
      return false;
    }
    const index = this.analisisRequisitos.findIndex(r => r.requisitoId === requisito.id && r.laboratorioId == laboratorio.id);
    return index != -1;
  }

  EsRequisitoAgregado(requisitoId: number) {
    if (this.analisisRequisitos == undefined || this.analisisRequisitos.length == 0) {
      return false;
    }
    const index = this.analisisRequisitos.findIndex(r => r.requisitoId === requisitoId);
    return index != -1;
  }

  AgregarRequisito(requisito: Requisito, laboratorio: Laboratorio) {
    let analisisRequisito = new AnalisisRequisito;
    analisisRequisito.prodId = this.analisisId;
    analisisRequisito.requisitoId = requisito.id;
    analisisRequisito.requisito = requisito;
    if (laboratorio != null) {
      analisisRequisito.laboratorio = laboratorio;
      analisisRequisito.laboratorioId = laboratorio.id;
    }
    this.analisisRequisitos.push(analisisRequisito);
    this.analisisRequisitosChange.emit(this.analisisRequisitos);
  }

  EliminarRequisito(analisisRequisito: AnalisisRequisito) {
    if (this.analisisRequisitos == undefined || this.analisisRequisitos.length == 0) {
      Notificaciones.error("No hay requisito que eliminar");
      return;
    }
    const index = this.analisisRequisitos.indexOf(analisisRequisito);
    if (index === -1) {
      return;
    }
    if (this.modo == Forms.Modo.Actualizar) {
      let msgDelete = MensajesGenericosAC.eliminar;
      Alertas.question(stringAc.Format(msgDelete, "análisis requisito", analisisRequisito.requisito.descripcion)).then(response => {
        this.analisisRequisitos.splice(index, 1);
        this.analisisRequisitosChange.emit(this.analisisRequisitos);
      });
    } else {
      this.analisisRequisitos.splice(index, 1);
      this.analisisRequisitosChange.emit(this.analisisRequisitos);
    }
  }

}
