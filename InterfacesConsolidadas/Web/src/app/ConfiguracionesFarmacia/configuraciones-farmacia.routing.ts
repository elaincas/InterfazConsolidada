import { Routes } from '@angular/router';


import {SubirImagenesFacturaImpresaComponent} from "./ImagenesFacturaImpresa/subir-imagenes-factura-impresa/subir-imagenes-factura-impresa.component";
import {CanActivateValidarAccesoRuta} from '../login/guards/logged-in.guard';
import { DescuentosComponent } from './Descuentos/descuentos.component';
import { DescuentoAdicionalPorDiaComponent } from './Descuentos/DescuentoAdicionalPorDia/Components/descuento-adicional-dia/descuento-adicional-dia.component';
import { ListadoDescuentoAdicionalPorDiaComponent } from './Descuentos/DescuentoAdicionalPorDia/Components/descuento-adicional-dia-listado/descuento-adicional-dia-listado.component';

export const ConfiguracionRoutes: Routes = [
  {
    path: '',
    canActivate: [CanActivateValidarAccesoRuta],
    children: [
      {
        path: 'SubirImagenesFacturaImpresa',
        component: SubirImagenesFacturaImpresaComponent
      },
      {
        path: 'DescuentosAdicionales',
        component: DescuentosComponent
      },
      {
        path: 'ListadoDescuentosAdicionales',
        component: ListadoDescuentoAdicionalPorDiaComponent
      },
    ]
  }
];
