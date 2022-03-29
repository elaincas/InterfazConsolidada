import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IGrupoProductos, ISubgrupoProductos, GrupoProductos, SubgrupoProductos } from '../models/gruposProductos.models';
import { environment } from '../../../../environments/environment';
import { helpers } from '../../../helpers/utils';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { LoginService } from '../../../login/services/login.service';

@Injectable()
export class CategoriasProductosService {

  constructor(private http: HttpAuthService, private httpAuth: HttpAuthService, private loginService: LoginService) { }

  obtenerCategoriasProductosActivos(): Observable<Array<any>> {
    const query = `gruposProductos {
      id,
      descripcion,
      rutaWeb,
      cantidadProductos,
      cantidadSubgrupos,
      subGrupos {
        id,
        descripcion,
        rutaWeb,
        cantidadProductos,
        cantidadSubgrupos,
        subGrupos {
          id,
          descripcion,
          rutaWeb,
          cantidadProductos
        }
      }
    }`;
    const uri = environment.productosGraph.replace('@query', query);
    return this.http.get(uri).map(x => x.json().gruposProductos);
  }

  agregarCategoria(categoria: ISubgrupoProductos): Observable<any> {
    let formData = this.obtenerFormDataCrearCategoria(categoria);
    const uri = `${environment.productosApi}/productos/grupos`;
    return this.http.post(uri, formData).map(x => x.json());
  }

  agregarSubCategoria(categoriaId: number, categoria: ISubgrupoProductos): Observable<any> {
    let formData = this.obtenerFormDataCrearCategoria(categoria);
    const uri = `${environment.productosApi}/productos/grupos/${categoriaId}/subgrupo`;
    return this.http.post(uri, formData).map(x => x.json());
  }

  agregarSubCategoriaTercerNivel(categoriaId: number, subcategoriaId: number, categoria: ISubgrupoProductos): Observable<any> {
    let formData = this.obtenerFormDataCrearCategoria(categoria);
    const uri = `${environment.productosApi}/productos/grupos/${categoriaId}/subgrupo/${subcategoriaId}/subgrupo`;
    return this.http.post(uri, formData).map(x => x.json());
  }

  public ActualizarCategoria(categoria: ISubgrupoProductos): Observable<any> {
    let formData = this.obtenerFormDataActualizarCategoria(categoria);
    const uri = `${environment.productosApi}/productos/grupos/${categoria.id}`;
    return this.http.put(uri, formData).map(x => x.json());
  }


  public ActualizarSubCategoria(subCategoria: ISubgrupoProductos): Observable<any> {
    let formData = this.obtenerFormDataActualizarCategoria(subCategoria);

    const uri = `${environment.productosApi}/productos/grupos/subgrupos/${subCategoria.id}`;
    return this.http.put(uri, formData).map(x => x.json());
  }

  agregarProductoEnCategoria(categoriaId: number, productoId: string): Observable<any>  {
    const uri = `${environment.productosApi}/productos/grupos/${categoriaId}/producto/${productoId}`;
    return this.httpAuth.post(uri, {});
  }

  agregarProductoEnSubcategoria(subcategoriaId: number, productoId: string) {
    const uri = `${environment.productosApi}/productos/grupos/subgrupos/${subcategoriaId}/producto/${productoId}`;
    return this.httpAuth.post(uri, {});
  }


  eliminarProductCategoria(categoriaId: number, productoId: string) {
    const uri = `${environment.productosApi}/productos/grupos/${categoriaId}/producto/${productoId}`;
    return this.httpAuth.delete(uri);
  }

  eliminarProductoSubcategoria(subcategoriaId: number, productoId: string) {
    const uri = `${environment.productosApi}/productos/grupos/subgrupos/${subcategoriaId}/producto/${productoId}`;
    return this.httpAuth.delete(uri);
  }

  eliminarCategoria(subcategoriaId: number) {
    const uri = `${environment.productosApi}/productos/grupos/${subcategoriaId}`;
    return this.http.delete(uri);
  }
  eliminarSubcategoria(subcategoriaId: number) {
    const uri = `${environment.productosApi}/productos/grupos/subgrupo/${subcategoriaId}`;
    return this.http.delete(uri);
  }

