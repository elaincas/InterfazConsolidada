import { Component, OnInit, ViewChild } from '@angular/core';
import { Tag } from '../tag-crud-frm/models/tag.model';
import { AddProductosTagsDto } from './productosTags.model';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { environment } from '../../../../environments/environment';
import { ProductosTagsService } from './productos-tags.service';
import { IProducto } from '../../agrupador-productos/models/producto.model';
import { AgrupadorProductosComponent, ICustomEventAsync } from '../../agrupador-productos/agrupador-productos';
import { AgrupadorTagsComponent } from '../agrupador-tags/agrupador-tags.component';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { ProductoTag } from './models/ProductoTags.Model';

@Component({
  selector: 'app-productos-tags',
  templateUrl: './productos-tags.component.html',
  styleUrls: ['./productos-tags.component.css']
})
export class ProductosTagsComponent implements OnInit {
  public tags: Tag[] = new Array<Tag>();
  public productos: IProducto[] = new Array<IProducto>();
  public modalDeseaCargarProductosSimilaresEsVisible: boolean;

  @ViewChild("agrupadorProductos")
  agrupadorProductos: AgrupadorProductosComponent;

  @ViewChild("agrupadorTags")
  agrupadorTags: AgrupadorTagsComponent;

  constructor(private productosTagsService: ProductosTagsService) { }
  ngOnInit() {
  }

  public guardar() {
    let productosTags = {
      tags: this.tags,
      productos: this.productos
    };
    Alertas.load();
    this.productosTagsService.agregarYEliminarTagsAProductos(productosTags).subscribe(response => {
      this.agrupadorProductos.limpiar();
      this.agrupadorTags.limpiar();
      Alertas.ok("", "Las tags fueron asignadas a los productos correctamente");
      this.productosTagsService.sincronizarProductos()
    }, error => {
      Alertas.showHttpResponse(error, "", true);
    });
  }


  public onCancelarClick() {
    Alertas.question("¿Está seguro que desea limpiar la pantalla?", "").then(() => {
      this.agrupadorProductos.limpiar();
      this.agrupadorTags.limpiar();
    });
  }

  modalCargarProductosSimilaresEsVisible = false;
  public productoIdBusqueda: string;
  public producto: ProductoTag;

  abrirYcargarModalProductosSimilares(productoId: string) {
    this.modalDialogCargarProductosSimilares.close();
    this.productosTagsService.obtenerProducto(productoId, true, true).subscribe(response => {
      this.producto = response;
      this.modalCargarProductosSimilaresEsVisible = true;
    });
  }

  cargarProductoYTagsSimilares(producto: ProductoTag) {
    let hayProductosSeleccionados = false;
    producto.productosSimilares.forEach(prod => {
      if (prod.esSeleccionado) {
        this.productos.push(prod as any as IProducto);
        hayProductosSeleccionados = true;
      };
    });

    if (hayProductosSeleccionados) {
      this.tags = producto.tags;
      this.modalCargarProductosSimilaresEsVisible = false;
      this.agrupadorProductos.agrupadorProductosModal.cancelar();
      return;
    }

    Alertas.info("", "Debe seleccionar almenos un producto y si no desea agregar productos presione el botón cancelar.");
  }

  cargarTagsDeProducto(productoId: string) {
    this.productosTagsService.obtenerProducto(productoId, true).subscribe(response => {
      this.tags = response.tags;
      this.modalDialogCargarProductosSimilares.close();
      this.agrupadorProductos.agrupadorProductosModal.cancelar();
      this.productos.push(response as any as IProducto);
    });
  }

  alSeleccionarUnProducto(evento: any) {

    if (this.productos.length > 0) {
      return;
    }

    let producto = evento.producto as IProducto;
    let productos = evento.productos as IProducto[];

    let hayMasProductosSeleccionados = productos.filter(prod => prod.esSeleccionado).length > 1;
    if (hayMasProductosSeleccionados) {
      return;
    }

    this.agrupadorProductos.agrupadorProductosModal.loadingVisible = true;

    this.productosTagsService.obtenerProducto(producto.id, false, false, true, true).subscribe(data => {
      this.agrupadorProductos.agrupadorProductosModal.loadingVisible = false;

      let noHayProductosSimilares = data.countProductosSimilares == 0 || data.countProductosSimilares == undefined;
      let noHayTags = data.countTags == 0 || data.countTags == undefined;

      if (noHayProductosSimilares && noHayTags) {
        return;
      }
      this.modalDialogCargarProductosSimilares.open(noHayProductosSimilares);
      this.productoIdBusqueda = producto.id;
    }, error => {
      console.log(error);
    });

  }

  public modalDialogCargarProductosSimilares = {
    btnProductosyTagsHidden: false,
    btnTagsHidden: false,
    btnNingunaHidden: false,
    visible: false,
    open: (btnProductosyTagsHidden: boolean = false, btnTagsHidden: boolean = false, btnNingunaHidden: boolean = false) => {
      this.modalDialogCargarProductosSimilares.btnProductosyTagsHidden = btnProductosyTagsHidden;
      this.modalDialogCargarProductosSimilares.btnTagsHidden = btnTagsHidden;
      this.modalDialogCargarProductosSimilares.btnNingunaHidden = btnNingunaHidden;
      this.modalDialogCargarProductosSimilares.visible = true;
    },
    close: () => {
      this.modalDialogCargarProductosSimilares.btnProductosyTagsHidden = false;
      this.modalDialogCargarProductosSimilares.btnTagsHidden = false;
      this.modalDialogCargarProductosSimilares.btnNingunaHidden = false;
      this.modalDialogCargarProductosSimilares.visible = false;
    }
  }

}
