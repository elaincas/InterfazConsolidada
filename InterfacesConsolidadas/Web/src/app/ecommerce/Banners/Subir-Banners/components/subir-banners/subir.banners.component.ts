import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerDetalle } from '../../models/BannerDetalle';
import { Pagina } from '../../models/Pagina';
import { SubirBannersService, TitulosTab } from '../../services/subir.banners.service';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';
import { isUndefined, log } from 'util';
import { PaginaPosicion } from '../../models/PaginaPosicion';
import { LoginService } from '../../../../../login/services/login.service';
import { DxLookupComponent } from 'devextreme-angular';
import { VariablesGlobales } from '../../../../../helpers/VariablesGlobales';



@Component({
  selector: 'app-subir-banner',
  templateUrl: './subir.banners.component.html',
  styleUrls: ['./subir.banners.component.css'],
  providers: [SubirBannersService, LoginService]
})
export class SubirBannerComponent implements OnInit {
  constructor (private service: SubirBannersService, private loginService: LoginService) {
    this.banner = new BannerDetalle();
    this.bannerMovil = new BannerDetalle();
    this.bannerMiniatura = new BannerDetalle();
    this.paginaSeleccionada = new Pagina();
    this.posicionSeleccionada = new PaginaPosicion();
    this.paginas = new Array();
    this.mostrarPosicion = false;
    this.ocultarBanner = false;
    this.ocultarBannerMovil = false;
    this.minDate = new Date(Date.now());
    this.bannerConVersionMovil = false;
    this.bannerConMiniatura = false;
    this.bannerWebEspecificacion = new BannerDetalle();
    this.bannerMovilEspecificacion = new BannerDetalle();
    this.bannerMiniaturaEspecificacion = new BannerDetalle();

    this.bannerEditar = new BannerDetalle();
  }
  bannerEditar: BannerDetalle;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  url = '';
  urlMovil = '';
  urlMiniatura = '';
  placeHolderEnlace = '';

  // Modelos
  paginas: Array<Pagina>;
  bannersDePaginaSeleccionada: Array<any>;
  posiciones: Array<any>;
  banner: BannerDetalle;
  bannerMovil: BannerDetalle;
  bannerMiniatura: BannerDetalle;

  bannerWebEspecificacion: BannerDetalle;
  bannerMovilEspecificacion: BannerDetalle;
  bannerMiniaturaEspecificacion: BannerDetalle;

  ListaBanners: Array<any>;
  ListaBannersAsubir: Array<any>;

  // Control
  mostrarPosicion: boolean;
  bannerConVersionMovil: boolean;
  bannerConMiniatura: boolean;
  minDate: Date = new Date();
  ocultarBanner: boolean;
  ocultarBannerMovil: boolean;
  ocultarBannerMiniatura: boolean;
  esDimensionCorrecta = true;
  esDimensionMovilCorrecta = true;
  esDimensionMiniaturCorrecta = true;
  tipoBanner = '';

  public inputEnlaceRules = [
    {
      type: 'pattern',
      pattern: '^http(s)?://([\\w-]+.)+[\\w-]+(/[\\w- ./?%&=])?$',
      message: 'El enlace es inválido'
    }];

  // Controles FrontEnd
  @ViewChild('luePosicionPagina')
  private luePosicionPagina: DxLookupComponent;

  @ViewChild('luePagina')
  private luePagina: DxLookupComponent;

  @ViewChild('luePaginaPosicion')
  private luePaginaPosicion: DxLookupComponent;

  // @ViewChild('fuArchivoMiniatura')
  // private fuArchivoMiniatura: DxLookupComponent;

  // Seleccionados
  paginaSeleccionada: any;
  posicionSeleccionada: any;
  posicionSeleccionadaId: number;
  paginaSeleccionadaId: number;

  // Otros
  posicionBanner: Array<any>;
  titulosParaTab: TitulosTab[];

