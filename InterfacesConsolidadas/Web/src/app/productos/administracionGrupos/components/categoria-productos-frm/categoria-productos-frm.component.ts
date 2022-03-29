import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AgrupadorProductosComponent, ICustomEventAsync } from '../../../agrupador-productos/agrupador-productos';
import {DxLookupComponent, DxTextBoxComponent} from 'devextreme-angular';
import { IRespuesta, RespuestaTipo, Respuesta } from '../../../../helpers/respuestas/respuesta';
import { helpers } from '../../../../helpers/utils';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { List } from 'linqts';
import { ISubgrupoProductos, SubgrupoProductos } from '../../models/gruposProductos.models';
import { IProducto } from '../../../agrupador-productos/models/producto.model';
import { CategoriasProductosService } from '../../services/categorias-productos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Forms } from '../../../../helpers/forms';

@Component({
  selector: 'app-categoria-productos-frm',
  templateUrl: './categoria-productos-frm.component.html'
})
export class CategoriaProductosFrmComponent implements OnInit {

  categoria: ISubgrupoProductos;
  constructor(
    private categoriasProductosService: CategoriasProductosService,
    private router: Router,
    private route: ActivatedRoute) {
    this.categoria = new SubgrupoProductos();
    console.log(this.categoria)
  }


  crearBindingModificacion(categoria: ISubgrupoProductos) {
    let categoriaBinding = categoria as any;
    let original: any = {};
    original.descripcion = categoriaBinding.descripcion
    original.rutaWeb = categoriaBinding.rutaWeb
    original.ExcelProductos = categoriaBinding.ExcelProductos
    original.esVisible = categoriaBinding.esVisible
    categoriaBinding.original = original;
    return false;
  }

  get esFormularioModificado(): boolean {
    let categoriaBinding = this.categoria as any;
    if (helpers.isNull(categoriaBinding.original)) {
      this.crearBindingModificacion(this.categoria);
      return false;
    }

    if (categoriaBinding.original.descripcion !== this.categoria.descripcion) {
      return true;
    }

    if (categoriaBinding.original.rutaWeb !== this.categoria.rutaWeb) {
      return true;
    }

    if (helpers.isNull(categoriaBinding.original.ExcelProductos) !== helpers.isNull(this.categoria.ExcelProductos)) {
      return true;
    }

    if (categoriaBinding.original.esVisible !== this.categoria.esVisible) {
      return true;
    }

    return false;
  }

  @ViewChild('productosCmp')
  private productosGrupoComponent: AgrupadorProductosComponent;

  @ViewChild('txtRutaWeb')
  private txtRutaWeb: DxTextBoxComponent;

  @ViewChild('txtDescripcion')
  private txtDescripcion: DxTextBoxComponent;

  @ViewChild('luePaginaId')
  private luePaginaId: DxLookupComponent;

  get mostrarIrCategoriaAnterior(): boolean {
    return this.categoria.nivel != 1;
  }

  get esSubCategoria() {
    return this.categoria.nivel != 1;
  }

  get mostrarBtnCancelar(): boolean {
    if (this.esModoAgregar) {
      return true;
    }

    if (this.categoria.id === 0) {
      return true;
    }

    return this.esFormularioModificado;
  }

  get mostrarBtnGuardar(): boolean {

    if (this.esModoAgregar) {
      return this.categoria.nivel == 1;
    }

    if (this.categoria.nivel == 2 && this.categoria.id === 0) {
      return true;
    }

    if (this.categoria.nivel == 3 && this.categoria.categoriaPadre.id == 0) {
      return false;
    }

    if (this.categoria.id === 0) {
      return true;
    }

    return this.esFormularioModificado;
  }

  get esModoAgregar(): boolean {
    return this.modo == Forms.Modo.Agregar;
  }
  modo: Forms.Modo = Forms.Modo.Agregar;

  ngOnInit() {
    this.configurarModoFormulario();
    this.obtenerPaginas();
  }

  paginas: any;
  public obtenerPaginas() {
    this.categoriasProductosService.obtenerPaginas().subscribe(
      r => { this.paginas =  r;
      });
  }
  configurarModoFormulario() {
    this.route.url.subscribe(rutas => {
      let ruta = rutas.find(x => x.path == 'crear');
      if (!helpers.isNull(ruta)) {
        window.loader.hide();
        return;
      };

      this.modo = Forms.Modo.Actualizar;
      this.route.params.subscribe(params => {
        let id = params.id as number;
        this.cargarGrupo(id);
      });

    });
  }

