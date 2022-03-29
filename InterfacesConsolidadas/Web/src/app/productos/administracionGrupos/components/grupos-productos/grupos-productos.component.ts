import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISubgrupoProductos } from '../../models/gruposProductos.models';
import { CategoriasProductosService } from '../../services/categorias-productos.service';
import { helpers } from '../../../../helpers/utils';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'app-grupos-productos',
  templateUrl: './grupos-productos.component.html',
  styleUrls: ['./grupos-productos.component.css']
})
export class GruposProductosComponent implements OnInit {
  constructor(private categoriasProductosService: CategoriasProductosService, private route: Router) {
  }

  categoriasProductos = [];
  ngOnInit() {
    this.cargarCategoriasProductos();
  }

  cargarCategoriasProductos(): void {
    this.categoriasProductosService.obtenerCategoriasProductosActivos().subscribe(response => {
      console.log(response);
      this.categoriasProductos = response;
      window.loader.hide(100);
    });
  }

  editar(grupo: any) {
    this.route.navigate(['/productos/categoria', grupo.id]);
  }

  eliminar(categoria: ISubgrupoProductos) {

    Alertas.question("¿Está seguro que desea eliminar la categoría?").then(() => {
      this.categoriasProductosService.eliminarCategoria(categoria.id).subscribe();
      let index = this.categoriasProductos.indexOf(categoria);
      this.categoriasProductos.splice(index, 1);
    });

  }


  abrirCrearCategoria(): void {
    this.route.navigate(['/productos/categoria/crear']);
  }
}