  mensajes: any = {
    Error_SeleccionarFechas: {
      titulo: '¡Error!',
      mensaje: 'Las fechas de Inicio y Finalización no pueden ser iguales'
    },
    Error_DimensionesIncorrectas: {
      titulo: 'Dimensiones Incorrectas',
      mensaje: 'Las dimensiones deben Ser'
    },
    Error_SeleccionarPagina: {
      titulo: '¡Error!',
      mensaje: 'Seleccione una Página'
    },
    Error_SeleccionarEmpresa: {
      titulo: '¡Error!',
      mensaje: 'Seleccione una Empresa'
    },
    Error_SeleccionarPais: {
      titulo: '¡Error!',
      mensaje: 'Seleccione un País'
    },
    Error_SeleccionarPaginaPosicion: {
      titulo: '¡Error!',
      mensaje: 'Seleccione la Posición del Banner en la Página'
    },
    Error_SeleccionarPosicion: {
      titulo: '¡Error!',
      mensaje: 'Seleccione la Posición del Banner en la Página'
    },
    Error_SeleccionarBanner: {
      titulo: '¡Error!',
      mensaje: 'Debe seleccionar una imagen para el Banner'
    },
    Error_IngresarEnlace: {
      titulo: '¡Error!',
      mensaje: 'Debe ingresar el enlace en la página donde estará el Banner'
    },
    Error_IngresarDescripcion: {
      titulo: '¡Error!',
      mensaje: 'Debe ingresar una descripción para el Banner'
    }
  };

  ngOnInit() {
    this.ObtenerPaginas();
    this.ObtenerListaDeDetallesDeBanners();
    this.titulosParaTab = this.service.getTitulosTab();
  }

  ObtenerPaginas() {
    if (this.banner.tieneFechaFinalizacion) {
    }
    this.service.ObtenerPaginas().subscribe(r => {
      this.paginas = r;
    });
  }

  checkBoxChanged() {
    // this.banner.tieneFechaFinalizacion = !this.banner.tieneFechaFinalizacion;
    // if (this.banner.tieneFechaFinalizacion ) {
    // }
    console.log(this.banner.tieneFechaFinalizacion);
  }

  ObtenerListaDeDetallesDeBanners() {
    this.service.ObtenerListaDeDetallesDeBanners().subscribe(r => {
      this.ListaBanners = r;
    });
  }

  ObtenerPosicionesDePaginaSeleccionada(paginaIdSeleccionada) {
    if (this.luePagina.value === 0) {
      return;
    }
    if (!isUndefined(this.paginas) && this.paginas.length > 0 && !isUndefined(paginaIdSeleccionada)) {
      this.service.ObtenerPosicionesPorPagina(paginaIdSeleccionada)
        .subscribe(r => {
          this.posiciones = r;
        });
      this.paginas.forEach(pagina => {
        if (pagina.paginaId === paginaIdSeleccionada) {
          this.paginaSeleccionada = pagina;
        }
      });
    }
  }

