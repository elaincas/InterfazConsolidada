import { Component, OnInit, ViewChild } from '@angular/core';
import { EncuestasService } from '../../services/encuestas.service';
import { ReporteNPS } from '../../models/reporte-nps.model';
import { DxDataGridComponent } from 'devextreme-angular';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import CustomStore from 'devextreme/data/custom_store';
import { TipoPregunta } from '../../models/tipoPregunta.model';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'app-reporte-pedidos-nps',
  templateUrl: './reporte-pedidos-nps.component.html',
  styleUrls: ['./reporte-pedidos-nps.component.css'],
})
export class ReportePedidosNpsComponent implements OnInit {
  reporte: ReporteNPS;
  @ViewChild('dxDataGridListadoRespuestas')
  dataGridListadoRespuestas: DxDataGridComponent;
  formGroupResultadoEncuesta: FormGroup;

  idPregunta: number;

  _mostrarPopup: boolean;

  tiposPreguntasTipo = TipoPregunta;

  informacionPreview: any;
  calificaciones: any;

  constructor(
    private _encuestasService: EncuestasService,
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.idPregunta = null;
    this._mostrarPopup = false;
    this.calificaciones = {};
    this.formGroupResultadoEncuesta = this._formBuilder.group({
      comentario: new FormControl(''),
    });

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

        params = params.set('tipoPreguntaId', '2');

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

    this.informacionPreview = {
      id: -1,
      descripcion: '',
      imagenSatisfechoUrl: '',
      imagenInsatisfechoUrl: '',
    };
  }

  ngOnInit() {
    this._encuestasService.obtenerReporteEncuestasNPS().subscribe(
      (res: ReporteNPS) => {
        this.reporte = res as ReporteNPS;
      },
      (err) => {}
    );
  }

  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
  }

  recargarGridCalificaciones() {
    this.dataGridListadoRespuestas.instance.refresh();
    this.focusDataGridListadoRespuestas();
  }

  verTodasLasCalificaciones() {
    this.idPregunta = null;
    this.recargarGridCalificaciones();
  }

  focusDataGridListadoRespuestas() {
    document.getElementById('dataGridListadoRespuestas').scrollIntoView();
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
  }

  guardarPreviewFalsamente() {
    Alertas.ok(
      'Éxito',
      '¡Se ha calificado exitosamente! Gracias por tomarse su tiempo para calificarnos.'
    );
    this.cerrarPreview();
  }
}
