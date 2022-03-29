import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../../../login/services/login.service';
import {SubirBannersService} from '../../services/subir.banners.service';
import {Alertas} from '../../../../../helpers/notificaciones/notificaciones';
import {Router} from '@angular/router';
import {BannerDetalle} from '../../models/BannerDetalle';

@Component({
  styleUrls: ['./lista.banners.component.css'],
  selector: 'app-lista-banners',
  templateUrl: './lista.banners.component.html',
  providers: [SubirBannersService, LoginService]
})
export class ListaBannersComponent implements OnInit {
  constructor(private service: SubirBannersService,
              private router: Router) { }

  // Variables
  ListaBanners: any;
  popupBannerVisible = false;
  popupDetallesVisible = false;
  rutaBanner: any;
  dimensionX: number;
  dimensionY: number;
  titulo: string;

  // modelos
  bannerDetalle: BannerDetalle;


  ngOnInit() {
    this.ObtenerLista();    
  }

  ObtenerLista() {
    Alertas.load();
    this.service.ObtenerListaDeDetallesDeBanners()
      .subscribe(r => {        
        this.ListaBanners = r;
        Alertas.close();
      });
  }

  EliminarBanner(bannerId, posiciones, bannerDetalle) {
    let version = '';
    let titulo = 'Al eliminar este banner, también se eliminará la versión ';
    const esMiniatura =  (bannerDetalle.banner.paginaPosicion.bannerTipo === 3);
    if (bannerDetalle.banner.esVersionMovil) {
      version = 'web';
    }else if (esMiniatura ) {
      titulo = '';
    } else {
      version = 'móvil';
    }
    Alertas.question(`${titulo}${version}.`, '¿Está seguro de que desea eliminar este banner?')
      .then(() => {
        this.service.EliminarBanner(bannerId).subscribe();
        const index = this.ListaBanners.indexOf(posiciones);
        const indexPosiciones = posiciones.banners.indexOf(bannerDetalle);
        if (!esMiniatura) {
          const otraVersion = posiciones.banners.find(function (bd) {
            return bd.banner.paginaPosicionId === bannerDetalle.banner.paginaPosicionId
                   && bd.banner.esVersionMovil !== bannerDetalle.banner.esVersionMovil;
          });
          const indexOtraPosicion = posiciones.banners.indexOf(otraVersion);
          posiciones.banners.splice(indexOtraPosicion, 1);
        }
        posiciones.banners.splice(indexPosiciones, 1);
    });
  }

  VerBanner(bannerInfo) {
    this.popupBannerVisible = true;
    this.titulo = bannerInfo.banner.esVersionMovil ? 'Banner versión Móvil' : 'Banner versión Web';
    if (bannerInfo.banner.paginaPosicion.bannerTipo === 3) {
      this.titulo = 'Miniatura Marca';
    }
    this.rutaBanner = bannerInfo.rutaImagen;
    this.dimensionX = bannerInfo.banner.dimensionX + 50;
    if (window.screen.width < this.dimensionX) {
      this.dimensionX = window.screen.width * 0.9;
      this.dimensionY = bannerInfo.banner.dimensionY + 50;
      return;
    }
    this.dimensionY = bannerInfo.banner.dimensionY + 100;
  }

  VerDetallesBanner(detalle) {
    this.popupDetallesVisible = true;
    this.titulo = detalle.descripcion;
    this.bannerDetalle = new BannerDetalle();
    this.bannerDetalle = detalle;
  }

  EditarBanner(bannerDetalle, banner) {
    this.router.navigate(['ecommerce/banners/editarBanner', bannerDetalle.bannerDetalleId, banner.carpeta]);
  }

  onHidePopPupBanner() {
    this.rutaBanner = '';
  }
}
