
declare var $: any;
export interface IMenuItem {
  pantallaId: number;
  path: string;
  title: string;
  icon: string;
  iconName: string;
  visible: boolean;
  subMenu: IMenuItem[];
  isExpanded?: boolean;
}

export interface IMenu {
  title: string;
  icon: string;
  visible: boolean;
  iconName: string;
  opciones: IMenuItem[];
}

export interface ISideBar {
  menuActual: IMenu;
  opciones: IMenu[];
  esMenuInicio: boolean;
  setMenu(menu: IMenu): void;
  backMenu(): void;
}



export class Sidebar
  implements ISideBar {
  menuActual: IMenu;
  opciones: IMenu[];
  esMenuInicio: boolean;

  constructor() {
    this.opciones = new Array<IMenu>();
    this.esMenuInicio = true;
  }

  setMenu(menu: IMenu): void {
    this.menuActual = menu;
    this.esMenuInicio = false;

  }

  backMenu() {
    this.menuActual = null;
    this.esMenuInicio = true;
  }

  agregarOpcion(menu: IMenu) {
    this.opciones.push(menu);
  }

}

export interface IMenuItemFs
  extends IMenuItem {
  isSubMenu: boolean;
  isExpanded: boolean;
  isMainMenuItem: boolean;
}