  cargarGrupo(categoriaId: number) {
    this.categoriasProductosService.obtenerCategoriaProductos(categoriaId).subscribe(categoria => {
      this.categoria = categoria;
      this.inputExcelClear();
      this.crearBindingModificacion(this.categoria);
      window.loader.hide(100);
    });
  }

  nuevaSubcategoria() {
    if (!this.categoria.permiteSubcategorias) {
      return;
    }

    if (!this.sonControlesValidos()) {
      return;
    }

    let nuevaCategoria = new SubgrupoProductos();
    this.categoria.agregarSubcategoria(nuevaCategoria);
    this.asginarCategoriaEnFormulario(nuevaCategoria);
    this.limpiarValidacionesTextboxes();
  }

  asginarCategoriaEnFormulario(subcategoria: ISubgrupoProductos) {
    this.categoria = subcategoria;
    this.inputExcelAgregarArchivo(this.categoria.ExcelProductos);
    this.asignarNavegacionCategoria();
    this.txtDescripcion.validator.adapter.focus();
  }

  editarSubcategoria(subcategoria: ISubgrupoProductos) {
    if (this.esModoAgregar) {
      this.asginarCategoriaEnFormulario(subcategoria);
      return;
    }

    if (helpers.isNull(subcategoria.asAny().cargada)) {
      subcategoria.asAny().cargada = false;
    }

    // if (subcategoria.asAny().cargada) {
    //   this.asginarCategoriaEnFormulario(subcategoria);
    //   return;
    // }

    this.cargarSubCategoria(this.categoria, subcategoria);
  }

  cargarSubCategoria(categoriaPadre: ISubgrupoProductos, subcategoria: ISubgrupoProductos) {
    this.categoriasProductosService.obtenerSubCategoriaProductos(subcategoria.id).subscribe(sub => {
      sub.paginaId = subcategoria.paginaId;
      categoriaPadre.eliminarSubcategoria(subcategoria);
      categoriaPadre.agregarSubcategoria(sub);
      this.asginarCategoriaEnFormulario(sub);
      this.inputExcelClear();
      sub.asAny().cargada = true;
      this.crearBindingModificacion(sub);
    });
  }

  irCategoriaAnterior() {
    if (this.esModoAgregar || this.categoria.id == 0) {
      if (this.categoria.nivel == 1) {
        return;
      }

      if (!this.esValido(null, true)) {
        return;
      }

      this.asginarCategoriaEnFormulario(this.categoria.categoriaPadre);
      return;
    }

    if (this.esFormularioModificado) {
      Alertas.question("¿Está seguro que desea cambiar de nivel?",
        "Actualmente hay cambios sin guardar, si cambia de nivel estos no se guardarán")
        .then(() => {
          this.asginarCategoriaEnFormulario(this.categoria.categoriaPadre);
        });
      return;
    }

    this.asginarCategoriaEnFormulario(this.categoria.categoriaPadre);
  }

  sonControlesValidos(): boolean {
    this.txtDescripcion.validator.adapter.validator.validate();
    if (!this.txtDescripcion.isValid) {
      this.txtDescripcion.validator.adapter.focus();
      return false;
    }

    this.txtRutaWeb.validator.adapter.validator.validate();
    if (!this.txtRutaWeb.isValid) {
      this.txtRutaWeb.validator.adapter.focus();
      return false;
    }
    return true;
  }

  navegacionCategoria: string;
  asignarNavegacionCategoria() {
    if (helpers.isNull(this.categoria.categoriaPadre)) {
      this.navegacionCategoria = '';
      return;
    }

    let categoria = this.categoria.categoriaPadre;
    let navegacion = [];
    while (categoria !== null && categoria !== undefined) {
      navegacion.push(categoria.descripcion);
      categoria = categoria.categoriaPadre;
    }
    navegacion = navegacion.reverse();

    this.navegacionCategoria = '';
    navegacion.forEach(el => {
      this.navegacionCategoria = `${this.navegacionCategoria} \\ ${el}`;
    });
  }