  obtenerExcelId(): string {
    return `$excel-${helpers.random(1000)}`;
  }
  agregarArchivoFormData(file: File, formData: FormData, fileId?: string): string {
    formData.append(fileId, file);
    return fileId;
  }

  obtenerFormDataCrearCategoria(grupo: ISubgrupoProductos): FormData {
    let formData = new FormData();
    let postData = this.obtenerCategoriaProductosAddDto(grupo, formData);
    if (helpers.isNull(postData)) {
      return null;
    }

    this.agregarModelFormData(formData, postData);
    return formData;
  }

  private obtenerFormDataActualizarCategoria(categoria: ISubgrupoProductos): FormData {
    let formData = new FormData();
    let data = {
      usuarioAgregaId: this.loginService.Usuario.id,
      descripcion: categoria.descripcion,
      rutaWeb: categoria.rutaWeb,
      esVisible: categoria.esVisible,
      id: categoria.id,
      excelId: "",
      paginaId: categoria.paginaId
    }

    data.excelId = this.agregarArchivoFormData(
      categoria.ExcelProductos,
      formData,
      this.obtenerExcelId()
    );

    this.agregarModelFormData(formData, data);
    return formData;
  }

  obtenerCategoriaProductosAddDto(grupo: ISubgrupoProductos, formData?: FormData): any {

    if (grupo.id != 0) {
      return null;
    }

    let postData = {
      usuarioAgregaId: this.loginService.Usuario.id,
      descripcion: grupo.descripcion,
      rutaWeb: grupo.rutaWeb,
      esVisible: grupo.esVisible,
      productosId: [],
      subcategorias: [],
      excelId: "",
      paginaId: grupo.paginaId
    };

    if (!helpers.isNull(formData) && !helpers.isNull(grupo.ExcelProductos)) {
      postData.excelId = this.agregarArchivoFormData(
        grupo.ExcelProductos,
        formData,
        this.obtenerExcelId()
      );
    }

    grupo.productos.forEach(producto => postData.productosId.push(producto.id));
    grupo.subcategorias.forEach(cat => {
      let subCat = this.obtenerCategoriaProductosAddDto(cat, formData);
      if (!helpers.isNull(subCat)) {
        postData.subcategorias.push(subCat);
      }
    });

    return postData;
  }

  obtenerCategoriaProductos(categoriaId: number): Observable<ISubgrupoProductos> {
    const query = `grupoProductos(id:${categoriaId}) {
                      id,
                      descripcion,
                      rutaWeb,
                      esVisible,
                      productos {
                        id:productoId,
                        descripcion
                      },
                      subcategorias:subGrupos {
                        id,
                        descripcion,
                        rutaWeb,
                        paginaId
                      }
                    }`;
    const uri = environment.productosGraph.replace('@query', query);
    return this.http.get(uri).map(x => {
      let grupoJson = x.json().grupoProductos as ISubgrupoProductos;
      let grupo = new SubgrupoProductos(grupoJson);

      return grupo;
    });
  }

  obtenerSubCategoriaProductos(subgrupoId: number): Observable<ISubgrupoProductos> {
    const query = `subgrupoProductos(id:${subgrupoId}) {
                      id,
                      descripcion,
                      rutaWeb,
                      esVisible,
                      productos {
                        id:productoId,
                        descripcion
                      },
                      subcategorias:subGrupos {
                        id,
                        descripcion,
                        rutaWeb,
                        paginaId
                      }
                    }`;
    const uri = environment.productosGraph.replace('@query', query);
    console.log(query);
    return this.http.get(uri).map(x => {
      let grupoJson = x.json().subgrupoProductos as ISubgrupoProductos;

      console.log(grupoJson);
      let grupo = new SubgrupoProductos(grupoJson);

      return grupo;
    });
  }

  agregarModelFormData(formData: FormData, data: any) {
    data.usuarioAgregaId = this.loginService.Usuario.id;
    formData.append('model', JSON.stringify(data));
  }

  obtenerPaginas(): Observable<Array<any>> {
    const uri = `${environment.productosApi}/productos/grupos/subgrupos/paginas`;
    return this.http.get(uri).map( x => x.json());
  }
}
