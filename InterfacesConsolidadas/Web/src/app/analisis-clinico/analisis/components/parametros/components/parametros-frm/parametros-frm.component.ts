import { Component, OnInit } from '@angular/core';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { ActivatedRoute, Router } from '@angular/router';
import { DxTabsComponent } from 'devextreme-angular';
import validation_summary from 'devextreme/ui/validation_summary';
import { Forms } from '../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../helpers/notificaciones/notificaciones';
import { helpers } from '../../../../../../helpers/utils';
import { ACTipoRespuesta } from '../../../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../../../helpers/mensajes';
import { NivelResultado } from '../../../../models/nivelResultado.model';
import { Parametro } from '../../../../models/parametro.model';
import { ParametroGrupo } from '../../../../models/parametroGrupo.model';
import { ParametroRango } from '../../../../models/parametroRango.model';
import { RespuestaAC } from '../../../../models/respuestaAC';
import { ResultadoTipo } from '../../../../models/resultadoTipo.model';
import { UnidadDeMedida } from '../../../../models/unidadMedida.model';
import { ParametrosService } from '../../../../services/parametrosService';
import { Tab, TabService } from '../../../../services/tabs';
import { ResultadoTipoService } from '../../../../services/tiposDeResultadoService';
import { UnidadesDeMedidasService } from '../../../../services/unidadDeMedidaService';

@Component({
  selector: 'app-parametros-frm',
  templateUrl: './parametros-frm.component.html',
  styleUrls: ['./parametros-frm.component.css']
})
export class ParametrosFrmComponent implements OnInit {

  modo: Forms.Modo = Forms.Modo.Agregar;
  accion: string;
  parametro: Parametro;
  tiposResultado: ResultadoTipo[];
  unidadesMedida: UnidadDeMedida[];
  tabs: Tab[];
  tabComponent: string;
  readOnlyEditar: boolean = false;
  readOnlyAgregar: boolean = false;
  msj: any = MensajesGenericosAC;
  loadingVisible: boolean;
  cargandoParametroLoader: boolean;
  indexTab: number;

  constructor(private router: Router, private route: ActivatedRoute, private parametrosService: ParametrosService,
    private tabService: TabService, private unidadesDeMedidaService: UnidadesDeMedidasService, private tiposDeResultadoService: ResultadoTipoService) { }

  ngOnInit() {
    this.indexTab = 0;
    this.ConfigurarTabs();
    this.ConfigurarFormulario();
    this.loadingVisible = true
    this.CargarUnidadesMedida();
    this.CargarTiposDeResultado();
  }

  ConfigurarTabs(): void {
    this.tabs = this.tabService.getTabsParametros();
    this.tabComponent = this.tabs[0].componente;
  }

  selectTab(tab: DxTabsComponent) {
    if (tab.selectedIndex != 0) {
      if (!this.validarParametro()) {
        this.indexTab = 0;
        tab.selectedIndex = 0;
        this.tabComponent = this.tabs[0].componente;
        return;
      }
    }
    this.tabComponent = this.tabs[tab.selectedIndex].componente;
  }

  selectDirectTab(tab: DxTabsComponent) {
    if (tab.selectedIndex != 0) {
      let errorValidacion = false;
      errorValidacion = this.validarParametro();

      if (!errorValidacion) {
        Notificaciones.error("Para continuar debe de completar los datos del parámetro.");
        this.selectTab(tab);
        return;
      }
    }
    this.tabComponent = this.tabs[tab.selectedIndex].componente;
  }

  ConfigurarFormulario(): void {
    this.route.url.subscribe(rutas => {
      let ruta = rutas.find(x => x.path == 'NuevoParametro');
      if (!helpers.isNull(ruta)) {
        this.parametro = new Parametro;
        this.readOnlyAgregar = true;
        return;
      };

      this.modo = Forms.Modo.Actualizar;
      this.route.params.subscribe(params => {
        let ParametroId = params.ParametroId as number;
        this.CargarInformacionParametro(ParametroId);
      });

    });
  }

