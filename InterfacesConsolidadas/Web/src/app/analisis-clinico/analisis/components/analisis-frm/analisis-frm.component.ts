import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Forms } from '../../../../helpers/forms';
import { helpers } from '../../../../helpers/utils';
import { AnalisisClinicoService } from '../../../analisis-clinico.service';
import { Analisis } from '../../models/analisis.model';
import { ProductoAnalisis } from '../../models/productoAnalisis';
import { Tab, TabService } from '../../services/tabs';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { Categoria } from '../../models/categorias.model';
import { MuestraTipo } from '../../models/muestraTipo.model';
import { DxTabsComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { RespuestaAC } from '../../models/respuestaAC';
import { Alertas, Notificaciones } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { min } from 'rxjs/operator/min';
import { TimeSpan } from '../../helpers/timeSpan';

@Component({
  selector: 'app-analisis-frm',
  templateUrl: './analisis-frm.component.html',
  styleUrls: ['./analisis-frm.component.css']
})
export class AnalisisFrmComponent implements OnInit {
  modo: Forms.Modo = Forms.Modo.Agregar;
  accion: string;
  analisis: Analisis;
  productosAnalisis: ProductoAnalisis[] = [];
  categorias: Categoria[] = [];
  tipoDeMuestras: MuestraTipo[] = [];
  tabs: Tab[];
  tabComponent: string;
  readOnlyEditar: boolean = false;
  readOnlyAgregar: boolean = false;
  msj: any = MensajesGenericosAC;
  loadingVisible: boolean;
  cargandoAnalisisMostrarLoader: boolean;
  indexTab: number;
  fecha: Date = new Date(2018, 9, 16, 15, 8, 12);
  mensaje: string;
  constructor(private router: Router, private route: ActivatedRoute, private analisisService: AnalisisClinicoService,
    private tabService: TabService) {}

  ngOnInit() {
      this.indexTab = 0;
    this.ConfigurarTabs();

      this.CargarProductosAnalisis();
      this.CargarCategorias();
      this.CargarTiposDeMuestras();
      this.ConfigurarFormulario();
  }

  ConfigurarTabs(): void {
    this.tabs = this.tabService.getTabs();
    this.tabComponent = this.tabs[0].componente;
  }

  validarTabAnalisis(){
    let analisis = this.analisis;
    if(analisis.prodId == undefined || analisis.prodId == ""  || analisis.categoriaId == undefined || analisis.categoriaId < 0 ||
     analisis.muestraTipoId == undefined || analisis.muestraTipoId < 0 || analisis.nombre == "" || analisis.nombre == undefined ) return false;
    return true;
  }

  selectTab(tab: DxTabsComponent) {
    if (tab.selectedIndex != 0 && !this.validarTabAnalisis()) {
      if (!this.validarTabAnalisis()) {
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
      if (!this.validarTabAnalisis()) {
          this.selectTab(tab);
          Notificaciones.error("Datos incompletos");
          return;
      }
    }
    this.tabComponent = this.tabs[tab.selectedIndex].componente;
  }

  ConfigurarFormulario(): void {
    this.route.url.subscribe(rutas => {
      let ruta = rutas.find(x => x.path == 'NuevoAnalisis');
      if (!helpers.isNull(ruta)) {
        this.analisis = new Analisis;
        this.analisis.fechaAgrega = new Date();
        this.analisis.activo = true;
        this.readOnlyAgregar = true;
        this.analisis.tiempoDeEntrega = "00:00:00";
        this.analisis.precioPublico = 0;
        return;
      };

      this.modo = Forms.Modo.Actualizar;
      this.route.params.subscribe(params => {
        let AnalisisId = params.AnalisisId as string;
        this.CargarInformacionAnalisis(AnalisisId);
      });

    });
  }

    CargarInformacionAnalisis(AnalisisId: string): void {
    this.mensaje = "Obteniendo información"
    this.loadingVisible = true;
    this.cargandoAnalisisMostrarLoader = true
     this.analisisService.ObtenerAnalisisPorId(AnalisisId).subscribe(data => {
      this.readOnlyEditar = true;
      this.analisis = data as Analisis;
      let dias = TimeSpan.fromMilliseconds(this.analisis.totalMilisegundos).days;
      let horas = TimeSpan.fromMilliseconds(this.analisis.totalMilisegundos).hours;
      let minutos = TimeSpan.fromMilliseconds(this.analisis.totalMilisegundos).minutes;

       this.analisis.tiempoDeEntrega = `${dias < 10 ? '0' + dias : dias}:${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`
      this.loadingVisible = false;
      this.cargandoAnalisisMostrarLoader = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  CargarProductosAnalisis(): void {
    this.loadingVisible = true;
    this.analisisService.ObtenerProductosAnalisis().subscribe(data => {
      this.productosAnalisis = data as ProductoAnalisis[];
      this.productosAnalisis.forEach(x =>{
        x.display = x.productoId + "   " + x.descripcion;
      });
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  CambioEnItem(e): void {
    let campoActualizado = e.dataField;

    if (e.value === undefined) return;
    if (this.productosAnalisis === undefined) return;
    if (this.tipoDeMuestras === undefined) return;
    if (this.categorias === undefined) return;

    if (campoActualizado == "prodId" && e.value != undefined && this.modo == Forms.Modo.Agregar) {
      if(this.productosAnalisis != undefined){
        this.analisis.nombre = this.productosAnalisis.find(p => p.productoId == e.value) != undefined ? this.productosAnalisis.find(p => p.productoId == e.value).descripcion : "";
      }
    }

    if (campoActualizado == "nombre" && e.value != undefined && this.modo == Forms.Modo.Agregar) {
      if (this.productosAnalisis.find(p => p.descripcion == e.value) != undefined) {
        this.analisis.prodId = this.productosAnalisis.find(p => p.descripcion == e.value).productoId;
      }
    }

    if (campoActualizado == "categoriaId" && e.value != undefined) {
      if (this.categorias.find(c => c.id == e.value) != undefined) {
        this.analisis.categoria = this.categorias.find(c => c.id == e.value);
      }
    }

    if (campoActualizado == "muestraTipoId" && e.value != undefined) {
      if (this.tipoDeMuestras.find(tm => tm.id == e.value) != undefined) {
        this.analisis.muestra = this.tipoDeMuestras.find(tm => tm.id == e.value);
      }
    }

  }

  CargarCategorias(): void {
    this.loadingVisible = true;
    this.analisisService.ObtenerCategorias().subscribe(data => {
      this.categorias = data.filter(x => x.activo == true) as Categoria[];
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  CargarTiposDeMuestras(): void {
    this.loadingVisible = true;
    this.analisisService.ObtenerMuestrasTipos().subscribe(data => {
      this.tipoDeMuestras = data.filter(x => x.activo == true) as MuestraTipo[];
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  AnteriorTab(tab: DxTabsComponent, e): void {
    if (tab.selectedIndex != 0) {
      if(e.validationGroup != undefined){
        const res = e.validationGroup.validate();
      if (!res.isValid) {
        Notificaciones.error("Datos incompletos");
        return;
      }
      }
    }
    tab.selectedIndex = tab.selectedIndex - 1;
    this.selectTab(tab);
  }

  SiguienteTab(tab: DxTabsComponent, e): void {
    if(e.validationGroup != undefined){
      const res = e.validationGroup.validate();
    if (!res.isValid) {
      Notificaciones.error("Datos incompletos");
      return;
    }
    }

    tab.selectedIndex = tab.selectedIndex + 1;
    this.selectTab(tab);
  }

  Guardar(): void {
    if (this.modo == Forms.Modo.Agregar) {
      this.GuardarAnalisis();
    } else {
      this.EditarAnalisis();
    }
  }

  GuardarAnalisis() {
    this.mensaje = "Guardando información...";
    this.loadingVisible = true;

    let analisisGuardar = this.analisis;

    analisisGuardar.categoria = new Categoria;
    analisisGuardar.muestra = new MuestraTipo;
    if (analisisGuardar.tiempoDeEntrega.length == 6) {
      let dias = analisisGuardar.tiempoDeEntrega.substring(0, 2);
      let horas = analisisGuardar.tiempoDeEntrega.substring(2, 4);
      let minutos = analisisGuardar.tiempoDeEntrega.substring(4, 6)

      let diasMili = TimeSpan.fromTime(Number(dias), Number(horas), Number(minutos), 0, 0);
      analisisGuardar.totalMilisegundos = diasMili.totalMilliseconds;
    }
    if (analisisGuardar.tiempoDeEntrega.length == 8) {
      let dias = analisisGuardar.tiempoDeEntrega.substring(0, 2);
      let horas = analisisGuardar.tiempoDeEntrega.substring(3, 5);
      let minutos = analisisGuardar.tiempoDeEntrega.substring(6, 8)

      let diasMili = TimeSpan.fromTime(Number(dias), Number(horas), Number(minutos), 0, 0);
      analisisGuardar.totalMilisegundos = diasMili.totalMilliseconds;
    }
    this.analisisService.GuardarAnalisis(analisisGuardar).subscribe(data => {
      let respuesta = data as RespuestaAC<Analisis>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(respuesta.data.mensaje)
        this.router.navigate(['/AnalisisClinicos/Analisis']);
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.error, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == ACTipoRespuesta.Error) {
        Alertas.error(MensajesGenericosAC.errorValidacion, respuesta.mensaje)
      }
      this.loadingVisible = false;
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EditarAnalisis() {
    this.mensaje = "Editando información...";
    this.loadingVisible = true;
    let analisisGuardar = this.analisis;

    analisisGuardar.categoria = new Categoria;
    analisisGuardar.muestra = new MuestraTipo;

    if (analisisGuardar.tiempoDeEntrega.length == 6) {
      let dias = analisisGuardar.tiempoDeEntrega.substring(0, 2);
      let horas = analisisGuardar.tiempoDeEntrega.substring(2, 4);
      let minutos = analisisGuardar.tiempoDeEntrega.substring(4, 6)

      let diasMili = TimeSpan.fromTime(Number(dias), Number(horas), Number(minutos), 0, 0);
      analisisGuardar.totalMilisegundos = diasMili.totalMilliseconds;
    }
    if (analisisGuardar.tiempoDeEntrega.length == 8) {
      let dias = analisisGuardar.tiempoDeEntrega.substring(0, 2);
      let horas = analisisGuardar.tiempoDeEntrega.substring(3, 5);
      let minutos = analisisGuardar.tiempoDeEntrega.substring(6, 8)

      let diasMili = TimeSpan.fromTime(Number(dias), Number(horas), Number(minutos), 0, 0);
      analisisGuardar.totalMilisegundos = diasMili.totalMilliseconds;
    }

    this.analisisService.EditarAnalisis(analisisGuardar).subscribe(data => {
      let respuesta = data as RespuestaAC<Analisis>;
      if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
        Alertas.info(respuesta.data.mensaje)
        this.router.navigate(['/AnalisisClinicos/Analisis']);
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
