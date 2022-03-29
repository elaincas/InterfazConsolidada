import { isNullOrUndefined } from "util";
import { VariablesGlobalesModel } from "./VariablesGlobales.model";

export const VariablesGlobales: VariablesGlobalesModel = {
  get CodigoEmpresa() {
    return ObtenerCodigoEmpresa();
  },
  get CodigoPais() {
    return ObtenerCodigoPais();
  },
  get PaisId() {
    return ObtenerPaisId();
  },
  get NombreEmpresa() {
    return ObtenerNombreEmpresa();
  },
  get RutaImagenPais() {
    return ObtenerRutaImagenPais();
  },
};

export function ObtenerCodigoEmpresa() {
  let CodigoEmpresa = "2";
  if (!isNullOrUndefined(localStorage.getItem("CodigoEmpresa"))) {
    CodigoEmpresa = localStorage.getItem("CodigoEmpresa");
  }
  return CodigoEmpresa;
}

export function ObtenerCodigoPais() {
  let CodigoPais = "HN";
  if (!isNullOrUndefined(localStorage.getItem("CodigoPais"))) {
    CodigoPais = localStorage.getItem("CodigoPais");
  }
  return CodigoPais;
}

export function ObtenerPaisId() {
  let Id = 1;
  if (!isNullOrUndefined(localStorage.getItem("PaisId"))) {
    Id = parseInt(localStorage.getItem("PaisId"));
  }
  return Id;
}

export function ObtenerNombreEmpresa() {
  let NombreEmpresa = "SUPER FARMACIA SIMÁN";
  if (!isNullOrUndefined(localStorage.getItem("NombreEmpresa"))) {
    NombreEmpresa = localStorage.getItem("NombreEmpresa");
  }
  return NombreEmpresa;
}

export function ObtenerRutaImagenPais() {
  let Ruta = "assets/img/flags/HN.png";
  if (!isNullOrUndefined(localStorage.getItem("RutaImagenPais"))) {
    Ruta = localStorage.getItem("RutaImagenPais");
  }
  return Ruta;
}
