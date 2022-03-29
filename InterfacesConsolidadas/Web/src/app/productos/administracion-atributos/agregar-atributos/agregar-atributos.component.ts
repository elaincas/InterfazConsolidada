import { Component, OnInit } from '@angular/core';
import {AdministracionAtributosService} from '../services/administracion-atributos.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Alertas, Notificaciones} from '../../../helpers/notificaciones/notificaciones';
import {Color} from '../models/color';
import {AddAtributo} from '../models/addAtributo';
import {Atributo} from '../models/atributo';
import {isUndefined} from 'util';
import {Producto} from '../models/producto';
import {AreaDeUso} from '../models/areaDeUso';
import dataSource from 'devextreme/data/data_source';
import customStorage from 'devextreme/data/custom_store';

@Component({
  selector: 'app-agregar-atributos',
  templateUrl: './agregar-atributos.component.html',
  styleUrls: ['./agregar-atributos.component.css'],
  providers: [AdministracionAtributosService]
})
export class AgregarAtributosComponent implements OnInit {
  constructor(private atributosService: AdministracionAtributosService,
              private router: Router,
              private route: ActivatedRoute) {
    this.configurarDataSource();
    this.nuevoColor = new Color();
    this.nuevosAtributos = [];
    this.nuevaAreaDeUso = new AreaDeUso();
  }

  // -------------------------------------------- **** VARIABLES **** -------------------------------------------- //
  // Control
  // -- Atributos
    producto_seleccionado: any;
    generoSeleccionado: string;
    areaDeUsoSeleccionada: string;
    colorSeleccionado = '#0058A8';
    tamanoIngresado: string;
    urlVideoIngresado: string;
    pesoIngresado: string;
    resolucionIngresada: string;
    presentacionIngresada: string;
      edadInicio = 1;
      edadFin = 1;

  dsProductos: dataSource;
  popPupAgregarColor = false;
  popPupAgregarAreaDeUso = false;
  colorRGB = 'rgb(0,88,168)';

  // Listas
  colores = [];
  generos = [];
  areasDeUso = [];
  productosSeleccionados = [];

  // Modelos
  nuevoColor: Color;
  nuevaAreaDeUso: AreaDeUso;

  // Listas Modelos
  nuevosAtributos: AddAtributo[];
  atributos: Atributo[];
  productos: Producto[];

  // -------------------------------------------- **** FUNCIONES **** --------------------------------------------//
  ngOnInit() {
    this.getGeneros();
    this.ObtenerColores();
    this.ObtenerAtributos();
    this.ObtenerAreasDeUso();
  }

  getGeneros() {
    this.generos = this.atributosService.getGeneros();
  }

  ObtenerColores() {
    this.atributosService.ObtenerColores().subscribe( r => {
      this.colores = r;
    }, error => {
      Alertas.showHttpResponse(error, '¡ERROR!', true);
    });
  }

  ObtenerAreasDeUso() {
    this.atributosService.ObtenerAreasDeUso().subscribe(r => {
      this.areasDeUso = r;
    }, error => {
      Alertas.showHttpResponse(error, '¡ERROR!', true);
    });
  }

  ObtenerAtributos() {
    this.atributosService.ObtenerAtributos().subscribe(r => {
      this.atributos = r;
    }, error => {
      Alertas.showHttpResponse(error, '¡ERROR!', true);
    });
  }

