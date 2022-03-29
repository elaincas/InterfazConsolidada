import { Injectable } from "@angular/core";
import { sidebarRoutes } from "../../sidebar/services/sidebar-routes.config";

@Injectable()
export class SearchRoutes {

  public obtenerPermisoId(ruta: string): number {
    return sidebarRoutes.obtenerPantallaIdPorRuta(ruta);
  }

}
