import { Injectable } from '@angular/core';

export class Tab {
  id: number;
  text: string;
  icon: string;
  iconName: string;
  componente: string;
}

let tabs: Tab[] = [
  {
    id: 0,
    text: "Análisis",
    icon: "material-icons",
    iconName: "biotech",
    componente: "RegistroAnalisis"
  },
  {
    id: 2,
    text: "Análisis Parámetros",
    icon: "material-icons",
    iconName: "format_list_bulleted",
    componente: "RegistroAnalisisParametro"
  },
  {
    id: 3,
    text: "Análisis Requisitos",
    icon: "material-icons",
    iconName: "format_list_bulleted",
    componente: "RegistroAnalisisRequisitos"
  },
  {
    id: 4,
    text: "Análisis Insumos",
    icon: "material-icons",
    iconName: "format_list_bulleted",
    componente: "RegistroAnalisisInsumos"
  },
  {
    id: 5,
    text: "Análisis Laboratorios",
    icon: "material-icons",
    iconName: "science",
    componente: "RegistroAnalisisLaboratorios"
  },
];

let tabsParametros: Tab[] = [
  {
    id: 0,
    text: "Parametro",
    icon: "material-icons",
    iconName: "assessment",
    componente: "Parametro"
  },
  {
    id: 2,
    text: "Rangos",
    icon: "material-icons",
    iconName: "list",
    componente: "ParametroRangos"
  }
]

@Injectable()
export class TabService {
  getTabs(): Tab[] {
    return tabs;
  }

  getTabsParametros(): Tab[]{
    return tabsParametros;
  }
}
