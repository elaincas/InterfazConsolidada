import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { addServicio } from "../models/addServicio";
import { Servicio } from "../models/Servicio";
import { Seccion } from "../models/Seccion";
import { Columna } from "../models/Columna";

@Injectable()
export class ServiciosProporcionadosService {
  constructor(private httpAuth: HttpAuthService) { }

  ObtenerSeccionesTipos(): Observable<Array<any>> {
    const query = ` query {tiposSecciones {
                                  id,
                                  descripcion
                                }
                              }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaTipos = r.json().data.tiposSecciones;
      return listaTipos;
    });
  }

  ObtenerListadoServicios(): Observable<Array<any>> {
    const query = ` query { servicios {
                              servicioId,
                              descripcion,
                              subtitulo1,
                              subtitulo2,
                              iconoMovilUrl,
                              iconoWebUrl,
                              tieneFechaDeFinalizacion,
                              fechaFinalizacion,
                              fechaInicio,
                              paginaWebVisible,
                              deshabilitadoPorFechaDeFinalizacion,
                              secciones {
                                id,
                                titulo,
                                iconoUrl,
                                columnas {
                                    id,
                                    contenido,
                                    listaContenido,
                                    titulo,
                                    enlace,
                                    contenidoTipo,
                                    contenidoTipoId
                                },
                                orden
                              },
                              detalles {
                                color,
                                mostrarSobreBanner,
                                nivelTexto,
                                enlace,
                                colorFondoEnlace
                              }
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaServicios = r.json().data.servicios;
      console.log(listaServicios)
      return listaServicios;
    });
  }

  ObtenerPaginas(): Observable<Array<any>> {
    const query = ` query { paginasServicios {
                              paginaId,
                              descripcion,
                              nombre
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaPaginas = r.json().data.paginasServicios;
      return listaPaginas;
    });
  }

  ObtenerUrlBannerPorPaginaSeleccionada(paginaId: number): Observable<Array<any>> {
    const query = ` query { bannersDeServicio(paginaId: ${paginaId}) {
                              bannerUrl,
                              esVersionMovil
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const listaBanners = r.json().data.bannersDeServicio;
      return listaBanners;
    });
  }