  private _esValido: boolean = false;
  esValido(respuesta?: IRespuesta, mostrarMensaj: boolean = false): boolean {

    if (!this.sonControlesValidos()) {
      return false;
    }

    if (helpers.isNull(respuesta)) {
      respuesta = new Respuesta();
    }

    if (!this.categoria.esValido(respuesta)) {
      this.mostrarMensaje(respuesta);
      return false;
    }

    return true;
  }

  alEliminarUnProducto(evento: ICustomEventAsync<IProducto>): void {
    if (this.categoria.id == 0) {
      return;
    }

    evento.promise = new Promise((resolve, reject) => {
      Alertas.question("¿Desea eliminar el producto?").then(() => {
        resolve(evento.value);
        if (this.esSubCategoria) {
          this.categoriasProductosService.eliminarProductoSubcategoria(this.categoria.id, evento.value.id).subscribe();
          return;
        }

        this.categoriasProductosService.eliminarProductCategoria(this.categoria.id, evento.value.id).subscribe();
      });
    });
  }

  antesDeAgregarUnProducto(evento: ICustomEventAsync<IProducto>): void {
    if (this.categoria.id == 0) {
      return;
    }

    if (this.esSubCategoria) {
      this.agregarProductoEnSubcategoria(this.categoria.id, evento);
      return;
    }

    this.agregarProductoEnCategoria(this.categoria.id, evento);
  }


  agregarProductoEnSubcategoria(subcategoriaId: number, evento: ICustomEventAsync<IProducto>) {
    evento.promise = new Promise((resolve, reject) => {
      this.categoriasProductosService.agregarProductoEnSubcategoria(subcategoriaId, evento.value.id).subscribe(response => {
        resolve(evento.value);
      }, error => {
        reject(error);
      });
    });
  }

  agregarProductoEnCategoria(categoriaId: number, evento: ICustomEventAsync<IProducto>) {
    evento.promise = new Promise((resolve, reject) => {

      this.categoriasProductosService.agregarProductoEnCategoria(categoriaId, evento.value.id).subscribe(response => {
        resolve(evento.value);
      }, error => {
        reject(error);
      });

    });
  }

  guardar() {

    if (!this.esValido(null, true)) {
      return;
    }

    if (this.esModoAgregar) {
      this.guardarCrear();
      return;
    }

    if (this.categoria.id !== 0) {
      this.guardarModificar();
      return;
    }

    if (this.categoria.nivel == 2) {
      this.guardarCrearSubcategoriaSegundoNivel();
      return;
    }

    this.guardarCrearSubcategoriaTercerNivel();
  }

  guardarModificar() {
    Alertas.load();

    if (!this.esSubCategoria) {
      this.categoriasProductosService.ActualizarCategoria(this.categoria).subscribe(x => {
        this.cargarGrupo(this.categoria.id);
        Alertas.datosModificados();
      }, error => {
        Alertas.showHttpResponse(error);
      });
      return;
    }

    this.categoriasProductosService.ActualizarSubCategoria(this.categoria).subscribe(x => {
      this.cargarSubCategoria(this.categoria.categoriaPadre, this.categoria);
      Alertas.datosModificados();
    }, error => {
      Alertas.showHttpResponse(error);
    });

  }

  goToCategorias() {
    this.router.navigate(['/productos/categorias']);
  }

  guardarCrear() {
    if (!this.esValido(null, true)) {
      return;
    }

    Alertas.load();
    this.categoriasProductosService.agregarCategoria(this.categoria).subscribe(response => {
      Alertas.ok("Categoría Creada", response);
      this.goToCategorias();
      console.log(response);
    });
  }

  guardarCrearSubcategoriaSegundoNivel() {
    if (!this.esValido(null, true)) {
      return;
    }

    Alertas.load();
    this.categoriasProductosService.agregarSubCategoria(this.categoria.categoriaPadre.id, this.categoria).subscribe(response => {
      Alertas.ok("La subcategoría fue creada");
      this.categoria.id = response as number;
      this.cargarSubCategoria(this.categoria.categoriaPadre, this.categoria);
      this.crearBindingModificacion(this.categoria);
    });
  }

  guardarCrearSubcategoriaTercerNivel() {
    if (!this.esValido(null, true)) {
      return;
    }

    Alertas.load();
    let subcategoriaId = this.categoria.categoriaPadre.id;
    let categoriaId = this.categoria.categoriaPadre.categoriaPadre.id;
    this.categoriasProductosService.agregarSubCategoriaTercerNivel(categoriaId, subcategoriaId, this.categoria).subscribe(response => {
      Alertas.ok("La subcategoría fue creada");
      this.categoria.id = response as number;
      this.cargarSubCategoria(this.categoria.categoriaPadre, this.categoria);
    });
  }