  ObtenerBannersDePosicionSeleccionada(posicionIdSeleccionada) {
    if (this.luePaginaPosicion.value === 0) {
      return;
    }
    if (!isUndefined(this.posiciones)) {
      this.posiciones.forEach(posicion => {
        if (posicion.paginaPosicionId === posicionIdSeleccionada) {
          this.posicionSeleccionada = posicion;
        }
      });
      this.service.ObtenerBannersPorPosicion(posicionIdSeleccionada)
        .subscribe(r => {
          this.bannersDePaginaSeleccionada = r;
          const esBannerMovil = this.bannersDePaginaSeleccionada.find(function (banner) {
            return banner.esVersionMovil === true;
          });
          if (esBannerMovil) {
            this.bannerConVersionMovil = true;
            this.bannerMovil.bannerId = esBannerMovil.bannerId;
            this.bannerMovil.banner = esBannerMovil;
            this.bannerMovilEspecificacion = esBannerMovil;
            this.bannerConMiniatura = false;
            this.ValidarDimensiones(this.bannerMovil);
          } else {
            this.bannerConVersionMovil = false;
            this.bannerMovil = new BannerDetalle;
            this.urlMovil = '';
          }

          if (this.posicionSeleccionada.bannerTipo === 1) {
            this.mostrarPosicion = true;
            this.obtenerPosicionesDeBannerEnCarrusel(this.bannersDePaginaSeleccionada);
          } else if (this.posicionSeleccionada.bannerTipo === 3) {
            this.banner.bannerTipo = 3;
            this.banner = new BannerDetalle;
            this.bannerConMiniatura = true;
            this.bannerConVersionMovil = false;
            this.bannerMiniatura.banner = this.posicionSeleccionada.banners[0];
            this.bannerMiniatura.bannerId = this.posicionSeleccionada.banners[0].bannerId;
            this.bannerMiniaturaEspecificacion = this.posicionSeleccionada.banners[0];
            this.ValidarDimensiones(this.bannerMiniatura);
            return;
          } else {
            this.mostrarPosicion = false;
          }
          this.banner.banner = this.posicionSeleccionada.banners[0];
          this.banner.bannerId = this.posicionSeleccionada.banners[0].bannerId;
          this.bannerWebEspecificacion = this.posicionSeleccionada.banners[0];
          this.ValidarDimensiones(this.banner);
        });
    }
  }

  obtenerPosicionesDeBannerEnCarrusel(cantidadMaxima: any) {
    this.posicionBanner = [];
    if(cantidadMaxima.length == 0)
    {
      this.posicionBanner.push(1);
    }
    else
    {
      for (let cantidad = 1; cantidad <= cantidadMaxima[0].cantidadMaximaDeBanners; cantidad++) {
        this.posicionBanner.push(cantidad);
      }
    }
  }

  ObtenerDetallesDelBanner(bannerDetalle: BannerDetalle): BannerDetalle {
    const banner = new BannerDetalle();
    banner.bannerId = bannerDetalle.bannerId;
    banner.banner = bannerDetalle.banner;
    banner.rutaBanner = bannerDetalle.rutaBanner;
    banner.fechaInicio_Visible = this.fechaInicio;
    banner.fechaFin_Visible = this.fechaFin;
    banner.posicion = this.banner.posicion;
    banner.keyName = this.paginaSeleccionada.nombre;
    banner.contentType = bannerDetalle.contentType;
    banner.carpeta = this.paginaSeleccionada.nombre;
    banner.dimensionX = bannerDetalle.dimensionX;
    banner.dimensionY = bannerDetalle.dimensionY;
    banner.usuarioAgrega = this.loginService.Usuario.id;
    banner.paginaId = this.paginaSeleccionadaId;
    banner.posicionId = this.posicionSeleccionadaId;
    banner.esVersionMovil = bannerDetalle.esVersionMovil;
    banner.nombreCorto = this.posicionSeleccionada.nombreCorto;
    banner.tieneFechaFinalizacion = this.banner.tieneFechaFinalizacion;
    banner.enlace = this.banner.enlace;
    banner.descripcion = this.banner.descripcion;
    banner.bannerTipo = this.banner.bannerTipo;
    banner.abrirEnlaceEnNuevaPestana = this.banner.abrirEnlaceEnNuevaPestana;
    banner.esEnlaceDeLaPagina = this.banner.esEnlaceDeLaPagina;
    return banner;
  }

