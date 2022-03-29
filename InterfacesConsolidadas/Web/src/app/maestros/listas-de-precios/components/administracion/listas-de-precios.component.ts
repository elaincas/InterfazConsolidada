import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ListasPreciosService } from '../../services/listas-precios.service';
import { ListaPreciosDto, ListaPreciosProductoDto, ProductoAgregadoGrid } from '../../models/dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'listas-precios',
  templateUrl: './listas-de-precios.component.html',
  styleUrls: ['./listas-de-precios.component.css']
})
export class ListasDePreciosComponent implements OnInit {

  ListasConProductos: ListaPreciosDto[];
  limpiarControles: EventEmitter<any> = new EventEmitter();
  addPreviousProducts: EventEmitter<any> = new EventEmitter();
  productosAgregar: any[] = [];

  formGroupLista: FormGroup;
  formGroupProductoLista: FormGroup;

  agregandoProductoALista: boolean = false;

  constructor(private listasService: ListasPreciosService, private route: Router,
    private _formBuilder: FormBuilder,
  ) {
    this.ListasConProductos = new Array<ListaPreciosDto>();
  }

  numRegex = /^[0-9]+(.[0-9]{0,2})?$/;
  
  ngOnInit() {
    this.cargarListas();

    this.formGroupLista = this._formBuilder.group({
      nombre: new FormControl(),
    });
    this.formGroupProductoLista = this._formBuilder.group({
      productoId: new FormControl(),
      precioPublico: new FormControl('', [Validators.required, Validators.pattern(this.numRegex)]),
      precioFinal: new FormControl('', [Validators.required, Validators.pattern(this.numRegex)]),
    });
  }

  nuevoProducto(): void {
    this.agregandoProductoALista = true;
  }
  cancelarNuevoProducto(): void {
    this.agregandoProductoALista = false;
    this.formGroupProductoLista.reset();
  }
  onAddProducto(e: any[]): void {
    if (e.length < 0) return;


    //        Dejar marcado solo un producto
    // this.productosAgregar = [];
    // this.limpiarControles.emit();

    // var prod = e[0];
    // // var prod = new ProductoAgregadoGrid();
    // // prod.productoId = e[0].productoId;
    // this.productosAgregar.push(prod);
    // this.addPreviousProducts.emit(this.productosAgregar);
    //        ////

    e.forEach(producto => {
      if (this.productosAgregar.map(p => p.productoId).indexOf(producto.productoId) > -1) return;
      this.productosAgregar.push(producto);
    });

  }
  onDeleteProducto(e: any): void {
    this.productosAgregar = this.productosAgregar.filter(p => p.productoId != e.productoId);
  }

  modeloListaEsValido(): boolean {
    if (!this.formGroupLista.get('nombre').value) {
      return false;
    }
    return true;
  }

  cargarListas(): void {
    Alertas.load();
    this.listasService.obtenerListasPrecios().subscribe(response => {
      Alertas.close();
      this.ListasConProductos = response;
    }, error => {
      Alertas.close();
      Alertas.error("Error", "Error al obtener las listas \n Estatus: " + error.status + " \n Mensaje: " + error.statusText);
    });
  }

  limpiarProductosForm() {
    this.formGroupProductoLista.reset();
    this.productosAgregar = [];
  }

  limpiarListasForm() {
    this.formGroupLista.reset();
  }

  guardarLista() {

    Alertas.load();
    if (!this.modeloListaEsValido()) {
      Alertas.warning("Advertencia", "Ingrese toda la información del formulario.");
      return;
    }

    let producto = new ListaPreciosDto();

    producto.Activo = true;
    producto.Descripcion = this.formGroupLista.get('nombre').value;

    this.listasService.guardarLista(producto)
      .subscribe(data => {
        Alertas.ok("", "Registro completo");
        this.cargarListas();
        this.limpiarListasForm();
      }, error => {
        console.log(error);
        Alertas.errorEnServidor();
      });
  }

  guardarProductoLista(listaId: number) {
    Alertas.load();

    let producto = new ListaPreciosProductoDto();
    producto.Activo = true;
    producto.Productos = this.productosAgregar.map(p => p.productoId);
    producto.ListaId = listaId;
    producto.PrecioPublico = this.formGroupProductoLista.get('precioPublico').value;
    producto.PrecioFinal = this.formGroupProductoLista.get('precioFinal').value;

    this.listasService.guardarProductoLista(listaId, producto)
      .subscribe(data => {
          Alertas.ok("", "Registro completo");
          this.cargarListas();
          this.limpiarProductosForm();
      }, error => {
        if(error._body != null){
          Alertas.error("Error", error._body)
        } else {
          Alertas.errorEnServidor();
        }
      })
  }

  onProductosRowUpdated(e: any): void {
    Alertas.question("", "¿Desea actualizar este producto?")
      .then(resp => {
        const producto = e.key;
        this.listasService.actualizarProductoLista(producto.listaId, producto.productoId, producto)
          .subscribe(data => {
            Alertas.ok("", "Producto actualizado exitosamente.");
          }, error => {
            if(error._body != null){
              Alertas.error("Error", error._body)
            } else {
              Alertas.errorEnServidor();
            }
          });
      });
  }

  onListaRowUpdated(e: any): void {
    Alertas.question("", "¿Desea actualizar esta lista?")
      .then(resp => {
        const lista = this.ListasConProductos.filter(x => x.id == e.key.id)[0];
        this.listasService.actualizarLista(lista.id, lista)
          .subscribe(data => {
            Alertas.ok("", "Lista actualizada exitosamente.");
          }, error => {
            console.log(error);
            Alertas.errorEnServidor();
          });
      });
  }

}