  configurarDataSource() {
    const custom = new customStorage({
      load: this.buscarProductos.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve();
      }),
    });

    this.dsProductos = new dataSource({
      store: custom
    });
  }

  buscarProductos(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dsProductos.searchValue();
      this.atributosService.ObtenerProductosPorDescripcion(textoBusqueda)
        .then(data => resolve(data));
    });
  }

  AgregarColor() {
    if (this.nuevoColor.nombre === '') {
      Notificaciones.error(`Debe ingresar un nombre para el nuevo color`);
      return;
    }
    let nuevoColor = new Color();
    nuevoColor.rGB = this.colorRGB;
    nuevoColor.nombre = this.nuevoColor.nombre;
    nuevoColor.hEX = this.nuevoColor.hEX;
    this.atributosService.AgregarColor(nuevoColor).subscribe(r => {
      this.colores.push(nuevoColor);
      Notificaciones.success(`¡El color '${nuevoColor.nombre}' se ha agregado a la lista de colores!`);
    }, error => {
      let body = JSON.parse(error._body);
      Notificaciones.error(`${body[0].Message}`);
    });
    this.nuevoColor = new Color();
  }

  GuardarProductosConAtributos() {
    if (!this.ValidarDatosAguardar()) {
      return;
    }
    this.agregarProductos(this.productosSeleccionados);
    this.atributosService.AgregarAtributos(this.nuevosAtributos, this.productos).subscribe(r => {
      Notificaciones.success(`${r}`);
      Alertas.ok('¡Correcto!', `${r}`);
    }, error => {
      Alertas.showHttpResponse( error, 'ERROR',  true);
    });
  }

  ValidarDatosAguardar(): boolean {
    if (this.productosSeleccionados.length <= 0) {
      Alertas.error('¡ERROR!', `Debe seleccionar al menos 1 producto`);
      return false;
    }
    if (this.nuevosAtributos.length <= 0) {
      Alertas.error('¡ERROR!', 'Debe agregar al menos 1 característica');
      return false;
    }
    return true;
  }

  AgregarAreaDeUso() {
    if (this.nuevaAreaDeUso.nombre === '') {
      Notificaciones.error(`Debe ingresar un nombre para el Área que desea agregar`);
      return;
    }
    let nuevaArea = new AreaDeUso();
    nuevaArea.nombre = this.nuevoColor.nombre;
    this.atributosService.AgregarAreaDeUso(nuevaArea).subscribe(r => {
      this.areasDeUso.push(nuevaArea);
      Notificaciones.success(`¡El área '${nuevaArea.nombre}' se ha agregado a la lista!`);
    }, error => {
      let body = JSON.parse(error._body);
      Notificaciones.error(`${body[0].Message}`);
    });
    this.nuevaAreaDeUso = new AreaDeUso();
    this.popPupAgregarAreaDeUso = false;
  }
  // ------------------------------------- **** Funciones Secundarias **** -------------------------------------- //
  OnAgregarColor() {
    this.popPupAgregarColor = true;
  }

  OnAgregarAreaDeUso() {
    this.popPupAgregarAreaDeUso = true;
  }

  OnAgregarProducto(producto) {
    if (isUndefined(producto) || producto === null) {
      return;
    }
    if (this.yaSeAgregoAlaLista(producto.id)) {
      Notificaciones.error(`Ya se agregó este producto`);
      return;
    }
    this.productosSeleccionados.push(producto);
    Notificaciones.success(`Producto agregado`);
  }

  onAgregarAtributo(atributoNombre, valor) {
    if (isUndefined(valor)) {
      Notificaciones.error(`Debe ingresar un valor para esta característica`);
      return;
    }
    if (atributoNombre === 'RangoEdad') {
      valor = `${this.edadInicio},${this.edadFin}`;
    }
    let yaExisteEnLista = this.nuevosAtributos.find(a => a.valor === valor) ? true : false;
    console.log(valor);
    if (yaExisteEnLista) {
      Notificaciones.error(`La característica que está intentando agregar ya se encuentra en la lista`);
      return;
    }
    if (this.sugerirGeneroMeta(atributoNombre)) {
      return;
    }
    let nuevoAtributo = new AddAtributo();
    let valorMostrar = this.obtenerValorAmostrarDeAtributo(atributoNombre);
    nuevoAtributo.atributoId = this.buscarIdAtributo(atributoNombre).atributoId;
    nuevoAtributo.valor = valor;
    nuevoAtributo.nombre = atributoNombre;
    nuevoAtributo.valorMostrar = valorMostrar ? valorMostrar : valor;
    this.nuevosAtributos.push(nuevoAtributo);
  }

  quitarAtributoDeLista(atributo) {
    let index = this.nuevosAtributos.findIndex(a => a.valor === atributo.valor && a.nombre === atributo.nombre);
    this.nuevosAtributos.splice(index, 1);
  }

  inicializarVariables() {
    this.colorSeleccionado = '#0058A8';
    this.colorRGB = 'rgb(0,88,168)';
    this.nuevoColor = new Color();
    this.nuevosAtributos = [];
    this.nuevaAreaDeUso = new AreaDeUso();
    this.productosSeleccionados = [];
  }
  // ------------------------------------- **** Funciones Auxiliares **** -------------------------------------- //
  agregarProductos(listaProductosSeleccionados) {
    let producto = new Producto();
    listaProductosSeleccionados.forEach( p => {
      producto.id = p.id;
      producto.nombre = p.nombre;
      this.productos.push(producto);
    });
  }
  yaSeAgregoAlaLista(productoId): boolean {
    const index = this.productosSeleccionados.findIndex(p => p.id === productoId);
    return index !== -1;
  }

  imprimir(data, evento) {
    console.log(this.colorSeleccionado);
  }

  sugerirGeneroMeta(atributoNombre) {
    if (atributoNombre !== 'GeneroMeta') { return false; }
    let yaExisteAtributoGeneroMeta = this.nuevosAtributos.find(a => a.nombre === 'GeneroMeta');
    if (this.generoSeleccionado === 'Ambos' && yaExisteAtributoGeneroMeta) {
      Notificaciones.error('Elimina el género meta que se encuentra en la lista para poder agregar -Ambos-');
      return true;
    }
    if (yaExisteAtributoGeneroMeta) {
      Notificaciones.show('Ya agregaste un género meta a la lista, mejor eliminalo y agrega -Ambos- a la lista', 'info', 30);
      return true;
    }
  }

  obtenerValorAmostrarDeAtributo(atributoNombre) {
    if (atributoNombre === 'Color') {
      return this.colores.find( c => c.hEX === this.colorSeleccionado).nombre;
    }

    if (atributoNombre === 'AreaDeUso') {
      return this.areasDeUso.find( a => a.areaDeUsoId === this.areaDeUsoSeleccionada).nombre;
    }
  }

  buscarIdAtributo(atributoNombre: string) {
    if (atributoNombre === '') { return; }
    return this.atributos.find(a => {
      return a.nombre.toLowerCase().trim() === atributoNombre.toLowerCase().trim();
    });
  }

  hexToRgb(hex) {
    if (!hex) {
      return;
    }
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgb = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
    this.colorRGB = `rgb(${[rgb.r, rgb.g, rgb.b].join()})`;
  }

  getColores() {
    this.colores = this.atributosService.getColores();
  }
  getAtributos() {
    this.atributos = this.atributosService.getAtributos();
  }
}