  eliminarSubcategoria(subcategoria: ISubgrupoProductos) {
    Alertas.question("¿Desea eliminar el subgrupo/subcategoría").then(() => {
      this.categoria.eliminarSubcategoria(subcategoria);
      Alertas.ok("", "subcategoría eliminada correctamente.");
      if (subcategoria.id != 0) {
        this.categoriasProductosService.eliminarSubcategoria(subcategoria.id).subscribe();
      }
    });
  }

  cancelarAgregarSubcategoria() {
    let categoria = this.categoria;
    let categoriaPadre = this.categoria.categoriaPadre;

    this.limpiarFormulario(true, '¿Está seguro que no quiere agregar esta subcategoría?').then(() => {
      categoriaPadre.eliminarSubcategoria(categoria);
      this.asginarCategoriaEnFormulario(categoriaPadre);
    });
  }

  cancelar() {

    if (this.categoria.id == 0 && this.categoria.nivel != 1) {
      this.cancelarAgregarSubcategoria();
      return;
    }

    if (this.categoria.nivel == 1 && this.esFormularioVacio) {
      this.goToCategorias();
      return;
    }

    if (this.categoria.nivel == 1) {
      Alertas.question("¿Está seguro que desea salir?", "").then(() => {
        this.goToCategorias();
      });
      return;
    }

    Alertas.question("¿Está seguro que no desea mantener los cambios en la subcategoría?", "").then(() => {
      this.cargarSubCategoria(this.categoria.categoriaPadre, this.categoria);
    });
  }

  mostrarMensaje(respuesta: IRespuesta) {
    if (helpers.isNullEmptyOrWhiteSpace(respuesta.Mensaje)) {
      return;
    }
    Alertas.show(respuesta);
  }


  get esFormularioVacio(): boolean {
    if (!helpers.isNullEmptyOrWhiteSpace(this.categoria.descripcion)) {
      return false;
    }

    if (!helpers.isNullEmptyOrWhiteSpace(this.categoria.rutaWeb)) {
      return false;
    }

    if (this.categoria.productos.length > 0 || this.archivosExcel.length != 0) {
      return false;
    }

    return true;
  }

  public limpiarFormulario(preguntar: boolean = false, mensaje: string = '¿Desea limpiar el formulario?'): Promise<any> {
    const promesa = new Promise((resolve, reject) => {
      if (preguntar && !this.esFormularioVacio) {
        Alertas.question(mensaje).then(() => {
          this.limpiarFormulario(false);
          resolve();
        }).catch(() => {
          reject()
        });
        return;
      }

      this.limpiarValidacionesTextboxes();
      this.productosGrupoComponent.limpiar();
      this.categoria.esVisible = true;
      this.inputExcelClear();
      resolve();
    });
    return promesa;
  }

  limpiarValidacionesTextboxes() {
    this.txtDescripcion.validator.adapter.reset();
    this.txtDescripcion.isValid = true;
    this.txtRutaWeb.validator.adapter.reset();
    this.txtRutaWeb.isValid = true;
  }

  public archivosExcel = new Array<File>();
  inputExcelChanged(): void {
    if (this.archivosExcel.length == 0) {
      this.categoria.ExcelProductos = null;
      return;
    }
    this.categoria.ExcelProductos = this.archivosExcel[0];
  }

  inputExcelClear(): void {
    this.archivosExcel = [];
  }

  inputExcelAgregarArchivo(file: File) {
    this.inputExcelClear();
    if (helpers.isNull(file)) {
      return;
    }
    this.archivosExcel.push(file);
  }

  public inputRutaWebRules = [{
    type: 'required',
    message: 'La ruta web es requerida'
  },
  {
    type: 'pattern',
    pattern: '^[a-zA-Z0-9ñ-]*$',
    message: 'Por favor no utilice espacios, puntos o signos.'
  }];

  public inputDescripcionRules = [
    {
      type: 'required',
      message: 'La descripción es requerida'
    },
    {
      type: 'pattern',
      pattern: '.{4,}',
      message: 'La descripción mínima es de 4 caracteres'
    }];

}
