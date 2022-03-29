import { Component, OnInit, ViewChild } from '@angular/core';
import { EncuestasService } from '../../../services/encuestas.service';
import {
  ReporteEncuesta,
  ReporteEncuestaMap,
} from '../../../models/reporte-encuesta.model';
import CustomStore from 'devextreme/data/custom_store';
import { environment } from '../../../../../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { CalificacionesGenerales } from '../../../models/reporte-calificaciones-generales.model';
import * as moment from 'moment';
import { DxDataGridComponent } from 'devextreme-angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [HttpClient],
})
export class ReportesComponent implements OnInit {
  @ViewChild('dxDataGridListadoRespuestas')
  dataGridListadoRespuestas: DxDataGridComponent;
  reporte: ReporteEncuestaMap[];
  reporteCalificacionesGenerales: CalificacionesGenerales;
  formGroupResultadoEncuesta: FormGroup;
  calificaciones: any;
  idPregunta: number;
  _mostrarPopup: boolean;
  informacionPreview: any;
  satisfechoSeleccionado: boolean;
  insatisfechoSeleccionado: boolean;

  constructor(
    private _encuestasService: EncuestasService,
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.reporteCalificacionesGenerales = <CalificacionesGenerales>{};
    this.calificaciones = {};
    this.reporte = <ReporteEncuestaMap[]>{};
    this.idPregunta = null;
    this._mostrarPopup = false;
    this.satisfechoSeleccionado = false;
    this.insatisfechoSeleccionado = false;
    this.informacionPreview = {
      id: -1,
      descripcion: '',
      imagenSatisfechoUrl: '',
      imagenInsatisfechoUrl: '',
    };

    this.calificaciones = new CustomStore({
      key: 'OrderNumber',
      load: (loadOptions: any) => {
        let params: HttpParams = new HttpParams();
        [
          'skip',
          'take',
          'requireTotalCount',
          'requireGroupCount',
          'sort',
          'filter',
          'totalSummary',
          'group',
          'groupSummary',
        ].forEach((i) => {
          if (i in loadOptions && this.isNotEmpty(loadOptions[i]))
            params = params.set(i, JSON.stringify(loadOptions[i]));
        });

        let preguntaId = '';

        if (this.idPregunta !== null) {
          params = params.set('preguntaId', this.idPregunta.toString());
        }
        params = params.set('tipoPreguntaId', '1');

        return _httpClient
          .get(
            `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/Calificaciones`,
            { params: params }
          )
          .toPromise()
          .then((data: any) => {
            data.data = data.data.map((val) => ({
              ...val,
              fechaAgrega: new Date(val.fechaAgrega),
              fechaPedido: new Date(val.fechaPedido)
            }));
            return {
              data: data.data,
              totalCount: data.totalCount,
              summary: data.summary,
              groupCount: data.groupCount,
            };
          })
          .catch((error) => {
            throw 'Hubo un error';
          });
      },
    });

    this.formGroupResultadoEncuesta = this._formBuilder.group({
      comentario: new FormControl(''),
    });

    this._encuestasService.obtenerReporte().subscribe(
      (res) => {
        this.reporte = res as ReporteEncuestaMap[];
      },
      (err) => {}
    );

    this._encuestasService.obtenerDatosGeneralesReporte().subscribe(
      (res) => {
        this.reporteCalificacionesGenerales = res as CalificacionesGenerales;
      },
      (err) => {}
    );
  }

  focusDataGridListadoRespuestas() {
    document.getElementById('dataGridListadoRespuestas').scrollIntoView();
  }

  verTodasLasCalificaciones() {
    this.idPregunta = null;
    this.recargarGridCalificaciones();
  }

  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
  }

  recargarGridCalificaciones() {
    this.dataGridListadoRespuestas.instance.refresh();
    this.focusDataGridListadoRespuestas();
  }

  filtrarPregunta(idPregunta) {
    this.idPregunta = idPregunta;
    this.recargarGridCalificaciones();
  }

  mostrarPreview(data) {
    this._mostrarPopup = true;
    this.informacionPreview.id = data.id;
    this.informacionPreview.descripcion = data.descripcion;
    this.informacionPreview.imagenSatisfechoUrl = `${environment.experienciaUsuarioAssets}/${data.imagenSatisfechoUrl}`;
    this.informacionPreview.imagenInsatisfechoUrl = `${environment.experienciaUsuarioAssets}/${data.imagenInsatisfechoUrl}`;
  }

  cerrarPreview() {
    this._mostrarPopup = false;
    this.informacionPreview.id = -1;
    this.informacionPreview.descripcion = '';
    this.informacionPreview.imagenSatisfechoURL = '';
    this.informacionPreview.imagenInsatisfechoUrl = '';
    this.formGroupResultadoEncuesta.get('comentario').setValue('');
    this.satisfechoSeleccionado = false;
    this.insatisfechoSeleccionado = false;
  }

  seleccionarSatisfechoInsatisfecho(opcionSeleccionada) {
    switch (opcionSeleccionada) {
      case 'satisfecho':
        this.satisfechoSeleccionado = true;
        this.insatisfechoSeleccionado = false;
        break;
      case 'insatisfecho':
        this.insatisfechoSeleccionado = true;
        this.satisfechoSeleccionado = false;
        break;
      default:
        break;
    }
  }

  guardarPreviewFalsamente() {
    Alertas.ok(
      'Éxito',
      '¡Se ha calificado exitosamente! Gracias por tomarse su tiempo para calificarnos.'
    );
    this.cerrarPreview();
  }

  ngOnInit() {}
}
