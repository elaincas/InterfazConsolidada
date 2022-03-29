import {Injectable} from '@angular/core';
import {LoginService} from '../../../../login/services/login.service';
import {HttpAuthService} from '../../../../helpers/http/http-auth.service';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Pagina} from '../models/Pagina';
import {environment} from '../../../../../environments/environment';
import {Banner} from '../models/Banner';
import {PaginaPosicion} from '../models/PaginaPosicion';
import {BannerDetalle} from '../models/BannerDetalle';

@Injectable()
export class SubirBannersService {
  constructor(private http: Http,
              private httpAuth: HttpAuthService,
              private loginService: LoginService) { }

  ObtenerPaginas(): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Ecommerce/Banners/ObtenerPaginas`;
    return this.http.get(url).map(r => r.json());
  }

  ObtenerPosicionesPorPagina(pagina: number): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Ecommerce/Banners/ObtenerPosicionesPorPagina/` + pagina;
    return this.http.get(url).map(r => r.json());
  }

  ObtenerBannersPorPosicion(posicion: number): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Ecommerce/Banners/ObtenerBannersPorPosicion/` + posicion;
    return this.http.get(url).map(r => r.json());
  }

  ObtenerListaDeDetallesDeBanners(): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Ecommerce/Banners/ObtenerBannersDetalle`;
    return this.http.get(url).map(r => r.json());
  }

  EditarBanner(bannerEditado: BannerDetalle, carpeta: string, seSeleccionoBannerNuevo: boolean){
    const formData = new FormData();
    formData.append('model', bannerEditado.toJson());
    if (bannerEditado.rutaBanner != null  && bannerEditado.rutaBanner.length > 0) {
      formData.append(carpeta, bannerEditado.rutaBanner[0]);
    }
    const esMovil: boolean = false;
    const url = `${environment.ecommerceApi}/api/Ecommerce/Banners/EditarBanner/${carpeta}/${esMovil}/${seSeleccionoBannerNuevo}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }

  AgregarBanner(banners: BannerDetalle[], tieneBannerMovil, tieneBannerMiniatura) {
    const formData = new FormData();
    if (!tieneBannerMiniatura){
      formData.append('model', banners[0].toJson());
      if (banners[0].rutaBanner != null  && banners[0].rutaBanner.length > 0) {
        formData.append(banners[0].carpeta, banners[0].rutaBanner[0]);
      }

      if (tieneBannerMovil) {
        formData.append('modelMovil', banners[1].toJson());
        if (banners[1].rutaBanner != null  && banners[1].rutaBanner.length > 0) {
          formData.append( banners[1].carpeta, banners[1].rutaBanner[0]);
        }
      }
    } else {
      formData.append('model', banners[0].toJson());

      if (banners[0].rutaBanner != null  && banners[0].rutaBanner.length > 0) {
        formData.append(banners[0].carpeta, banners[0].rutaBanner[0]);
      }
    }

    const uri = `${environment.ecommerceApi}/api/Ecommerce/Banners/SubirBanner/${banners[0].carpeta}/${tieneBannerMovil}` ;
    return this.httpAuth.post(uri, formData).map(x => x.json());
  }

  EliminarBanner(bannerId: number): Observable<any> {
    const uri = `${environment.ecommerceApi}/api/Ecommerce/Banners/EliminarBanner/${bannerId}` ;
    return this.http.delete(uri);
  }

  ObtenerBannerAEditar(bannerDetalleId: number): Observable<BannerDetalle>{
    const url = `${environment.ecommerceApi}/api/Ecommerce/Banners/ObtenerBannerAeditar/${bannerDetalleId}`;
    return this.http.get(url).map(r => r.json());
  }

  getTitulosTab(): TitulosTab[] {
    return titulos;
  }


}
export class TitulosTab {
  ID: number;
  Titulo: string;
  Icono: string;
}

let titulos: TitulosTab[] = [
  {
    'ID': 1,
    'Titulo': 'Banner para Versión Web',
    'Icono': 'laptop_chromebook'
  },
  {
    'ID': 2,
    'Titulo': 'Banner para Versión Móvil',
    'Icono': 'phone_android'
  },
  {
    'ID': 3,
    'Titulo': 'Miniatura de Marca',
    'Icono': 'star'
  }
];