  GuardarBanner() {
    this.ListaBannersAsubir = [];
    if (!this.bannerConMiniatura) {
      this.banner = this.ObtenerDetallesDelBanner(this.banner);
      this.banner.empresaId = parseInt(VariablesGlobales.CodigoEmpresa);
      this.banner.paisId = VariablesGlobales.PaisId;

      this.ListaBannersAsubir.push(this.banner);
      if (this.bannerConVersionMovil) {
        this.bannerMovil = this.ObtenerDetallesDelBanner(this.bannerMovil);
        this.bannerMovil.esVersionMovil = true;
        this.bannerMovil.empresaId = parseInt(VariablesGlobales.CodigoEmpresa);
        this.bannerMovil.paisId = VariablesGlobales.PaisId;
        this.ListaBannersAsubir.push(this.bannerMovil);
      }
    } else if (this.bannerConMiniatura) {
      this.bannerMiniatura = this.ObtenerDetallesDelBanner(this.bannerMiniatura);
      this.ListaBannersAsubir.push(this.bannerMiniatura);
    }
    if (this.ValidarBanner() === true) {
      Alertas.load();
      this.service.AgregarBanner(this.ListaBannersAsubir, this.bannerConVersionMovil, this.bannerConMiniatura)
        .subscribe(r => {
          Alertas.close();
          this.banner = r;
          this.Limpiar();
          Alertas.ok('¡Correcto!', 'Los datos han sido guardados correctamente');
        }, error => {
          Alertas.close();
          Alertas.error('¡ERROR!', error._body);
        }
        );
    }
  }

