import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { UsuarioProcesoBloqueoConfiguracionRequest } from './../models/UsuarioProcesoBloqueoConfiguracion';
import { LoginService } from './../../../login/services/login.service';
import { UsuarioAtributoBloqueoConfiguracionRequest, AtributoProcesosBloqueo } from './../models/UsuarioAtributoBloqueoConfiguracion';
import { UsuariosService } from './../usuarios.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { UsuarioAtributo } from '../models/UsuarioAtributo';
import { ProcesoBloqueoConfiguracion } from '../models/UsuarioProcesoBloqueoConfiguracion';
import { UsuarioProceso } from '../models/UsuarioProceso';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-bloqueo-de-procesos',
  templateUrl: './bloqueo-de-procesos.component.html',
  styles: []
})
export class BloqueoDeProcesosComponent implements OnInit {
  @ViewChild('formAtributosProcesos') formAtributosProcesos: DxFormComponent;
  loadingDataGridVisible = false;
  popupProcesosVisible = false;

  usuarioAtributoBloqueoConfiguracionRequest: UsuarioAtributoBloqueoConfiguracionRequest;
  usuarioProcesoBloqueoConfiguracionRequest: UsuarioProcesoBloqueoConfiguracionRequest;

  atributos: UsuarioAtributo[] = [];
  procesosList: UsuarioProceso[] = [];
  procesosDataSource: DataSource;
  atributosProcesosBloqueados: AtributoProcesosBloqueo[] = [];

  constructor(private usuarioService: UsuariosService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.usuarioAtributoBloqueoConfiguracionRequest = {
      usuarioId: this.loginService.Usuario.id,
      usuarioAtributoId: undefined,
      valor: '',
      procesosId: []
    };
    this.usuarioProcesoBloqueoConfiguracionRequest = {
      atributoBloqueoId: undefined,
      procesoId: undefined
    };
    this.usuarioService.obtenerAtributosDeUsuario().subscribe(r => this.atributos = r);
    const that = this;
    this.procesosDataSource = new DataSource({
      store: new CustomStore({
        loadMode: 'raw',
        key: 'id',
        load: function () {
          return that.usuarioService.obtenerProcesosDeUsuario().toPromise();
        }
      })
    });
    this.cargarDataGrid();
  }

  cargarDataGrid() {
    this.loadingDataGridVisible = true;
    this.usuarioService.obtenerAtributosProcesosBloqueados()
      .subscribe(r => this.atributosProcesosBloqueados = r,
        error => Alertas.showHttpResponse(error),
        () => this.loadingDataGridVisible = false);
  }

  guardarConfiguracionBloqueAtributo() {
    Alertas.question('', '¿Desea registrar el bloqueo de este atributo?', 'Sí', 'No').then(() => {
      Alertas.load();
      this.usuarioService.configurarBloqueoAtributo(this.usuarioAtributoBloqueoConfiguracionRequest)
        .subscribe(r => {
          Alertas.close();
          Alertas.ok('¡Exito!', 'Se registro el bloqueo del atributo con exito.');
          this.formAtributosProcesos.instance.resetValues();
          this.cargarDataGrid();
        }, error => {
          Alertas.showHttpResponse(error);
        });
    });
  }

  modalBloquearProcesoAtributo(atributoProcesos: AtributoProcesosBloqueo) {
    Alertas.load();
    this.usuarioService.obtenerProcesosDeUsuario().subscribe(r => {
      Alertas.close();
      this.usuarioProcesoBloqueoConfiguracionRequest.atributoBloqueoId = atributoProcesos.usuarioAtributoBloqueoConfiguracionId;
      this.usuarioProcesoBloqueoConfiguracionRequest.procesoId = undefined;
      this.procesosList = r.filter(el =>
        atributoProcesos.procesos.findIndex(x => x.procesoId === el.id) < 0);
      this.popupProcesosVisible = true;
    }, error => Alertas.showHttpResponse(error));
  }

  bloquearProcesoAtributo() {
    Alertas.question('', '¿Desea registrar el bloqueo de este proceso?', 'Sí', 'No').then(() => {
      Alertas.load();
      this.usuarioService.configurarBloqueoProceso(this.usuarioProcesoBloqueoConfiguracionRequest)
        .subscribe(r => {
          Alertas.close();
          Alertas.ok('¡Exito!', 'Se registro el bloqueo del proceso con exito.');
          this.cargarDataGrid();
        }, error => {
          Alertas.showHttpResponse(error);
        });
    });
  }

  cambiarEstadoAtributo(atributoProcesos: AtributoProcesosBloqueo) {
    this.loadingDataGridVisible = true;
    this.usuarioService.cambiarEstadoAtributoBloqueo(atributoProcesos.usuarioAtributoBloqueoConfiguracionId,
      !atributoProcesos.esActivo).subscribe(response => {
        if (response) {
          atributoProcesos.esActivo = !atributoProcesos.esActivo;
        }
      },
        error => Alertas.showHttpResponse(error),
        () => this.loadingDataGridVisible = false
      );
  }

  cambiarEstadoProceso(procesoBloqueo: ProcesoBloqueoConfiguracion) {
    this.loadingDataGridVisible = true;
    this.usuarioService.cambiarEstadoProcesoBloqueo(procesoBloqueo.usuarioProcesoBloqueoConfiguracionId,
      !procesoBloqueo.esActivo).subscribe(response => {
        if (response) {
          procesoBloqueo.esActivo = !procesoBloqueo.esActivo;
        }
      },
        error => Alertas.showHttpResponse(error),
        () => this.loadingDataGridVisible = false
      );
  }
}
