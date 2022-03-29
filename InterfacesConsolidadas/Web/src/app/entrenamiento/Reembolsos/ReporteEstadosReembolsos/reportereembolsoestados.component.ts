import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import dataSource from 'devextreme/data/data_source';
import { helpers } from '../../.../.../../../../helpers/utils';
import { Alertas } from '../../../.../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../.../../../login/services/login.service';
import { ListadoReembolsosSegunEstado } from '../models/reembolsos.models'
import { MaestrosServices } from '../services/maestros/maestrosServices.service'
import {saveAs as importedSaveAs} from "file-saver";
import { Headers } from '@angular/http/src/headers';
@Component({
    selector: 'app-reporte-compensacion',
    templateUrl: './reportereembolsoestados.compoment.html',
    styleUrls: ['./reportereembolsoestados.component.css'],
})

export class ReporteEstadosReembolsosComponent implements OnInit {
    fechasSolicitud: ListadoReembolsosSegunEstado;
    solicitudesEstados = Array<ListadoReembolsosSegunEstado>();
    constructor(private loginService: LoginService, private maestroService: MaestrosServices) {
        this.fechasSolicitud = new ListadoReembolsosSegunEstado();
        this.solicitudesEstados = new Array<ListadoReembolsosSegunEstado>();
    }

    ngOnInit() {

    }

    obtenerSolicitudes() {
        this.maestroService.obtenerEstadosReembolsos(this.fechasSolicitud).subscribe(data => {
            this.solicitudesEstados = data as any[];
        }, error => {
        });
    }
    Descarga(data) {
        this.maestroService
        .Download(data.reembolsoID)
        .subscribe(info => {
            var url = window.URL.createObjectURL(info);
            var linkElement = document.createElement('a');
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download","CompromisoColaborador"+data.colaboradorID+".pdf");
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });
            linkElement.dispatchEvent(clickEvent);
            }),
        error => {
            Alertas.errorEnServidor("",error);
        },
        () => {
           console.log('download usuarios finalizado');
        };
    }


}
