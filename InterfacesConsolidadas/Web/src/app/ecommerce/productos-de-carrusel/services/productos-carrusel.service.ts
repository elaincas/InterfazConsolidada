import { Injectable } from '@angular/core';
import {HttpAuthService} from '../../../helpers/http/http-auth.service';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../../environments/environment';
import {AddProducto} from '../models/addProducto';
import {Carrusel} from "../models/Carrusel";

@Injectable()

export class ProductosCarruselService {
  constructor(private httpAuth: HttpAuthService) {

    this.accion = {
      guardar: 1,
      editar: 2
    };
  }

  accion: {
    guardar: number,
    editar: number
  };
  private productosResultado = new Array<any>();


  ObtenerPaginas(): Observable<Array<any>> {
    const query = ` query { paginas {
                              paginaId,
                              descripcion,
                              nombre
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaPaginas = r.json().data.paginas;
      return listaPaginas;
    });
  }

  ObtenerTiposDeCarrusel(): Observable<Array<any>> {
    const query = ` query { listadoDeTiposDeCarruseles {
                              id,
                              descripcion
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaTiposCarrusel = r.json().data.listadoDeTiposDeCarruseles;
      return listaTiposCarrusel;
    });
  }

  ObtenerCarruselesPorPagina(paginaId: number, esEdicion: boolean): Observable<Array<any>> {
    const query = ` query { carruselesPorPagina(paginaId: ${paginaId}, esEdicion: ${esEdicion}) {
                              carruselId,
                              descripcion,
                              enlace,
                              esEnlaceInterno,
                              textoVerMas,
                              carruselTipoId
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaCarruseles = r.json().data.carruselesPorPagina;
      return listaCarruseles;
    });
  }

  ObtenerProductosPorDescripcion(busqueda: string): Promise<Array<any>> {
    const promesa = new Promise<Array<any>>((resolve, reject) => {
      if (busqueda === null || busqueda.length < 3) {
        resolve(this.productosResultado);
        return;
      }

      const resultadoLocal = this.obtenerProductosEnLocal(busqueda);
      if (resultadoLocal.length > 0) {
        resolve(resultadoLocal);
        return;
      }
      const query = ` query { productosBusqueda (busqueda:"${busqueda}", top:10) {
                                productoId,
                                descripcion
                          }
                        }`;
      const request = {
        query: query
      };

      return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).subscribe(r => {
        const queryRespuesta = r.json();
        const listaProductos = queryRespuesta.data.productosBusqueda;
        this.productosResultado = listaProductos as Array<any>;
        this.productosResultado.forEach(producto => {
          producto.searchData = `${producto.productoId} ${producto.descripcion}`;
        });
        resolve(this.productosResultado);
      });
    });
    return promesa;
  }

  GuardarProductosDeCarrusel(productos: Array<AddProducto>, carruselId: number, usuarioId: number) {
    const query = `mutation guardarProductosCarrusel($addProductos: [ProductoInputType], $carruselId: Int, $usuarioId: Int) {
                      guardarProductosCarrusel(addProductos: $addProductos, carruselId: $carruselId, usuarioId: $usuarioId) {
                          productoId,
                          orden,
                          fechaInicioActivo,
                          fechaFinActivo,
                          respuesta
                      }
                   }`;
    let prueba = '';

    productos.forEach(producto => {
      prueba += `{ productoId : "${producto.productoId}"
                  ,orden: "${producto.orden}"
                  ,fechaInicioActivo: "${producto.fechaInicioActivo.toDateString()}"
                  ,fechaFinActivo: "${producto.fechaFinActivo.toDateString()}"} ,`;
    });

    prueba.substr(0, prueba.length - 1);
    const variables = `{ "addProductos": [${ prueba }], "carruselId": ${ carruselId }, "usuarioId": ${usuarioId} }`;

    const request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const query = r.json().data.guardarProductosCarrusel;
      return query;
    });
  }

  EditarProductosDeCarrusel(productos: Array<AddProducto>, carruselId: number, usuario: number, seEliminaronLosProductosAnteriores: boolean, carrusel: Carrusel) {

    const query =
      `mutation
        editarProductosCarrusel($productos:[ProductoInputType],$carruselId:Int,$usuarioId:Int,$seLimpioLista:Boolean,$carrusel:CarruselInputType){
        editarProductosCarrusel(productos:$productos,carruselId:$carruselId,usuarioId:$usuarioId,seLimpioLista:$seLimpioLista,carrusel:$carrusel){
          orden,
          fechaInicioActivo,
          fechaFinActivo,
          respuesta
        }
       }`;
    let prueba = '';

    productos.forEach(producto => {
      prueba += `{ productoId : "${producto.productoId}"
                  ,orden: "${producto.orden}"
                  ,fechaInicioActivo: "${producto.fechaInicioActivo}"
                  ,fechaFinActivo: "${producto.fechaFinActivo}"} ,`;
    });
    let carruselDto = `{carruselId: ${carruselId}
                        ,enlace: "${carrusel.enlace}"
                        ,descripcion: "${carrusel.descripcion}"
                        ,textoVerMas: "${carrusel.textoVerMas}"
                        ,carruselTipoId: ${carrusel.carruselTipoId}
                        ,cantidadDeProductosVisiblesEnMovil: ${carrusel.cantidadDeProductosVisiblesEnMovil}}`;

    const variables = `{ "productos": [${ prueba }],
                         "carruselId": ${ carruselId },
                         "usuarioId": ${usuario},
                         "seLimpioLista": ${seEliminaronLosProductosAnteriores},
                         "carrusel": ${carruselDto}
                       }`;
    console.log(variables);
    const request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const dtoResultado = r.json().data.editarProductosCarrusel;
      return dtoResultado;
    });
  }

  private obtenerProductosEnLocal(descripcion: string): Array<any> {
    return this.productosResultado.filter((elemento) => elemento.descripcion.
    toLocaleLowerCase().indexOf(descripcion.toLocaleLowerCase()) !== -1);
  }

  // ********************* LISTADO *************************
  ObtenerCarruselesConProductosPorPagina(): Observable<Array<any>> {
    const query = ` query { listadoDePaginasConCarruselConProductos {
                              pagina,
                              paginaId,
                              totalCarruseles
                              listaCarruselConProductos {
                                carruselId,
                                carrusel,
                                totalProductos
                                productos {
                                  productoCarruselId,
                                  productoId,
                                  descripcion,
                                  fechaInicioActivo,
                                  fechaFinActivo,
                                  orden,
                                  carruselId
                                }
                              }
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaCarruseles = r.json().data.listadoDePaginasConCarruselConProductos;
      return listaCarruseles;
    });
  }

