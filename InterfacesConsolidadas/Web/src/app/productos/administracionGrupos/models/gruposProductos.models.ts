import { IRespuesta, RespuestaTipo, Respuesta } from "../../../helpers/respuestas/respuesta";
import { helpers } from "../../../helpers/utils";
import { List } from "linqts";


export interface ISubgrupoProductos {
  id: number;
  descripcion: string;
  rutaWeb: string;
  esActivo: boolean;
  esVisible: boolean;
  permiteSubcategorias: boolean;
  productos: Array<any>;
  esValido(respuesta?: IRespuesta): boolean;
  ExcelProductos?: File;
  subcategorias: Array<ISubgrupoProductos>;
  categoriaPadre: ISubgrupoProductos;
  nivel: number;
  agregarSubcategoria(subcategoria: ISubgrupoProductos);
  eliminarSubcategoria(subcategoria: ISubgrupoProductos);
  asAny(): any;
  paginaId: number;
}

export class SubgrupoProductos implements ISubgrupoProductos {
  id: number;
  descripcion: string;
  rutaWeb: string;
  esActivo: boolean;
  esVisible: boolean;
  productos: Array<any>;
  ExcelProductos?: File;
  subcategorias: Array<ISubgrupoProductos>;
  paginaId: number;

  private _categoriaPadre: ISubgrupoProductos;
  get categoriaPadre(): ISubgrupoProductos {
    return this._categoriaPadre;
  }

  set categoriaPadre(categoria: ISubgrupoProductos) {
    this._categoriaPadre = categoria;
    this.definirNivelCategoria();
  }

  get permiteSubcategorias(): boolean {
    return this.nivel < 3;
  }

  private _nivel: number;
  get nivel(): number {
    return this._nivel;
  }

  asAny(): any {
    return this as any;
  }

  constructor(data?: ISubgrupoProductos) {
    this._nivel = 1;
    this.productos = new Array<any>();
    this.subcategorias = new Array<ISubgrupoProductos>();

    if (data == null) {
      this.id = 0;
      this.descripcion = "";
      this.rutaWeb = "";
      this.esActivo = true;
      this.esVisible = true;
      this.paginaId = 0;
      return;
    }

    this.id = data.id;
    this.descripcion = data.descripcion;
    this.rutaWeb = data.rutaWeb;
    this.esVisible = data.esVisible;
    this.productos = data.productos;
    this.paginaId = data.paginaId;

    if (!Array.isArray(data.subcategorias)) {
      return;
    }

    data.subcategorias.forEach(c => {
      let sub = new SubgrupoProductos(c);
      this.subcategorias.push(sub);
    });

  }

  agregarSubcategoria(subcategoria: ISubgrupoProductos) {
    if (!this.permiteSubcategorias) {
      return;
    }

    subcategoria.categoriaPadre = this;
    this.subcategorias.push(subcategoria);
  }

  eliminarSubcategoria(subcategoria: ISubgrupoProductos) {
    let index = this.subcategorias.indexOf(subcategoria);
    if (index == -1) {
      return;
    }
    this.subcategorias.splice(index, 1);
  }

  esValido(respuesta?: IRespuesta): boolean {
    if (helpers.isNull(respuesta)) {
      respuesta = new Respuesta();
    }

    const noHayProductosNiSubgruposCobnProductos = this.productos.length == 0 &&
      this.subcategorias.length == 0 && helpers.isNull(this.ExcelProductos);

    if (noHayProductosNiSubgruposCobnProductos) {
      respuesta.Mensaje = "Debe gregar al menos un producto o una subcategoria con productos";
      respuesta.Tipo = RespuestaTipo.Validacion;
      respuesta.Titulo = "No hay productos o subcategorías";
      return false;
    }

    respuesta.Tipo = RespuestaTipo.Ok;
    return true;
  }

  private definirNivelCategoria(): void {
    let categoriaPadre = this.categoriaPadre;
    while (categoriaPadre !== null && categoriaPadre !== undefined) {
      this._nivel++;
      categoriaPadre = categoriaPadre.categoriaPadre;
    }
  }
}

export interface IGrupoProductos extends ISubgrupoProductos {
  subGrupos: List<SubgrupoProductos>;
  agregarSubGrupo(subGrupo: ISubgrupoProductos): void;
}

export class GrupoProductos
  extends SubgrupoProductos
  implements IGrupoProductos {
  subGrupos: List<SubgrupoProductos>;

  constructor(data?: IGrupoProductos) {
    super();
    this.subGrupos = new List<SubgrupoProductos>();

    if (helpers.isNull(data)) {
      return;
    }

    this.descripcion = data.descripcion;
    this.rutaWeb = data.rutaWeb;
    this.esVisible = data.esVisible;
    this.esActivo = data.esActivo;
    this.productos = data.productos;
    this.id = data.id;
    this.paginaId = data.paginaId;
    this.agregarSubGrupos(data);
  }

  private agregarSubGrupos(data?: IGrupoProductos) {
    if (!Array.isArray(data.subGrupos)) {
      return;
    }

    let elementos = data.subGrupos as Array<ISubgrupoProductos>;

    elementos.forEach(sub => {
      let subGrupo = new SubgrupoProductos(sub);
      this.subGrupos.Add(subGrupo);
    });
  }

  agregarSubGrupo(subGrupo: ISubgrupoProductos) {
    if (helpers.isNull(this.subGrupos)) {
      this.subGrupos = new List<SubgrupoProductos>();
    }

    let nuevoSubGrupo = new SubgrupoProductos();
    nuevoSubGrupo.id = subGrupo.id;
    nuevoSubGrupo.descripcion = subGrupo.descripcion;
    nuevoSubGrupo.esActivo = subGrupo.esActivo;
    nuevoSubGrupo.esVisible = subGrupo.esVisible;
    nuevoSubGrupo.rutaWeb = subGrupo.rutaWeb;
    nuevoSubGrupo.paginaId = subGrupo.paginaId;
    nuevoSubGrupo.ExcelProductos = subGrupo.ExcelProductos;
    subGrupo.productos.forEach(prod => nuevoSubGrupo.productos.push(prod));

    this.subGrupos.Add(nuevoSubGrupo);
  }

  // removerSubGrupo(subGrupo: ISubgrupoProductos) {
  //   console.log(subGrupo);
  //   this.subGrupos.Remove(subGrupo);
  // }

  esValido(respuesta?: IRespuesta): boolean {

    if (helpers.isNull(respuesta)) {
      respuesta = new Respuesta();
    }

    const noHayProductosNiSubgruposCobnProductos = this.productos.length == 0 &&
      !this.subGrupos.Any() && helpers.isNull(this.ExcelProductos);

    if (noHayProductosNiSubgruposCobnProductos) {
      respuesta.Mensaje = "Para agregar un grupo/categoría debe agregar al menos un producto o subgrupo con productos";
      respuesta.Tipo = RespuestaTipo.Validacion;
      respuesta.Titulo = "No hay productos/subgrupos";
      return false;
    }

    respuesta.Tipo = RespuestaTipo.Ok;

    return true;
  }
}

export class Pagina {
  id: number;
  descripcion: string;
  activo: boolean;
}