  ValidarBanner(): boolean {
    try {
      // Selección de Página
      if (isUndefined(this.paginaSeleccionadaId) || this.paginaSeleccionadaId === 0) {
        Alertas.error(this.mensajes.Error_SeleccionarPagina.titulo, this.mensajes.Error_SeleccionarPagina.mensaje);
        return false;
      }
      // Selección de Posición en la Página
      if (isUndefined(this.posicionSeleccionadaId) || this.posicionSeleccionadaId === 0) {
        Alertas.error(this.mensajes.Error_SeleccionarPaginaPosicion.titulo, this.mensajes.Error_SeleccionarPaginaPosicion.mensaje);
        return false;
      }
      // Selección de Posición
      if (this.banner.posicion === 0 && this.mostrarPosicion === true) {
        Alertas.error(this.mensajes.Error_SeleccionarPosicion.titulo, this.mensajes.Error_SeleccionarPosicion.mensaje);
        return false;
      }
      // Selección de Descripción
      if (this.banner.descripcion === '' || this.banner.descripcion == null) {
        Alertas.error(this.mensajes.Error_IngresarDescripcion.titulo, this.mensajes.Error_IngresarDescripcion.mensaje);
        return false;
      }
      // Selección de Banner

      if ((this.banner.rutaBanner === [] || isUndefined(this.banner.rutaBanner) || this.banner.rutaBanner.length === 0)
        && this.bannerConMiniatura === false) {
        Alertas.error(this.mensajes.Error_SeleccionarBanner.titulo, this.mensajes.Error_SeleccionarBanner.mensaje);
        return false;
      }

      // Selección de Banner Movil
      if ((this.bannerMovil.rutaBanner === []
        || isUndefined(this.bannerMovil.rutaBanner)
        || this.bannerMovil.rutaBanner.length === 0)
        && this.bannerConVersionMovil) {
        Alertas.error(this.mensajes.Error_SeleccionarBanner.titulo,
          this.mensajes.Error_SeleccionarBanner.mensaje + ' de la versión Móvil');
        return false;
      }

      // Selección de Banner Miniatura
      if ((this.bannerMiniatura.rutaBanner === []
        || isUndefined(this.bannerMiniatura.rutaBanner)
        || this.bannerMiniatura.rutaBanner.length === 0)
        && this.bannerConMiniatura) {
        Alertas.error(this.mensajes.Error_SeleccionarBanner.titulo,
          this.mensajes.Error_SeleccionarBanner.mensaje + ' de la versión Móvil');
        return false;
      }

      let BannerDimensionX_Correcta = 0;
      let BannerDimensionY_Correcta = 0;
      if (this.bannerConMiniatura === false) {
        // Dimensiones Banner
        const bannerWeb = this.ObtenerVersionDeArregloDeBanners(this.posicionSeleccionada.banners, false);
        BannerDimensionX_Correcta = bannerWeb.dimensionX;
        BannerDimensionY_Correcta = bannerWeb.dimensionY;
        if (this.banner.dimensionX > BannerDimensionX_Correcta
          || this.banner.dimensionX < BannerDimensionX_Correcta
          || this.banner.dimensionY > BannerDimensionY_Correcta
          || this.banner.dimensionY < BannerDimensionY_Correcta) {
          Alertas.error(`${this.mensajes.Error_DimensionesIncorrectas.titulo}`,
            `${this.mensajes.Error_DimensionesIncorrectas.mensaje}
          ${BannerDimensionX_Correcta}x${BannerDimensionY_Correcta} px para la versión Web`);
          this.QuitarBanner();
          return false;
        }
      }

      // Dimensiones Banner Movil
      if (this.bannerConVersionMovil) {
        const bannerMovil = this.ObtenerVersionDeArregloDeBanners(this.posicionSeleccionada.banners, true);
        if (!isUndefined(bannerMovil)) {
          BannerDimensionX_Correcta = bannerMovil.dimensionX;
          BannerDimensionY_Correcta = bannerMovil.dimensionY;

          if ((this.bannerMovil.dimensionX > BannerDimensionX_Correcta ||
            this.bannerMovil.dimensionX < BannerDimensionX_Correcta ||
            this.bannerMovil.dimensionY > BannerDimensionY_Correcta ||
            this.bannerMovil.dimensionY < BannerDimensionY_Correcta) && this.mostrarPosicion === true) {
            Alertas.error(`${this.mensajes.Error_DimensionesIncorrectas.titulo}`,
              `${this.mensajes.Error_DimensionesIncorrectas.mensaje}
              ${BannerDimensionX_Correcta}x${BannerDimensionY_Correcta}px para la versión móvil.`);
            this.QuitarBannerMovil();
            return false;
          }
        }
      }

      // Dimensiones Banner Miniatura
      if (this.bannerConMiniatura) {
        const bannerMiniatura = this.ObtenerVersionDeArregloDeBanners(this.posicionSeleccionada.banners, false);
        BannerDimensionX_Correcta = bannerMiniatura.dimensionX;
        BannerDimensionY_Correcta = bannerMiniatura.dimensionY;

        if ((this.bannerMiniatura.dimensionX > BannerDimensionX_Correcta ||
          this.bannerMiniatura.dimensionX < BannerDimensionX_Correcta ||
          this.bannerMiniatura.dimensionY > BannerDimensionY_Correcta ||
          this.bannerMiniatura.dimensionY < BannerDimensionY_Correcta) && this.mostrarPosicion === true) {
          Alertas.error(`${this.mensajes.Error_DimensionesIncorrectas.titulo}`,
            `${this.mensajes.Error_DimensionesIncorrectas.mensaje}
              ${BannerDimensionX_Correcta}x${BannerDimensionY_Correcta}px para la Miniatura.`);
          this.QuitarBannerMiniatura();
          return false;
        }
      }
    } catch (e) {
      Alertas.error('ERROR', e);
      return false;
    }
    // Seleccion de Fechas
    if (this.banner.fechaInicio_Visible.toDateString() === this.banner.fechaFin_Visible.toDateString()) {
      Alertas.question('', '¿Está seguro que desea que el banner sólo aparezca un día?')
        .catch(r => {
          return false;
        });
    }
    return true;
  }

  ValidarDimensiones(banner) {
    if (banner.dimensionX !== banner.banner.dimensionX ||
      banner.dimensionY !== banner.banner.dimensionY) {
      if (this.tipoBanner === 'web') {
        this.esDimensionCorrecta = false;
      } else if (this.tipoBanner === 'movil') {
        this.esDimensionMovilCorrecta = false;
      } else if (this.tipoBanner === 'miniatura') {
        this.esDimensionMiniaturCorrecta = false;
      }
    } else if (this.tipoBanner === 'web') {
      this.esDimensionCorrecta = true;
    } else if (this.tipoBanner === 'movil') {
      this.esDimensionMovilCorrecta = true;
    } else if (this.tipoBanner === 'miniatura') {
      this.esDimensionMiniaturCorrecta = true;
    }
  }

