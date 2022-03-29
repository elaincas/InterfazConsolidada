import {Component} from '@angular/core';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html'
})

export class ListaProductosComponent {
  constructor() {
    this.Productos =  ['1', '2', '3'];
  }
  Productos: any[];

  ingresarProductos(){
  
  }

}
