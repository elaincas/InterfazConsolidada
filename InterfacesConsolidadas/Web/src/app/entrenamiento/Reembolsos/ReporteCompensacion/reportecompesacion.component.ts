import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import dataSource from 'devextreme/data/data_source';
import { MaestrosServices } from '../.../../services/maestros/maestrosServices.service'
import { helpers } from '../../.../.../../../../helpers/utils';
import { Alertas } from '../../../.../../helpers/notificaciones/notificaciones';
import { ListadoReembolsoCompensacion } from '../models/reembolsos.models'
import { CompensancionReembolsoService } from '../services/compensacionreembolsos/compensacionreeembolso.service'
import { DxDataGridComponent } from 'devextreme-angular';
import { LoginService } from '../../../login/services/login.service';
@Component({
    selector: 'app-reporte-compensacion',
    templateUrl: './reportecompensacion.component.html',
    styleUrls: ['./reportecompesancion.component.css'],
})

export class ReporteCompensacionComponent implements OnInit {
    compensaciones = new Array<ListadoReembolsoCompensacion>();
    compensacionesAIngresar = new Array<any>();
    compensacion: ListadoReembolsoCompensacion;
    bloquearBusqueda: boolean = true;
    selectedRows: number[];
    prefix: string;
    anularSolicitud: any;
    selectionChangedBySelectbox: boolean;
    _mostrarPopup: boolean;

    private _solicitudesaIngresar = new Array<ListadoReembolsoCompensacion>();
    constructor(private loginService: LoginService, private compensacionService: CompensancionReembolsoService) {
        this.compensacion = new ListadoReembolsoCompensacion();
    }

    ngOnInit() {
        this._mostrarPopup = false;
    }

    ObtenerAnoMesSeleccionado(data): boolean {
        if (data.value.getFullYear() != 0) {
            this.compensacion.año = new Date(data.value).getFullYear();
            this.compensacion.mes = new Date(data.value).getMonth() + 1;
            this.bloquearBusqueda = false;
            return true;
        }
        else {
            this.bloquearBusqueda = true;
            return false;
        }
    }

    ObtenerSolicitudes() {
        this.compensacionService.obtenerSolicitudReembolsoAProvadas(this.compensacion).subscribe(data => {
            this.compensaciones = data as any;
        }, error => {
            Alertas.warning("Advertencia",error._body)
        })
    }

    ObtenerInformacionGrid(data) {
        this.compensacionesAIngresar = (data.instance.getSelectedRowsData());
        this.compensacionesAIngresar.forEach(x => {
            x.quincena = this.compensacion.quincena,
                x.mes = this.compensacion.mes,
                x.año = this.compensacion.año,
                x.usuarioId = this.loginService.Usuario.id
        });
        return;
    }

    IngresarInformacion(data) {
        this.ObtenerInformacionGrid(data);
        this.compensacionService.agregarReembolsoAprobados(this.compensacionesAIngresar).subscribe(data => {
            this.ObtenerSolicitudes();
            Alertas.ok("Éxito");
        }, error => {
            console.log(error);
            Alertas.showHttpResponse(error, "Error");
        })
    }
    onEditorPreparing(e: any): void {
        console.log(e);
        if (e.parentType == "dataRow" && e.dataField != "observaciones") {
            e.editorOptions.readOnly = true;
            e.editorOptions.maxLength = 255;
        }

    }

    AnularSolicitud(grid) {
        this.anularSolicitud = (grid.instance.getSelectedRowsData());
        if (this.anularSolicitud.length  == 0) {
            Alertas.warning("Advertencia","Favor elija una solicitud.")
            return;
        }
        this.anularSolicitud[0].usuarioId = this.loginService.Usuario.id;
        this._mostrarPopup = true;
    }

    AnularSolicitudServicio() {
        this.compensacionService.anularSolicitud(this.anularSolicitud[0]).subscribe(data => {
            Alertas.ok("", data);
            this.ObtenerSolicitudes();
        },
            error => {
                Alertas.warning("", error);
            });
        this._mostrarPopup = false;
    }
}
