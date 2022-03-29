import {LoginService} from '../../../../../login/services/login.service';
import {SubirBannersService, TitulosTab} from '../../services/subir.banners.service';
import {Component, OnInit} from '@angular/core';
import {BannerDetalle} from '../../models/BannerDetalle';
import {isUndefined} from 'util';
import {ActivatedRoute, Router} from '@angular/router';
import {Alertas} from '../../../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'app-editar-banner',
  templateUrl: './editar.banner.component.html',
  providers: [SubirBannersService, LoginService]
})
export class EditarBannerComponent implements OnInit {
  constructor(private service: SubirBannersService,
              private loginService: LoginService,
              private router: Router,
              private route: ActivatedRoute) {
  this.banner = new BannerDetalle();
  this.minDate = new Date(Date.now());
  this.carpeta = '';
  }

  banner: BannerDetalle;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  minDate: Date = new Date();
  ocultarBanner = false;
  url = '';
  carpeta = '';
  posicionBanner: any;
  seSeleccionoBannerNuevo = false;
  placeHolderEnlace = '';
  esDimensionCorrecta = true;

  ngOnInit() {
    this.CargarBanner();
  }

  OnOcultarBanner(ocultar: boolean) {
    this.ocultarBanner = ocultar;
  }

  ObtenerBannerSeleccionadoDxFileUploader(event: any) {    
    if (event.value[0] && event.element.id === 'fuplBannerWeb') {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.banner.contentType = this.banner.rutaBanner[0].type;
        this.seSeleccionoBannerNuevo = true;
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
        self.ValidarDimensiones();
      }
    };
    img.src = this.url;
  }

  ValidarDimensiones() {
    this.esDimensionCorrecta = true;
    if (this.banner.dimensionX !== this.banner.banner.dimensionX ||
        this.banner.dimensionY !== this.banner.banner.dimensionY) {
      this.esDimensionCorrecta = false;
    }
  }

  obtenerPosicionesDeBannerEnCarrusel(cantidadMaxima: any) {
    this.posicionBanner = [];
    for (let cantidad = 1; cantidad <= cantidadMaxima; cantidad++) {
      this.posicionBanner.push(cantidad);
    }
  }

  ObtenerBanner(banner: number, carpeta: string) {
    this.carpeta = carpeta;
    this.banner = new BannerDetalle();
    this.service.ObtenerBannerAEditar(banner)
      .subscribe(r => {
        this.banner = r;
        this.url = this.banner.rutaImagen;
        this.fechaInicio = this.banner.fechaInicio_Visible;
        this.fechaFin = this.banner.fechaFin_Visible;
        var hoy = new Date(Date.now());
        var fechaInicio = new Date(this.fechaInicio);
        this.minDate = fechaInicio < hoy ? this.banner.fechaInicio_Visible : hoy;
        this.obtenerPosicionesDeBannerEnCarrusel(this.banner.banner.cantidadMaximaDeBanners);
        console.log(this.banner);
      });
  }
  
  CargarBanner() {
    this.route.params.subscribe(params => {
      const banner = params.banner as number;
      const carpeta = params.pagina as string;
      this.ObtenerBanner(banner, carpeta);
    });
  }

  EditarBanner() {
    Alertas.load();
    this.banner = this.ObtenerDetallesDelBanner(this.banner);
    this.banner.usuarioModifica = this.loginService.Usuario.id;
    this.banner.carpeta = this.carpeta;
    this.service.EditarBanner(this.banner, this.carpeta, this.seSeleccionoBannerNuevo).subscribe(r => {
      Alertas.ok('Actualizado', 'El banner ha sido modificado');
      this.Limpiar();
      this.Cancelar();
    }, error => {
      Alertas.error('¡ERROR!', error._body);
    });
  }

  Cancelar() {
    this.router.navigate(['ecommerce/banners/lista-banners']);
  }

  ObtenerDetallesDelBanner(bannerDetalle: BannerDetalle): BannerDetalle {
    const banner = new BannerDetalle();
    banner.bannerDetalleId = bannerDetalle.bannerDetalleId;
    banner.bannerId = bannerDetalle.bannerId;
    banner.banner = bannerDetalle.banner;
    banner.rutaBanner = bannerDetalle.rutaBanner;
    banner.rutaImagen = bannerDetalle.rutaImagen;
    banner.fechaInicio_Visible = this.fechaInicio;
    banner.fechaFin_Visible = this.fechaFin;
    banner.posicion = this.banner.posicion;
    banner.contentType = bannerDetalle.contentType;
    banner.dimensionX = bannerDetalle.dimensionX;
    banner.dimensionY = bannerDetalle.dimensionY;
    banner.usuarioAgrega = this.loginService.Usuario.id;
    banner.esVersionMovil = this.banner.esVersionMovil;
    banner.tieneFechaFinalizacion = this.banner.tieneFechaFinalizacion;
    banner.enlace = this.banner.enlace;
    banner.carpeta = this.banner.carpeta;
    banner.descripcion = this.banner.descripcion;
    banner.paginaId = this.banner.paginaId;
    banner.posicionId = this.banner.banner.paginaPosicionId;
    return banner;
  }

  Limpiar() {
    this.banner = new BannerDetalle();
    this.url = '';
    this.seSeleccionoBannerNuevo = false;
  }

  OnEsEnlaceDeLaPagina(evento) {
    if (this.banner.esEnlaceDeLaPagina) {
      this.placeHolderEnlace = 'ejemplo: /sorteo/siman';
    }else {
      this.placeHolderEnlace = 'ejemplo: https://www.enlace.com';
    }
  }

}
