import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { LoginService } from "../../../login/services/login.service";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../../environments/environment";
import { Sucursal } from "../cupones-admin/models/Sucursal";
import { AddCuponDto } from "../cupones-admin/models/AddCuponDto";
import { Cupon } from "../cupones-admin/models/Cupon";
import { CuponesSucursales } from "../cupones-admin/models/CuponesSucursales";
import { AddCuponSucursales } from "../cupones-admin/models/AddCuponSucursales";

@Injectable()
export class CuponesAdminService {
  constructor(private http: Http,
    private httpAuth: HttpAuthService,
    private loginService: LoginService) {

    this.accion = {
      guardar: 1,
      editar: 2
    };
  }

  accion: {
    guardar: number,
    editar: number
  };

  ObtenerListaCuponesConSucursalesAsigandas() {
    const query = ` query { listaCupones {
                              cuponID,
                              descripcion,
                              rangoBoletos,
                              factorPuntosExtra,
                              soloMedicamentos,
                              todasLasSucursales,
                              activo,
                              sucursales {
                                codigo,
                                nombre
                              }
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(environment.mercadeoGraph, request).map(r => {
      let query = r.json();
      let listaSucursales = query.data.listaCupones;
      return listaSucursales;
    });
  }

  ObtenerCuponConSucursalesPorId(cuponId: number) {
    const query = ` query { cuponAeditar(cuponId: ${cuponId}) {
                              cuponID
                              descripcion
                              rangoInicio
                              rangoFin
                              fechaInicio
                              fechaFin
                              factorPuntosExtra
                              montoMinimoFactura
                              montoMaximoFactura
                              soloMedicamentos
                              todasLasSucursales
                              tieneLimiteMontoEnFactura
                              sucursales {
                                codigo,
                                nombre
                              }
                            }
                          }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(environment.mercadeoGraph, request).map(r => {
      let query = r.json();
      let listaSucursales = query.data.cuponAeditar;
      return listaSucursales;
    });
  }

  ObtenerSucurales(): Observable<Array<any>> {
    const query = ` query { sucursales { codigo, nombre } }`;
    const request = {
      query: query
    };
    return this.httpAuth.post(environment.mercadeoGraph, request).map(r => {
      let query = r.json();
      let sucursales = query.data.sucursales as Sucursal[];
      return sucursales;
    });
  }

  CrearCupon(addCupon: Cupon, cuponSucursales: AddCuponSucursales): Observable<any> {
    let query = `mutation crearCupon($addCupon: CuponInputType, $addCuponSucursales: CuponesSucursalesInputType) {
                    crearCupon(cupon: $addCupon, cuponSucursales: $addCuponSucursales) {
                        cuponID
                        descripcion
                        rangoInicio
                        rangoFin
                        fechaInicio
                        fechaFin
                        factorPuntosExtra
                        montoMinimoFactura
                        montoMaximoFactura
                        soloMedicamentos
                        usuarioId
                        todasLasSucursales
                        tieneLimiteMontoEnFactura
                        respuesta
                    }
                 }`;

    let variablesCrearCupon = this.queryVariablesParaCupon(this.accion.guardar, addCupon);

    let variablesAsignarSucursales = `
      "addCuponSucursales": {
         "sucursales": [${ cuponSucursales.sucursales}]
      } `;

    const request = {
      query: query,
      variables: `{ ${variablesCrearCupon}, ${variablesAsignarSucursales} }`
    };
    return this.httpAuth.post(environment.mercadeoGraph, request).map(r => {
      let query = r.json();
      return query.data.crearCupon;
    });
  }

  EditarCupon(editCupon: Cupon, cuponSucursales: AddCuponSucursales): Observable<any> {
    let query = `mutation editarCupon($addCupon: CuponInputType, $cuponId: Int, $addCuponSucursales: CuponesSucursalesInputType) {
                    editarCupon(cupon: $addCupon, cuponId: $cuponId, cuponSucursales: $addCuponSucursales) {
                        cuponID
                        descripcion
                        rangoInicio
                        rangoFin
                        fechaInicio
                        fechaFin
                        factorPuntosExtra
                        montoMinimoFactura
                        montoMaximoFactura
                        soloMedicamentos
                        usuarioId
                        todasLasSucursales
                        tieneLimiteMontoEnFactura
                        respuesta
                    }
                 }`;

    let variablesCrearCupon = this.queryVariablesParaCupon(this.accion.editar, editCupon);

    let variablesAsignarSucursales = `
      "addCuponSucursales": {
         "sucursales": [${ cuponSucursales.sucursales}],
         "sucursalesEliminadas": [${ cuponSucursales.sucursalesEliminadas}]
      }`;

    const request = {
      query: query,
      variables: `{ ${variablesCrearCupon}, ${variablesAsignarSucursales},  "cuponId": ${editCupon.cuponID} }`
    };
    return this.httpAuth.post(environment.mercadeoGraph, request).map(r => {
      let query = r.json();

      return query.data.editarCupon;
    });
  }

  ActivarDesactivarCupon(cuponId: number, accion: boolean) {
    let query = `mutation activarDesactivarCupon($cuponId: Int, $activar: Boolean) {
                        activarDesactivarCupon(cuponId: $cuponId, activar: $activar){
                          cuponID
                          descripcion
                          respuesta
                        }
                 }`;

    let variables = `{ "cuponId": ${cuponId}, "activar": ${accion} }`;
    const request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(environment.mercadeoGraph, request).map(r => {
      let query = r.json();
      return query.data.activarDesactivarCupon;
    });
  }

  EliminarSucursalDeCupon(cuponId: number, sucursalId: number) {
    let query = `mutation eliminarSucursalDeCupon($cuponId: Int, $sucursalId: Int) {
                      eliminarSucursalDeCupon(cuponId: $cuponId, sucursalId: $sucursalId){
                                            cuponID
                                            descripcion
                                            respuesta
                                          }
                 }`;
    let variables = `{ "cuponId": ${cuponId}, "sucursalId": ${sucursalId} }`;
    const request = {
      query: query,
      variables: variables
    };
    return this.httpAuth.post(environment.mercadeoGraph, request).map(r => {
      let query = r.json();
      return query.data.eliminarSucursalDeCupon;
    });
  }



  // SECUNDARIAS
  queryVariablesParaCupon(accion, cupon: Cupon) {
    let fechas = ``;
    if (accion === this.accion.editar) {
      fechas = `  "fechaInicio": "${cupon.fechaInicio}",
                    "fechaFin": "${ cupon.fechaFin}",`;
    } else {
      fechas = `"fechaInicio": "${cupon.fechaInicio.toDateString()}",
                  "fechaFin": "${ cupon.fechaFin.toDateString()}",`;
    }
    const variablesCrearCupon = `
      "addCupon": {
         "descripcion": "${ cupon.descripcion}",
         "rangoInicio": ${ cupon.rangoInicio},
         "rangoFin": ${ cupon.rangoFin},
          ${ fechas}
         "factorPuntosExtra": ${ cupon.factorPuntosExtra},
         "montoMinimoFactura": ${ cupon.montoMinimoFactura},
         "montoMaximoFactura": ${ cupon.montoMaximoFactura},
         "soloMedicamentos": ${ cupon.soloMedicamentos},
         "usuarioId": ${ cupon.usuarioId},
         "todasLasSucursales": ${ cupon.todasLasSucursales},
         "tieneLimiteMontoEnFactura": ${ cupon.tieneLimiteMontoEnFactura}
      }`;
    return variablesCrearCupon;
  }

}
//
// interface Request {
//   query: string;
//   variables: string;
// }