  CargarInformacionParametro(ParametroId: number): void {
    this.loadingVisible = true;
    this.cargandoParametroLoader = true
    this.parametrosService.ObtenerParametroPorId(ParametroId).subscribe(data => {
      this.readOnlyEditar = true;
      this.parametro = data as Parametro;
      this.loadingVisible = false;
      this.cargandoParametroLoader = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  CargarUnidadesMedida(): void {
    this.loadingVisible = true;
    this.unidadesDeMedidaService.ObtenerUnidadesDeMedidas().subscribe(data => {
      this.unidadesMedida = data.filter(x => x.activo == true) as UnidadDeMedida[];
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  CambioEnItem(e): void {
    let campoActualizado = e.dataField;
  }

  CargarTiposDeResultado(): void {
    this.loadingVisible = true;
    this.tiposDeResultadoService.ObtenerResultadoTipos().subscribe(data => {
      this.tiposResultado = data as ResultadoTipo[];
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  AnteriorTab(tab: DxTabsComponent): void {
    if (tab.selectedIndex != 0) {
      let errorValidacion = false;
      errorValidacion = this.validarParametro();

      if (!errorValidacion) {
        Notificaciones.error("Para continuar debe de completar los datos del parámetro.");
        return;
      }
    }
    tab.selectedIndex = tab.selectedIndex - 1;
    this.selectTab(tab);
  }

  SiguienteTab(tab: DxTabsComponent): void {
    if (tab.selectedIndex == 0) {
      let errorValidacion = false;
      errorValidacion = this.validarParametro();

      if (!errorValidacion) {
        Notificaciones.error("Para continuar debe de completar los datos del parámetro.");
        return;
      }
    }

    tab.selectedIndex = tab.selectedIndex + 1;
    this.selectTab(tab);
  }

  Guardar(): void {
    if (this.modo == Forms.Modo.Agregar) {
      this.GuardarParametro();
    } else {
      this.EditarParametro();
    }
  }

  validarParametro() {
    if (this.parametro.nombre == "" || this.parametro == undefined) return false;
    if (this.parametro.descripcion == "" || this.parametro.descripcion == undefined) return false;
    if (this.parametro.resultadoTipoId == undefined || this.parametro.resultadoTipoId < 0) return false;
    if (this.parametro.unidadDeMedidaId == undefined || this.parametro.unidadDeMedidaId < 0) return false;
    if (this.modo == Forms.Modo.Actualizar && (this.parametro.id == undefined || this.parametro.id < 0)) return false;
    if(this.parametro == undefined) return false;
    return true;
  }

  GuardarParametro() {
    this.loadingVisible = true;

    let parametroGuardar = this.parametro;

    parametroGuardar.unidadDeMedida = new UnidadDeMedida;
    parametroGuardar.resultadoTipo = new ResultadoTipo;

    if (parametroGuardar.parametroRangos != undefined) {
      parametroGuardar.parametroRangos.forEach(pr => {
        pr.nivelResultado = new NivelResultado;
        pr.parametroGrupo = new ParametroGrupo;
      });
    }

    this.parametrosService.GuardarParametro(parametroGuardar).subscribe(data => {
      let respuesta = data as RespuestaAC<Parametro>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(respuesta.data.mensaje)
        this.router.navigate(['/AnalisisClinicos/Parametros']);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje)
      }
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EditarParametro() {
    this.loadingVisible = true;
    let parametroEditar = this.parametro;

    parametroEditar.unidadDeMedida = new UnidadDeMedida;
    parametroEditar.resultadoTipo = new ResultadoTipo;
    parametroEditar.parametroRangos.forEach(pr => {
      pr.nivelResultado = null;
      pr.parametroGrupo = null;
    });
    this.parametrosService.EditarParametro(parametroEditar).subscribe(data => {
      let respuesta = data as RespuestaAC<Parametro>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(respuesta.data.mensaje)
        this.router.navigate(['/AnalisisClinicos/Parametros']);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Validacion) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje)
      }
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }
  mostrarLoader(): void {
    this.loadingVisible = true;
  }

  ocultarLoader(): void {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 1);
  }

}