  ObtenerVersionDeArregloDeBanners(banners, esVersionMovil) {
    const bannerVersion = banners.find(function (bnr) {
      return bnr.esVersionMovil === esVersionMovil;
    });
    return bannerVersion;
  }

  Limpiar() {
    this.QuitarBannerMovil();
    this.QuitarBanner();
    this.luePosicionPagina.value = 0;
    this.luePagina.value = 0;
    this.luePaginaPosicion.value = 0;
  }

  ObtenerBannerSeleccionadoDxFileUploader(event: any) {
    if (event.value[0] && event.element.id === 'fuplBannerWeb') {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.banner.contentType = this.banner.rutaBanner[0].type;
        this.ObtenerDimensionesDeBannerSeleccionado();
      };
      reader.readAsDataURL(event.value[0]);
    }
  }

  ObtenerDimensionesDeBannerSeleccionado() {
    const img = new Image;
    const self = this;
    img.onload = function() {
      if (!isUndefined(self)) {
        self.banner.dimensionX = img.width;
        self.banner.dimensionY = img.height;
        self.tipoBanner = 'web';
        self.ValidarDimensiones(self.banner);
      }
    };
    img.src = this.url;
  }

  ObtenerBannerMovilSeleccionadoDxFileUploader(event: any) {
    if (event.value[0] && event.element.id === 'fuplBannerMovil') {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlMovil = event.target.result;
        this.bannerMovil.contentType = this.bannerMovil.rutaBanner[0].type;
        this.ObtenerDimensionesDeBannerMovilSeleccionado();
      };
      reader.readAsDataURL(event.value[0]);
    }
  }

  ObtenerDimensionesDeBannerMovilSeleccionado() {
    const img = new Image;
    const self = this;
    img.onload = function() {
      if (!isUndefined(self)) {
        self.bannerMovil.dimensionX = img.width;
        self.bannerMovil.dimensionY = img.height;
        self.tipoBanner = 'movil';
        self.ValidarDimensiones(self.bannerMovil);
      }
    };
    img.src = this.urlMovil;
  }

  ObtenerBannerMiniaturaSeleccionadoDxFileUploader(event: any) {
    if (event.value[0] && event.element.id === 'fuplBannerMiniatura') {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlMiniatura = event.target.result;
        this.bannerMiniatura.contentType = this.bannerMiniatura.rutaBanner[0].type;
        this.ObtenerDimensionesDeBannerMiniaturaSeleccionado();
      };
      reader.readAsDataURL(event.value[0]);
    }
  }

  ObtenerDimensionesDeBannerMiniaturaSeleccionado() {
    const img = new Image;
    const self = this;
    img.onload = function() {
      if (!isUndefined(self)) {
        self.bannerMiniatura.dimensionX = img.width;
        self.bannerMiniatura.dimensionY = img.height;
        self.tipoBanner = 'miniatura';
        self.ValidarDimensiones(self.bannerMiniatura);
      }
    };
    img.src = this.urlMiniatura;
  }

  OnEsEnlaceDeLaPagina(event) {
    if (this.banner.esEnlaceDeLaPagina) {
      this.placeHolderEnlace = 'ejemplo: /sorteo/siman';
    } else {
      this.placeHolderEnlace = 'ejemplo: https://www.enlace.com';
    }
  }
  QuitarBanner() {
    this.url = '';
    this.banner.rutaBanner = [];
  }

  QuitarBannerMovil() {
    this.urlMovil = '';
    this.bannerMovil.rutaBanner = [];
  }

  QuitarBannerMiniatura() {
    this.urlMiniatura = '';
    this.bannerMiniatura.rutaBanner = [];
  }

  OnOcultarBanner(ocultar: boolean) {
    this.ocultarBanner = ocultar;
  }

  OnOcultarBannerMovil(ocultar: boolean) {
    this.ocultarBannerMovil = ocultar;
  }

  OnOcultarBannerMiniatura(ocultar: boolean) {
    this.ocultarBannerMiniatura = ocultar;
  }
}
