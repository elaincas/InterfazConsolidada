import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMenuItem, IMenuItemFs } from '../../services/menu.model';
import { helpers } from '../../../helpers/utils';

@Component({
  selector: 'app-nav-fs-item',
  templateUrl: './nav-fs-item.component.html',
  styleUrls: ['./nav-fs-item.component.css']
})
export class NavFsItemComponent implements OnInit {

  @Input()
  _item: IMenuItemFs;

  @Input()
  set item(value: IMenuItem) {
    if (value == null) {
      return;
    }
    this._item = value as IMenuItemFs;
    this.inicializarPropiedades(this._item);
  }

  @Output() onItemClick = new EventEmitter<IMenuItem>();

  get item(): IMenuItem {
    return this._item;
  }

  inicializarPropiedades(item: IMenuItemFs) {
    if (!helpers.isNull(item.subMenu)) {
      item.isSubMenu = item.subMenu.length > 0;
    } else {
      item.isSubMenu = false;
    }

    if (helpers.isNull(item.isExpanded)) {
      item.isExpanded = false;
    }

    if (helpers.isNull(item.isMainMenuItem)) {
      item.isMainMenuItem = false;
    }
  }

  itemClick(opcion: IMenuItemFs) {
    this.onItemClick.emit(opcion);
    if (!opcion.isSubMenu) {
      return;
    }
    opcion.isExpanded = !opcion.isExpanded;
  }

  constructor() { }

  ngOnInit() {
  }

}

