import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { IMenuItem, ISideBar, Sidebar, IMenuItemFs, IMenu } from './menu.model';
import { sidebarRoutes } from './sidebar-routes.config';

@Injectable()
export class SidebarService {
  constructor() { }
  private obtenerPantallasId(): Array<number> {
    let pantallasId = new Array<number>();
    // let permisosJson = localStorage.getItem("Auth_permisos");
    // if (!permisosJson) {
    //   return pantallasId;
    // }

    // let permisos = JSON.parse(permisosJson) as Array<any>;
    
    pantallasId.push(0,2,504);

    return pantallasId;
  }

  private habilitarMenus2(menu: IMenuItem, pantallasId: Array<number>): boolean {
    let existePantalla = pantallasId.findIndex((x) => x == menu.pantallaId) != -1;
    if (existePantalla) {
      menu.visible = true;
      return true;
    }

    if (menu.subMenu.length === 0) {
      return false;
    }

    for (let item of menu.subMenu) {
      if (existePantalla) {
        continue;
      }
      existePantalla = this.habilitarMenus2(item, pantallasId);
    }

    if (existePantalla) {
      menu.visible = true;
    }

    return menu.visible;
  }

  private activarItemRootConHijosActivos(menu: IMenuItem) {
    if (menu.visible) {
      return;
    }

    let index = menu.subMenu.findIndex(el => el.visible);
    if (index == -1) {
      return;
    }
    menu.visible = true;
  }

  private habilitarMenus(menu: IMenuItem, pantallasId: Array<number>) {
    let itemDebeSerHabilitado = pantallasId.findIndex((x) => x == menu.pantallaId) != -1;
    if (itemDebeSerHabilitado) {
      menu.visible = true;
    }

    if (menu.subMenu.length === 0) {
      return;
    }

    for (let item of menu.subMenu) {
      this.habilitarMenus(item, pantallasId);
    }

    this.activarItemRootConHijosActivos(menu);
  }


  private setIsMainMenuItem(menu: IMenu) {
    let menuProductos = menu as any as IMenuItemFs;
    menuProductos.isMainMenuItem = true;
  }


  private habilitarMenuPorPermisos(menu: IMenu, pantallasId: number[]) {
    menu.opciones.forEach(item => {
      this.habilitarMenus(item, pantallasId);
    });

    menu.visible = menu.opciones.findIndex((item) => item.visible == true) !== -1;
  }

  private addMenusInSidebar(menus: IMenu[], sideBar: Sidebar, pantallasId: number[]) {
    menus.forEach(menu => {
      this.setIsMainMenuItem(menu);
      this.habilitarMenuPorPermisos(menu, pantallasId);
      sideBar.agregarOpcion(menu);
    });
  }


  public ObtenerSidebar(): ISideBar {
    let pantallasId = this.obtenerPantallasId();
    let sideBar = new Sidebar();
    let menus = sidebarRoutes.obtenerMenus();
    this.addMenusInSidebar(menus, sideBar, pantallasId);

    return sideBar;
  }
}
