import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../../environments/environment';
import {HttpAuthService} from '../../../helpers/http/http-auth.service';
import {LoginService} from '../../../login/services/login.service';
import {Color} from '../models/color';
import {AddAtributo} from '../models/addAtributo';
import {forEach} from '@angular/router/src/utils/collection';
import {AreaDeUso} from "../models/areaDeUso";

@Injectable()

export class AdministracionAtributosService {
  constructor(private httpAuth: HttpAuthService,
              private loginService: LoginService) {}
  productosResultado = new Array<any>();
  generos = [{
      'genero': 'Mujeres',
      'inicial': 'M',
    },
    {
      'genero': 'Hombres',
      'inicial': 'H',
    },
    {
      'genero': 'Ambos',
      'inicial': 'A',
    }];

  colores = [{
    'nombre': 'Negro',
    'colorId': 1,
    'hEX': '#000000'
  },
    {
      'nombre': 'AzulSiman',
      'colorId': 2,
      'hEX': '#0058A8'
    },
    {
      'nombre': 'Gris',
      'colorId': 3,
      'hEX': '#808080'
    }];

  atributos = [
    {
      'atributoId': 1,
      'nombre': 'GeneroMeta'
    },
    {
      'atributoId': 2,
      'nombre': 'AreaDeUso'
    },
    {
      'atributoId': 3,
      'nombre': 'Presentación'
    },
    {
      'atributoId': 4,
      'nombre': 'Video'
    },
    {
      'atributoId': 5,
      'nombre': 'Color'
    },
    {
      'atributoId': 6,
      'nombre': 'Tamaño'
    },
    {
      'atributoId': 7,
      'nombre': 'Peso'
    },
    {
      'atributoId': 8,
      'nombre': 'Resolución'
    },
    {
      'atributoId': 1002,
      'nombre': 'RangoEdad'
    }];

  listadoAtributosDeProducto = [
    {
      'productoId': '0005-0004',
      'descripcion': 'L.A.COLORS LIPSTICK CORAL SHEEN C27 3.6G',
      'atributos': [
        {
          'valor': '1',
          'atributo': {
            'nombre': 'Color'
          }
        },
        {
          'valor': '2',
          'atributo': {
            'nombre': 'Color'
          }
        }]
    },
    {
      'productoId': '0005-0066',
      'descripcion': 'L.A.COLORS MINER/CREAMY NATU/CMP303',
      'atributos': [
      {
        'valor': '1',
        'atributo': {
          'nombre': 'Color'
        }
      }]
    }];
  ObtenerProductosPorDescripcion(busqueda: string): Promise<Array<any>> {
    let promesa = new Promise<Array<any>>((resolve, reject) => {
      if (busqueda === null || busqueda.length < 3) {
        resolve(this.productosResultado);
        return;
      }

      let resultadoLocal = this.obtenerProductosEnLocal(busqueda);
      if (resultadoLocal.length > 0) {
        resolve(resultadoLocal);
        return;
      }
      let query = ` query { productosBusqueda (busqueda:"${busqueda}", top:10) {
                                id,
                                descripcion
                          }
                        }`;
      let request = {
        query: query
      };

      return this.httpAuth.post(`${environment.graphApi}`, request).subscribe(r => {
        let queryRespuesta = r.json();
        let listaProductos = queryRespuesta.data.productosBusqueda;
        this.productosResultado = listaProductos as Array<any>;
        this.productosResultado.forEach(producto => {
          producto.searchData = `${producto.id} ${producto.descripcion}`;
        });
        resolve(this.productosResultado);
      });
    });
    return promesa;
  }

  private obtenerProductosEnLocal(descripcion: string): Array<any> {
    return this.productosResultado.filter((elemento) => elemento.descripcion.
    toLocaleLowerCase().indexOf(descripcion.toLocaleLowerCase()) !== -1);
  }