  GuardarServicio(servicio: addServicio, usuarioId: number) {
    const query = `mutation guardarServicio($addServicio: ServicioInputType, $usuarioId: Int) {
                        guardarServicio(addServicio: $addServicio, usuarioId: $usuarioId) {
                          descripcion,
                          nombre,
                          subtitulo1
                      }
                   }`;

    let nuevoServicio = `{ descripcion: "${servicio.descripcion}"
                 ,nombre: "${servicio.subtitulo2}"
                 ,subtitulo1: "${servicio.subtitulo1}"
                 ,secciones: [${servicio.secciones}]
                 ,detalles: [${servicio.detalles}]}`;

    const variables = `{ "addServicio": ${nuevoServicio}, "usuarioId": ${usuarioId} }`;

    const request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const query = r.json().data.guardarProductosCarrusel;
      return query;
    });
  }

  ObtenerServicioPorId(servicioId: number) {
    const query = ` query { servicio (servicioId: ${servicioId}) {
                      servicioId,
                      descripcion,
                      subtitulo1,
                      subtitulo2,
                      iconoMovilUrl,
                      iconoWebUrl,
                      tieneFechaDeFinalizacion,
                      fechaInicio,
                      fechaFinalizacion,
                      paginaWebLink,
                      detalles{
                        detalleId,
                        color,
                        enlace,
                        mostrarSobreBanner,
                        nivelTexto,
                        colorFondoEnlace,
                        servicioId
                      }
                    }
                  }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const servicio = r.json().data.servicio;
      return servicio;
    });
  }

  DesactivarServicio(servicioId: number, usuarioId: number) {
    const query = ` mutation { desactivarServicio (servicioId: ${servicioId}, usuarioId: ${usuarioId}) {
                        descripcion,
                        servicioId,
                        descripcion,
                        iconoWebUrl,
                        paginaId,
                        subtitulo1,
                        activo
                    }
                  }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const servicio = r.json().data.servicio;
      return servicio;
    });
  }

  DesactivarSeccion(seccionId: number, usuarioId: number) {
    const query = ` mutation { desactivarSeccion (seccionId: ${seccionId}, usuarioId: ${usuarioId}) {
                      id,
                      titulo
                    }
                  }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const seccion = r.json().data.seccion;
      return seccion;
    });
  }

  DesactivarColumna(columnaId: number, usuarioId: number) {
    const query = ` mutation { desactivarColumna (columnaId: ${columnaId}, usuarioId: ${usuarioId}) {
                      id,
                      titulo
                    }
                  }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).map(r => {
      const columna = r.json().data.columna;
      return columna;
    });
  }

  SubirImagenes(servicio: addServicio, usuarioId: number) {
    const formData = new FormData();
    formData.append("model", JSON.stringify(servicio));

    if (servicio.archivoIconoApp.length > 0) {
      formData.append("iconoApp", servicio.archivoIconoApp[0]);
    }
    if (servicio.archivoIconoWeb.length > 0) {
      formData.append("iconoWeb", servicio.archivoIconoWeb[0]);
    }
    if (servicio.archivoBannerWeb.length > 0) {
      formData.append("bannerWeb", servicio.archivoBannerWeb[0]);
    }
    if (servicio.archivoBannerMovil.length > 0) {
      formData.append("bannerMovil", servicio.archivoBannerMovil[0]);
    }
    servicio.secciones.forEach(seccion => {
      if (seccion.archivoSeccionIcono.length > 0) {
        formData.append(`iconoSeccion^${seccion.titulo.trim()}`, seccion.archivoSeccionIcono[0]);
        seccion.columnas.forEach(columna => {
          if (columna.archivoContenido.length > 0) {
            if (columna.titulo == ''){
              var index = seccion.columnas.indexOf(columna);
              columna.titulo = `col^${seccion.titulo}^${index}`;
            }
            formData.append(`imagenContenido^${columna.titulo.trim()}`, columna.archivoContenido[0]);
          }
        });
      }
    });
    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/SubirArchivos/${usuarioId}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }

  AgregarSeccion(servicio: Servicio, usuarioId: number){
    const formData = new FormData();
    formData.append("model", JSON.stringify(servicio));

    servicio.secciones.forEach(seccion => {
      if (seccion.archivoSeccionIcono.length > 0) {
        formData.append(`iconoSeccion^${seccion.titulo.trim()}`, seccion.archivoSeccionIcono[0]);
        seccion.columnas.forEach(columna => {
          if (columna.archivoContenido.length > 0) {
            if (columna.titulo == ''){
              var index = seccion.columnas.indexOf(columna);
              columna.titulo = `col^${seccion.titulo}^${index}`;
            }
            formData.append(`imagenContenido^${columna.titulo.trim()}`, columna.archivoContenido[0]);
          }
        });
      }
    });
    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/NuevaSeccion/${usuarioId}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }

  NuevaColumna(seccion: Seccion, usuarioId: number){
    const formData = new FormData();
    formData.append("model", JSON.stringify(seccion));
    var columna = seccion.columnas[0];
    if (columna.archivoContenido.length > 0){
      if (columna.titulo == ''){
        columna.titulo = `col^${seccion.titulo}^0`;
      }
      formData.append(`imagenContenido^${columna.titulo.trim()}`, columna.archivoContenido[0]);
    }
    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/NuevaColumna/${usuarioId}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }

  EditarServicio(servicio: Servicio, usuarioId: number) {
    const formData = new FormData();
    formData.append("model", JSON.stringify(servicio));
    if (servicio.archivoIconoApp.length > 0) {
      formData.append("iconoApp", servicio.archivoIconoApp[0]);
    }
    if (servicio.archivoIconoWeb.length > 0) {
      formData.append("iconoWeb", servicio.archivoIconoWeb[0]);
    }
    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/EditarServicio/${usuarioId}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }

  EditarSeccion(seccion: Seccion, usuarioId: number){
    const formData = new FormData();
    formData.append("model", JSON.stringify(seccion));
    if (seccion.archivoSeccionIcono.length > 0) {
      formData.append(`iconoSeccion^${seccion.titulo}`, seccion.archivoSeccionIcono[0]);
    }
    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/EditarSeccion/${usuarioId}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }
  
  EditarColumna(columna: Columna, usuarioId: number){
    const formData = new FormData();
    formData.append("model", JSON.stringify(columna));
    if (columna.archivoContenido.length > 0) {
      formData.append(`imagenContenido^${columna.titulo}`, columna.archivoContenido[0]);
    }
    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/EditarColumna/${usuarioId}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }

  ActualizarOrdenDeSecciones(listaSecciones, usuarioId: number) {
    const formData = new FormData();
    formData.append("model", JSON.stringify(listaSecciones));

    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/ActualizarOrdenDeSecciones/${usuarioId}`;
    return this.httpAuth.post(url, formData).map(r => r.json());
  }

  ActualizarEstadoVisibleEnPaginaWeb(servicioId, visible, usuarioId){
    const url = `${environment.ecommerceApi}/api/Ecommerce/ServiciosProporcionados/ActualizarEstadoVisibleEnPaginaWeb/${servicioId}/${visible}/${usuarioId}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

////// SECUNDARIAS
  cambiarOrdenItem(listaItems, item, sube: boolean){
    const indexItem = listaItems.findIndex( i => i.orden  === item.orden);
    const ordenItem = indexItem + 1;
    const indexUltimo = listaItems.length - 1;
    const ordenUltimo = listaItems.length;

    if (sube && indexItem > 0 ) {
        this.actualizarOrdenDeItems(listaItems, item, indexItem, sube, ordenUltimo);
        item.orden = ordenItem - 1;
    } else if (!sube && indexItem < indexUltimo && indexUltimo !== 0) {
        this.actualizarOrdenDeItems(listaItems, item, indexItem , sube, ordenUltimo);
        item.orden = ordenItem + 1;
    } else {
        return;
    }
}

actualizarOrdenDeItems(listaItems, itemActualizado, indexItem, sube: boolean, ordenUltimo: number) {
    if (itemActualizado.orden >= 1 && sube) {
      const itemAnterior = listaItems.find(p => p.orden === itemActualizado.orden - 1);
      const indexItemAnterior = listaItems.findIndex(p => p.orden === itemActualizado.orden - 1);
      itemAnterior.orden = itemActualizado.orden === ordenUltimo ? ordenUltimo : itemActualizado.orden;
      listaItems[indexItem] = itemAnterior;
      listaItems[indexItemAnterior] = itemActualizado;
    } else if (itemActualizado.orden < ordenUltimo && !sube) {
      const itemSiguiente = listaItems.find(p => p.orden === itemActualizado.orden + 1);
      const indexItemSiguiente = listaItems.findIndex(p => p.orden === itemActualizado.orden + 1);
      itemSiguiente.orden =  itemActualizado.orden;
      listaItems[indexItem] = itemSiguiente;
      listaItems[indexItemSiguiente] = itemActualizado;
    }
  }
}