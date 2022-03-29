import { Component, OnInit } from '@angular/core';
// import {ProductosCarruselService} from '../services/productos-carrusel.service';
import { LoginService } from '../../../login/services/login.service';
import { isUndefined } from 'util';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { NotificacionesPushService } from '../_services/notificaciones-push.service';
import { GuardarNotificacion } from '../_models/GuardarNotificacion';

declare var twemoji: any;

@Component({
  selector: 'notificaciones-push-listado',
  templateUrl: './listado-notificaciones.component.html',
  styleUrls: ['./listado-notificaciones.component.css'],
  providers: [NotificacionesPushService]
})
export class ListadoNotificacionesComponent implements OnInit {

  // Variables de control
  MostrarPanelAceptacionPruebas: boolean = false;
  MostrarFormularioDatos: boolean = true;
  estaEnviandoNotificaciones: boolean = false;
  TextoBotonEnviar: string = "Enviar";
  now: Date = new Date();
  listaTiposDestinatario = [
    { "id": 1, "texto": "Todos los usuarios" },
    { "id": 2, "texto": "Tema" },
    // { "id": 3, "texto": "Tokens" },
    // { "id": 4, "texto": "Usuarios específicos" },
  ];
  listaTiposEnvio = [
    { "id": 1, "texto": "Inmediatamente" },
    { "id": 2, "texto": "Entrega a futuro" },
  ];
  historialNotificaciones: any;

  // Variables persistentes 
  tipoEnvioSeleccionado: number;
  tipoDestinatarioSeleccionado: number;
  notificacionDestinatarioTema: string;
  notificacionTitulo: string;
  notificacionContenido: string;
  notificacionEnvioFecha: Date = this.now;
  esEnvioDePrueba: boolean = true;
  urlToRedirect: string = "";

  constructor(
    private notificacionesPushService: NotificacionesPushService
  ) { }

  ngOnInit() {
    this.Limpiar();
    this.ObtenerHistorial();
    //   this.configurarModoFormulario();
    //   this.ObtenerTiposDeCarrusel();
  }

  ObtenerHistorial() {
    this.notificacionesPushService.ObtenerHistorial().subscribe(r => {
      this.historialNotificaciones = r.json()
      setTimeout(function () {
        twemoji.parse(document.body);
        setTimeout(function () {
          $('.emoji').css('width', '16px')
        }, 100);
      }, 400);
    });
  }

  TipoDeEntregaChange(tipoEntregaSeleccionado: number) {
    if (isUndefined(tipoEntregaSeleccionado) || tipoEntregaSeleccionado === null) {
      return;
    }

    if (tipoEntregaSeleccionado == 2) {
      this.TextoBotonEnviar = "Guardar";
    }
    else
      this.TextoBotonEnviar = "Enviar";

  }

  get esEnvioInmediato(): boolean {
    return this.tipoEnvioSeleccionado == 1;
  }

  get esEnvioAFuturo(): boolean {
    return this.tipoEnvioSeleccionado == 2;
  }

  get esEnvioATodosLosUsuarios(): boolean {
    return this.tipoDestinatarioSeleccionado == 1;
  }

  get esEnvioATema(): boolean {
    return this.tipoDestinatarioSeleccionado == 2;
  }

  get esEnvioAUsuariosEspecificos(): boolean {
    return this.tipoDestinatarioSeleccionado == 3;
  }

  TipoDestinatarioChange(tipoDestinatarioSeleccionado: number) {
    if (isUndefined(tipoDestinatarioSeleccionado) || tipoDestinatarioSeleccionado === null) {
      return;
    }

  }

  // buscarProductos(options: any): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     const textoBusqueda = this.dataSourceProductos.searchValue();
  //     this.serviceCarrusel.ObtenerProductosPorDescripcion(textoBusqueda)
  //       .then(data => resolve(data));
  //   });
  // }

  CancelarEnvioNotificacion() {
    this.MostrarPanelAceptacionPruebas = false;
    this.esEnvioDePrueba = true;
  }

  GuardarNotificacion() {
    if (!this.ValidarDatos()) {
      return;
    }

    this.estaEnviandoNotificaciones = true;
    Alertas.load();
    var notificacion = new GuardarNotificacion(this.tipoDestinatarioSeleccionado,
      this.notificacionTitulo, this.notificacionContenido,
      this.esEnvioDePrueba ? [ "479", "65562", "73409", "38993", "18235", "22602" ] :
        this.esEnvioATema ? [this.notificacionDestinatarioTema] : [],
      this.esEnvioDePrueba, this.urlToRedirect, { titulo: this.notificacionTitulo });

    this.notificacionesPushService.RegistrarNotificacion(notificacion)
      .subscribe(r => {

        if (this.esEnvioDePrueba) {
          this.MostrarPanelAceptacionPruebas = true;
          this.esEnvioDePrueba = false;
          Alertas.close();
        }
        else {
          Alertas.ok("¡Éxito!", this.esEnvioAFuturo ? "La notificación ha sido programada" : "La notificación está siendo enviada");
          this.ObtenerHistorial();
          this.Limpiar();
        }
      }, error => {
        Alertas.showHttpResponse(error, '¡Error!', false);
      }).add(() => {
        this.estaEnviandoNotificaciones = false;
      });

  }

  NuevaNotificacion() {
    this.MostrarFormularioDatos = true;
  }

  Cancelar() {
    this.MostrarFormularioDatos = false;
    //   if (this.ValidarDatos(true)) {
    //     Alertas.question('', `¿Está seguro que desea borrar todas los datos ingresados hasta el momento?`).then(r => {
    this.Limpiar();
    //       if (this.modo === Forms.Modo.Actualizar) {
    //         this.router.navigate(['ecommerce/productosCarrusel/listadoCarruseles']);
    //       }
    //     });
    //   }
  }

  ValidarDatos(): boolean {
    if (isUndefined(this.tipoEnvioSeleccionado) || this.tipoEnvioSeleccionado <= 0) {
      Alertas.warning('', `Debe seleccionar un tipo de envío`);
      return false;
    }
    if (isUndefined(this.tipoDestinatarioSeleccionado) || this.tipoDestinatarioSeleccionado <= 0) {
      Alertas.warning('', `Debe seleccionar el tipo de destinatario`);
      return false;
    }

    if (this.notificacionTitulo.trim().length <= 0) {
      Alertas.warning('', `Ingrese el título de la notificación`);
      return false;
    }

    if (this.notificacionTitulo.trim().length <= 0) {
      Alertas.warning('', `Ingrese el contenido de la notificación`);
      return false;
    }

    return true;
  }

  Limpiar() {
    this.now = new Date();
    this.TextoBotonEnviar = "Enviar";
    this.MostrarPanelAceptacionPruebas = false;

    this.esEnvioDePrueba = true;
    this.tipoDestinatarioSeleccionado = 0;
    this.tipoEnvioSeleccionado = 0;
    this.notificacionDestinatarioTema = null;
    this.notificacionTitulo = "";
    this.notificacionContenido = "";
    this.urlToRedirect = "";
    this.notificacionEnvioFecha = null;
  }
}