  ObtenerAtributos(): Observable<Array<any>> {
    let query = ` query { atributos {
                              atributoId,
                              nombre
                            }
                          }`;
    let request = {
      query: query
    };
    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let atributos = r.json().data.atributos;
      return atributos;
    });
  }

  ObtenerColores(): Observable<Array<any>> {
    let query = ` query { colores {
                              nombre,
                              colorId,
                              hEX,
                              rGB
                            }
                         }`;
    let request = {
      query: query
    };

    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let colores = r.json().data.colores;
      return colores;
    });
  }

  ObtenerAreasDeUso(): Observable<Array<any>> {
    let query = ` query { areasDeUso {
                              areaDeUsoId,
                              nombre
                            }
                          }`;
    let request = {
      query: query
    };
    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let areasDeUso = r.json().data.areasDeUso;
      return areasDeUso;
    });
  }

  ObtenerAtributosDeProducto(productoId): Observable<Array<any>> {
    let query = ` query { atributosDeProducto(productoId: "${productoId}") {
                                atributoProductoId,
                                productoId,
                                atributoId,
                                valor,
                                usuarioAgrega,
                                atributo {
                                  nombre
                                }
                            }
                         }`;
    let request = {
      query: query
    };

    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let atributosDeProducto = r.json().data.atributosDeProducto;
      return atributosDeProducto;
    });
  }

  ObtenerListadoProductosConSusAtributos() {
    let query = ` query { listadoAtributosDeProducto {
                              productoId,
                              descripcion,
                              atributos {
                                valor,
                                atributo{
                                  nombre
                                }
                              }
                            }
                          }`;
    let request = {
      query: query
    };

    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let listadoAtributosDeProducto = r.json().data.listadoAtributosDeProducto;
      return listadoAtributosDeProducto;
    });
  }

  AgregarAtributos(atributos: AddAtributo[], productosId): Observable<any> {
    let query = `mutation agregarAtributosAProducto($productos: [ProductoConAtributosInputType]) {
                   agregarAtributosAProducto(productos: $productos){
                     respuesta,
                     productoId
                   }
                 }`;
    let productos = '';
    productosId.forEach( pId => {
      let addProducto = `{  productoId: "${pId}",
                            atributos: [${this.agregarAtributosAProducto(atributos)}],
                            usuarioAgrega: ${this.loginService.Usuario}
                         },`;
      productos += addProducto;
    });
    let variables = `{ "productos": [${productos}] }`;

    let request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let query = r.json().data.agregarColor;
      return query;
    });
  }

  AgregarColor(nuevoColor: Color): Observable<any> {
    let query = `mutation agregarColor($addColor: ColorInputType) {
                      agregarColor(addColor: $addColor) {
                          nombre,
                          respuesta
                      }
                   }`;

    let variables = `{
      "addColor": {
          "nombre": "${nuevoColor.nombre}",
          "rGB": "${nuevoColor.rGB}",
          "hEX": "${nuevoColor.hEX}"
        }
      }`;

    let request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let respuesta = r.json().data.agregarColor;
      return respuesta;
    });
  }

  agregarAtributosAProducto(atributos: AddAtributo[]): string {
    let listaAtributos = '';
    atributos.forEach( a => {
      let atributo = `{ atributoId = ${a.atributoId},
                        valor = "${a.valor}";
                      },`;
      listaAtributos += atributo;
    });
    return listaAtributos;
  }

  AgregarAreaDeUso(nuevaArea: AreaDeUso): Observable<any> {
    let query = `mutation agregarAreaDeUso($addArea: AreaDeUsoInputType) {
                      agregarAreaDeUso(addArea: $addArea) {
                          nombre,
                          respuesta
                      }
                   }`;

    let variables = `{
      "addArea": {
          "nombre": "${nuevaArea.nombre}"
        }
      }`;

    let request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let resultado = r.json().data.agregarAreaDeUso;
      return resultado;
    });
  }

  getGeneros(): Array<any> {
    return this.generos;
  }
  getColores(): Array<any> {
    return this.colores;
  }
  getAtributos(): Array<any> {
    return this.atributos;
  }
  getListaAtributos(): Array<any> {
    return this.listadoAtributosDeProducto;
  }
}
