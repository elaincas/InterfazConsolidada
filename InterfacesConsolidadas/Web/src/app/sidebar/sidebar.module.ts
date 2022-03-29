import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from './services/sidebar.service';
import { SidebarComponent } from './components/sidebar.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { NavFsComponent } from './components/nav-fs/nav-fs.component';
import { NavFsItemComponent } from './components/nav-fs-item/nav-fs-item.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [SidebarComponent, MenuItemComponent, NavFsComponent, NavFsItemComponent],
  exports: [SidebarComponent],
  providers: [SidebarService]
})

export class SidebarModule { }
