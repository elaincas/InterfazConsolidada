import { Component, OnInit, Input } from '@angular/core';
import { IMenuItem } from '../../services/menu.model';

@Component({
  selector: 'sidebar-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  collapseId: string;
  @Input() item: IMenuItem;

  constructor() {
    this.setCollapseId();
  }

  ngOnInit() {
  }


  private setCollapseId() {
    let random = this.getRandomInt(1500, 10000);
    this.collapseId = `collapseMenu_${random}`;
  }
  getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
