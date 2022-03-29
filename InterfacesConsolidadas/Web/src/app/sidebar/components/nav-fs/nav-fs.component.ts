import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMenu, IMenuItem, IMenuItemFs } from '../../services/menu.model';
import { helpers } from '../../../helpers/utils';
import * as $ from "jquery";

@Component({
  selector: 'app-nav-fs',
  templateUrl: './nav-fs.component.html',
  styleUrls: ['./nav-fs.component.css']
})
export class NavFsComponent implements OnInit {

  private _opciones: IMenuItemFs[];


  @Input()
  set opciones(value: IMenuItem[]) {
    if (value == null) {
      return;
    }
    this._opciones = value as IMenuItemFs[];
    this.inicializarPropiedadesOpciones(this._opciones);
  }

  @Output() onItemClick = new EventEmitter<IMenuItemFs>();

  itemClick(item: IMenuItemFs) {
    this.onItemClick.emit(item);
  }

  get opciones(): IMenuItem[] {
    return this._opciones;
  }

  inicializarPropiedadesOpciones(opciones: IMenuItemFs[]) {
    opciones.forEach(el => {
      if (!helpers.isNull(el.subMenu)) {
        el.isSubMenu = el.subMenu.length > 0;
      } else {
        el.isSubMenu = false;
      }

      if (helpers.isNull(el.isExpanded)) {
        el.isExpanded = false;
      }
    });
  }

  constructor() { }

  ngOnInit() {
    this.inicializarEventosMenu();
  }

  inicializarEventosMenu() {
    setTimeout(() => {
      this.setMenuEvents();
    }, 15);
  }

  setMenuEvents() {
    $(".navFs-item-link").click((event) => {
      let navFsItemLink = $(event.target);
      let navFsItem = navFsItemLink.parent();
      let navFsSubMenu = $(navFsItem.find('.navFs-subMenu')[0]);
      if (navFsSubMenu.length === 0) {
        return;
      }
      event.preventDefault();
      navFsSubMenu.toggleClass('navFs-subMenu__expanded');
      navFsItemLink.toggleClass('navFs-item-link__expanded');
    });
  }

  // itemClick(opcion: IMenuItemFs) {
  //   if (!opcion.isSubMenu) {
  //     return;
  //   }
  //   opcion.isExpanded = !opcion.isExpanded;
  // }


}
