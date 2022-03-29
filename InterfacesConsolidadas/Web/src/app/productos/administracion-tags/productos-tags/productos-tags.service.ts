import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { AddProductosTagsDto } from './productosTags.model';
import { environment } from '../../../../environments/environment';
import { IProducto } from '../../agrupador-productos/models/producto.model';
import { Tag } from '../tag-crud-frm/models/tag.model';
import { Observable } from 'rxjs/Observable';
import { Response } from "@angular/http";
import { ProductoTag } from './models/ProductoTags.Model';
@Injectable()
export class ProductosTagsService {

  constructor(private httpAuth: HttpAuthService) { }

  sincronizarProductos() {
    if (environment.production) {
      this.httpAuth.get("http://farmaciasiman.site:1200/farmaciaapiv2/api/productos/sincronizar").subscribe();
    }
  }

  agregarYEliminarTagsAProductos(productosTags: AddProductosTagsDto): Observable<Response> {
    let requestCrear = this.crearQueryAgregarProductosTags(productosTags);
    let requestEliminar = this.crearQueryRemoverProductosTags(productosTags);

    let query = `mutation agregarTagsAProductos($productosTags: ProductosTagsInput, $productosTagsRemover: ProductosTagsInput) {
      agregarYEliminarTagsAProductos(tagsProductos: $productosTags, tagsProductosEliminar: $productosTagsRemover){
            id
            descripcion
            tags {
              id
              descripcion
            }
        }
      }`;

    let request = {
      query: query,
      variables: `{ ${requestCrear.variables}, ${requestEliminar.variables} }`
    }
    return this.httpAuth.post(environment.graphApi, request);
  }

  private crearQueryAgregarProductosTags(productosTags: AddProductosTagsDto): request {
    let query = `mutation agregarTagsAProductos($productosTags: ProductosTagsInput) {
      agregarTagsAProductos(tagsProductos: $productosTags){
          id
          descripcion
          tags {
            id
            descripcion
          }
      }
    }`;

    let tags = productosTags.tags.filter(tag => !tag.esEliminada);
    let tagsId = this.toStringTags(tags);
    let productosId = this.toStringProductos(productosTags.productos);
    let variables = `
      "productosTags": {
         "tags": [${ tagsId}],
         "productos": [${ productosId}]
      } `;

    return {
      query,
      variables
    }
  }

  private crearQueryRemoverProductosTags(productosTags: AddProductosTagsDto): request {
    let query = `mutation removerTagsAProductos($productosTagsRemover: ProductosTagsInput) {
      removerTagsAProductos(tagsProductos: $productosTagsRemover){
          id
          descripcion
          tags {
            id
            descripcion
          }
      }
    }`;

    let tags = productosTags.tags.filter(tag => tag.esEliminada == true);
    let tagsId = this.toStringTags(tags);
    let productosId = this.toStringProductos(productosTags.productos);
    let variables = `
      "productosTagsRemover": {
         "tags": [${ tagsId}],
         "productos": [${ productosId}]
      } `;

    return {
      query,
      variables
    }
  }

  obtenerProducto(productoId: string,
    cargarTags: boolean = false,
    cargarProductosSimilares: boolean = false,
    countProductosSimilares: boolean = false,
    countTags: boolean = false): Observable<ProductoTag> {

    let query = {
      query: this.obtenerProductoQuery(productoId, cargarTags, cargarProductosSimilares, countProductosSimilares, countTags)
    }

    return this.httpAuth.post(environment.graphApi, query).map(m => {
      let producto = m.json().data.producto as ProductoTag
      if (!Array.isArray(producto.productosSimilares)) {
        producto.productosSimilares = [];
      }
      producto.productosSimilares.forEach(prod => {
        prod.esSeleccionado = prod.contieneLasMismasTagsDelProductoPrincipal;
      });
      return producto;
    });
  }

  private obtenerProductoQuery(productoId: string, cargarTags: boolean = false, cargarProductosSimilares: boolean = false, countProductosSimilares: boolean = false, countTags: boolean = false): string {
    let tagQuery = "";
    if (cargarTags || cargarProductosSimilares) {
      tagQuery = `
        tags {
          id
          descripcion
        }`;
    }

    let productosSimilaresQuery = "";
    if (cargarProductosSimilares) {
      productosSimilaresQuery = `
        productosSimilares {
          id
          descripcion
          contieneLasMismasTagsDelProductoPrincipal
          tags {
           descripcion
         }
        }`;
    }

    let countProductosSimilaresField = "";
    if (countProductosSimilares) {
      countProductosSimilaresField = "countProductosSimilares";
    }

    let countTagsField = "";
    if (countTags) {
      countTagsField = "countTags";
    }

    let query = ` query {
      producto(productoId: "${productoId}") {
        id
        descripcion
        ${countProductosSimilaresField}
        ${countTagsField}
        ${tagQuery}
        ${productosSimilaresQuery}
      }
    }`;
    return query;
  }


  private toStringProductos(productos: IProducto[]): string {
    let productosId = "";
    productos.forEach(producto => {
      if (productosId != "") {
        productosId += ",";
      }
      let productoString = `"${producto.id}"`;
      productosId += productoString;
    });

    return productosId;
  }

  private toStringTags(tags: Tag[]) {
    let tagsId = "";
    tags.forEach(tag => {
      if (tagsId != "") {
        tagsId += ",";
      }
      let tagString = `${tag.id}`;
      tagsId += tagString;
    });

    return tagsId;
  }


}

interface request {
  query: string;
  variables: string;
}
