import { Component, OnInit } from '@angular/core';
import {AddProducto} from '../models/addProducto';
import {ProductosCarruselService} from '../services/productos-carrusel.service';
import {isUndefined} from 'util';
import dataSource from 'devextreme/data/data_source';
import customStorage from 'devextreme/data/custom_store';
import {Alertas, Notificaciones} from '../../../helpers/notificaciones/notificaciones';
import {LoginService} from '../../../login/services/login.service';
import {Forms} from '../../../helpers/forms';
import {helpers} from '../../../helpers/utils';
import {ActivatedRoute, Router} from "@angular/router";
import {Carrusel} from "../models/Carrusel";

@Component({
  selector: 'app-agregar-productos-carrusel',
  templateUrl: './agregar-productos-carrusel.component.html',
  styleUrls: ['./agregar-productos-carrusel.component.css'],
  providers: [ProductosCarruselService, LoginService]
})
export class AgregarProductosCarruselComponent implements OnInit {
  constructor( private serviceCarrusel: ProductosCarruselService,
               private loginService: LoginService,
               private route: ActivatedRoute,
               private router: Router) {
    this.fechaInicio = new Date(Date.now());
    this.fechaFin = new Date(Date.now());
    this.minDate = new Date(Date.now());
    this.addProducto = new AddProducto();
    this.carrusel = new Carrusel();
  }

  // ** VARIABLES **
  // Control
  producto_seleccionado: any;
  carruselId_seleccionado: number;
  paginaId_seleccionada: number;
  productosBusqueda: any;
  dataSourceProductos: dataSource;
  modo: Forms.Modo = Forms.Modo.Agregar;
  fechaInicio: Date;
  fechaFin: Date;
  minDate: Date;
  seLimpioLista = false;
  modoEditarCarrusel = true;
  readonlyCarrusel = false;
  modoEdicion = false;
  carruselIdEditando = 0;

  // Listas
  listaProductos = [];
  listaPaginas = [];
  listaCarruseles = [];
  listaTipos = [];

  // Modelos
  carrusel: Carrusel;
  addProducto: AddProducto;
  listaProductosSeleccionados: AddProducto[] = [];

  // ****** FUNCIONES ******
  ngOnInit() {
    this.ObtenerPaginas();
    this.configurarModoFormulario();
    this.ObtenerTiposDeCarrusel();
  }

  configurarModoFormulario() {
    this.route.url.subscribe(rutas => {
      const ruta = rutas.find(x => x.path === 'agregar');
      if (!helpers.isNull(ruta)) {
        window.loader.hide();
        this.modoEdicion = false;
        return;
      }

      this.modo = Forms.Modo.Actualizar;
      this.route.params.subscribe(params => {
        const id = params.carruselId as number;
        this.carruselIdEditando = id;
        this.modoEdicion = true;
        this.ObtenerCarruselPorId(id);
        this.readonlyCarrusel = true;
      });
    });
  }
  ObtenerTiposDeCarrusel() {
    this.serviceCarrusel.ObtenerTiposDeCarrusel().subscribe( r  => {
      this.listaTipos = r;
    });
  }
  ObtenerCarruselPorId(carruselId: number) {
    this.serviceCarrusel.ObtenerCarruselAeditar(carruselId).subscribe( r => {
      this.carruselId_seleccionado = r.carruselId;
      this.paginaId_seleccionada = r.paginaId;
      this.carrusel.textoVerMas = r.textoVerMas;
      this.carrusel.enlace = r.enlace;
      this.carrusel.carruselTipoId = r.carruselTipoId;
      this.carrusel.descripcion = r.descripcion;
      this.carrusel.carruselId = r.carruselId;
      this.carrusel.cantidadDeProductosVisiblesEnMovil = r.cantidadDeProductosVisiblesEnMovil;
      this.listaProductos = r.productos;
    }, error => {
      Alertas.showHttpResponse(error, '¡ERROR!', true);
    });
  }



