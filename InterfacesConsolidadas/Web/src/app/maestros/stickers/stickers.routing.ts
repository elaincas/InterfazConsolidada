import { Routes } from '@angular/router';
import { CanActivateValidarAccesoRuta } from '../../login/guards/logged-in.guard';
import { ListadoStickersComponent } from './components/listado-stickers/listado-stickers.component';
import { StickersComponent } from './components/configuraciones/stickers/stickers.component';
import { ProductosPremiosComponent } from './components/premios/productos-premios/productos-premios.component';
import { StickerPremiosComponent } from './components/sticker-premios/sticker-premios.component';
import { StickersPorDescuentosComponent } from './components/clientes/stickers-por-descuentos/stickers-por-descuentos';

export const routes: Routes = [
  {
    path:'stickers',
    children: [
      {
        path: 'listadoDeStickers',
        canActivate: [CanActivateValidarAccesoRuta],
        component: ListadoStickersComponent,
      },
      {
        path: 'configuracion',
        canActivate: [CanActivateValidarAccesoRuta],
        component: StickersComponent,
      },
      {
        path: 'configuracion/:stickerId',
        canActivate: [CanActivateValidarAccesoRuta],
        component: StickersComponent,
      },
      {
        path: 'stickers-premios',
        canActivate: [CanActivateValidarAccesoRuta],
        component: StickerPremiosComponent,
      },
      {
        path: 'premios',
        canActivate: [CanActivateValidarAccesoRuta],
        component: ProductosPremiosComponent,
      },
      {
        path: 'stickers-por-descuentos',
        canActivate: [CanActivateValidarAccesoRuta],
        component: StickersPorDescuentosComponent,
      },
    ]
  }
];