  EliminarCarrusel(carruselId: number) {
    const query = ` mutation { eliminarCarrusel(carruselId: ${carruselId}) {
                              carruselId,
                              descripcion,
                              respuesta
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const carrusel = r.json().data.eliminarCarrusel;
      return carrusel;
    });
  }

  EliminarProductoDeCarrusel(productoCarruselId: number) {
    const query = ` mutation { eliminarProductoDeCarrusel(productoCarruselId: ${productoCarruselId}) {
                              carruselId,
                              descripcion,
                              respuesta
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const productoEliminado = r.json().data.eliminarProductoDeCarrusel;
      return productoEliminado;
    });
  }

  ObtenerCarruselAeditar(carruselId: number) {
    const query = ` query { carruselConProductos (carruselId: ${carruselId}) {
                              carruselId,
                              carrusel,
                              descripcion,
                              paginaId,
                              enlace,
                              textoVerMas,
                              carruselTipoId,
                              cantidadDeProductosVisiblesEnMovil,
                              productos {
                                productoCarruselId,
                                productoId,
                                fechaInicioActivo,
                                fechaFinActivo,
                                orden,
                                descripcion,
                                carruselId
                              }
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaCarruseles = r.json().data.carruselConProductos;
      return listaCarruseles;
    });
  }
}