  Cancelar() {
    if (this.ValidarDatos(true)) {
      Alertas.question('', `¿Está seguro que desea borrar todas los datos ingresados hasta el momento?`).then(r => {
        this.limpiar();
        if (this.modo === Forms.Modo.Actualizar) {
          this.router.navigate(['ecommerce/productosCarrusel/listadoCarruseles']);
        }
      });
    }
  }

  ObtenerPaginas() {
    this.serviceCarrusel.ObtenerPaginas().subscribe(r => {
        this.listaPaginas = r;
    });
  }

  ObtenerCarruselesPorPaginas(paginaId: number) {
    if (isUndefined(paginaId) || paginaId === null) {
      return;
    }
    this.serviceCarrusel.ObtenerCarruselesPorPagina(paginaId, this.modoEdicion).subscribe(r => {
      this.listaCarruseles = r;
    });
  }

  buscarProductos(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceProductos.searchValue();
      this.serviceCarrusel.ObtenerProductosPorDescripcion(textoBusqueda)
        .then(data => resolve(data));
    });
  }

  GuardarProductos() {
    this.AgregarProductoAmodelo(this.listaProductos);
    if (!this.ValidarDatos(false)) {
      return;
    }
    Alertas.load();
    if (this.modo === Forms.Modo.Agregar) {
      this.serviceCarrusel.GuardarProductosDeCarrusel(this.listaProductosSeleccionados,
        this.carruselId_seleccionado,
        this.loginService.Usuario.id)
        .subscribe(r => {
          Alertas.ok('¡Correcto!', `${r.respuesta}`);
          this.limpiar();
        }, error => {
          Alertas.showHttpResponse(error, '¡ERROR!', true);
        });
    } else {
      this.serviceCarrusel.EditarProductosDeCarrusel( this.listaProductosSeleccionados,
                                                      this.carruselId_seleccionado,
                                                      this.loginService.Usuario.id,
                                                      this.seLimpioLista,
                                                      this.carrusel)
        .subscribe( r => {
          Alertas.ok('¡Correcto!', `${r.respuesta}`);
          this.limpiar();
          this.router.navigate(['ecommerce/productosCarrusel/listadoCarruseles']);
        }, error => {
          Alertas.showHttpResponse(error, '¡ERROR!', true);
        });
    }
  }

  // ***** Funciones Secundarias *****
  AgregarProductoAlista(producto) {
    if (isUndefined(producto) || producto === null) {
      return;
    }
    if (this.yaSeAgregoAlaLista(producto.productoId)) {
      Notificaciones.error(`Ya se agregó este producto`);
      return;
    }
    producto = this.setValuesToProducto(producto);
    this.listaProductos.push(producto);
    Notificaciones.success(`Producto agregado`);
  }

  EliminarProductoDeLista(producto) {
    Alertas.question(``, `¿Está seguro que desea eliminar este producto?`)
      .then(res => {
        const index = this.listaProductos.findIndex(p => p.productoId === producto.productoId);
        if (this.modo === Forms.Modo.Actualizar) {
          this.serviceCarrusel.EliminarProductoDeCarrusel(producto.productoCarruselId).subscribe( r => {
            this.listaProductos.splice(index, 1);
            Notificaciones.success(r.respuesta);
            this.ObtenerCarruselPorId(this.carruselIdEditando);
          }, error => {
            Alertas.showHttpResponse(error, '¡ERROR!', true);
          });
        }else {
          this.listaProductos.splice(index, 1);
        }
      });
  }

  EliminarTodosLosProductosDeCarrusel(carruselId) {
    Alertas.question(``, `¿Está seguro que desea eliminar de la lista todos los productos?`)
      .then(res => {
        this.seLimpioLista = true;
        this.listaProductos = [];
      });
  }

  ValidarDatos(cancelando: boolean): boolean {
    if (isUndefined(this.paginaId_seleccionada) || this.paginaId_seleccionada <= 0) {
      Alertas.warning('', `Debe seleccionar la página donde se encuentra el Carrusel`);
      return false;
    }
    if (isUndefined(this.carruselId_seleccionado) || this.carruselId_seleccionado <= 0) {
      Alertas.warning('', `Debe seleccionar un carrusel`);
      return false;
    }

    if (this.listaProductosSeleccionados.length <= 0 && !cancelando) {
      Alertas.warning('', `Debe agregar al menos un producto al carrusel`);
      return false;
    }
    return true;
  }

  AgregarProductoAmodelo(listaProductos) {
    this.listaProductosSeleccionados = [];
    if (listaProductos.length > 0) {
      listaProductos.forEach( p => {
        const producto = new AddProducto();
        producto.productoId = p.productoId;
        producto.orden = p.orden;
        producto.fechaFinActivo = p.fechaFinActivo;
        producto.fechaInicioActivo = p.fechaInicioActivo;
        this.listaProductosSeleccionados.push(producto);
      });
    }
  }

  SeleccionarCarrusel(carruselId) {
    if (isUndefined(carruselId) || carruselId === null) {
      return;
    }    
    this.modoEditarCarrusel = true;
    this.ObtenerCarruselPorId(carruselId);
  }
  // ***** Funciones Auxiliares *****
  yaSeAgregoAlaLista(productoId): boolean {
    const index = this.listaProductos.findIndex(p => p.productoId === productoId);
    return index !== -1;
  }
  setValuesToProducto(producto) {
    if (this.modo === Forms.Modo.Actualizar) {
      producto.fechaInicioActivo = this.fechaInicio.toDateString();
      producto.fechaFinActivo = this.fechaFin.toDateString();
    } else {
      producto.fechaInicioActivo = this.fechaInicio;
      producto.fechaFinActivo = this.fechaFin;
    }
    producto.orden = this.listaProductos.length + 1;
    return producto;
  }

  cambiarOrdenProducto(producto, sube: boolean) {
    const indexProducto = this.listaProductos.findIndex( p => p.productoId === producto.productoId);
    const ordenProducto = indexProducto + 1;
    const indexUltimo = this.listaProductos.length - 1;
    const ordenUltimo = this.listaProductos.length;

    if (sube && indexProducto > 0 ) {
      this.actualizarOrdenDeProductos(producto, indexProducto, sube, ordenUltimo);
      producto.orden = ordenProducto - 1;
    } else if (!sube && indexProducto < indexUltimo && indexUltimo !== 0) {
      this.actualizarOrdenDeProductos(producto, indexProducto , sube, ordenUltimo);
      producto.orden = ordenProducto + 1;
    } else {
      return;
    }
  }

  actualizarOrdenDeProductos(productoActualizado, indexProducto, sube: boolean, ordenUltimo: number) {
    if (productoActualizado.orden >= 1 && sube) {
      const productoAnterior = this.listaProductos.find(p => p.orden === productoActualizado.orden - 1);
      const indexProductoAnterior = this.listaProductos.findIndex(p => p.orden === productoActualizado.orden - 1);
      productoAnterior.orden = productoActualizado.orden === ordenUltimo ? ordenUltimo : productoActualizado.orden;
      this.listaProductos[indexProducto] = productoAnterior;
      this.listaProductos[indexProductoAnterior] = productoActualizado;
    } else if (productoActualizado.orden < ordenUltimo && !sube) {
      const productoSiguiente = this.listaProductos.find(p => p.orden === productoActualizado.orden + 1);
      const indexProductoSiguiente = this.listaProductos.findIndex(p => p.orden === productoActualizado.orden + 1);
      productoSiguiente.orden =  productoActualizado.orden;
      this.listaProductos[indexProducto] = productoSiguiente;
      this.listaProductos[indexProductoSiguiente] = productoActualizado;
    }
  }

  cambiarModoEditarCarrusel() {
    this.modoEditarCarrusel = !this.modoEditarCarrusel;
  }
  limpiar() {
    this.listaProductosSeleccionados = [];
    this.listaProductos = [];
    this.fechaInicio = this.minDate;
    this.fechaFin = this.minDate;
    this.paginaId_seleccionada = 0;
    this.carruselId_seleccionado  = 0;
    this.producto_seleccionado = [];
    this.seLimpioLista = false;
  }
}
