import { Component, OnInit } from '@angular/core';
import {AdministracionAtributosService} from '../services/administracion-atributos.service';

@Component({
  selector: 'app-lista-atributos',
  templateUrl: './lista-atributos.component.html',
  styleUrls: ['./lista-atributos.component.css'],
  providers: [AdministracionAtributosService]
})
export class ListaAtributosComponent implements OnInit {

  constructor( private atributosService: AdministracionAtributosService) { }

  listadoProductosConAtributos= [];
  ngOnInit() {
    this.getLista();
  }

  ObtenerListadoProductosConAtributos() {
    this.atributosService.ObtenerListadoProductosConSusAtributos().subscribe( r => {
      this.listadoProductosConAtributos = r;
    });
  }

  getLista() {
    this.listadoProductosConAtributos = this.atributosService.getListaAtributos();
    console.log(this.listadoProductosConAtributos);
  }

}
