import { AdministracionProductosAlternativosService, isNullEmptyOrWhiteSpace } from './../../services/administracionProductosAlternativos.service';
import { ProductoAlternativo } from './../../models/productoAlternativo';
import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoginService } from '../../../../login/services/login.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ConfiguracionProductosRecompraService } from '../../../../ecommerce/recompra/_services/configuracion-productos.service';

@Component({
  selector: 'app-alternativos',
  templateUrl: './alternativos.component.html',
  styleUrls: ['./alternativos.component.css']
})
export class AlternativosComponent implements OnInit, AfterContentInit {

  productosAlternativos: ProductoAlternativo[];
  productosTotal: any;
  formGroupAlternativos: FormGroup;

  @ViewChild('gridProductosOriginales') productosOriginalDataGrid: DxDataGridComponent;
  _productoOriginalSeleccionado: string[];
  set productoOriginalSeleccionadoChange(value: any[]) {
    this._productoOriginalSeleccionado = value.map(v => v.identificador) || [];
  }
  set productoOriginalSeleccionado(value: string[]) {
    this._productoOriginalSeleccionado = value || [];
    if (!value)
      this.productosOriginalDataGrid.instance.deselectAll();
  }
  get productoOriginalSeleccionado(): string[] {
    return this._productoOriginalSeleccionado;
  }

  @ViewChild('gridProductosRemplazo') productosRemplazoDataGrid: DxDataGridComponent;
  _productoRemplazoSeleccionado: string[];
  set productoRemplazoSeleccionadoChange(value: any[]) {
    this._productoRemplazoSeleccionado = value.map(v => v.identificador) || [];
  }
  set productoRemplazoSeleccionado(value: string[]) {
    this._productoRemplazoSeleccionado = value || [];
    if (!value)
      this.productosRemplazoDataGrid.instance.deselectAll();
  }
  get productoRemplazoSeleccionado(): string[] {
    return this._productoRemplazoSeleccionado;
  }

  constructor(private _administracionProductosAlternativosService: AdministracionProductosAlternativosService, 
    private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private configuracionProductosService: ConfiguracionProductosRecompraService
    ) { }

  ngOnInit():void {
  }
  
  ngAfterContentInit():void{
    this.loadProductosAlternativos();
  }

  loadProductosAlternativos():void{
    Alertas.load();
    this.configuracionProductosService.ObtenerTodosProductos()
      .subscribe(data => {
        this.productosTotal = data;
      }, error =>{
        console.log("Error al cargar todos los productos.");
      });

    this.formGroupAlternativos = this._formBuilder.group({
      cantidadDeReemplazo: new FormControl(),
    });

    this._administracionProductosAlternativosService.GetAlternativos()
      .subscribe(data => {
        Alertas.close();
        this.productosAlternativos = data;
      }, error => {
        console.log(error);
        Alertas.close();
        Alertas.errorEnServidor();
      });
      
  }

  AgregarAlternativo():void{
    Alertas.load();
    let producto = new ProductoAlternativo();
    if (!this.validateControlers()) {
      Alertas.warning("Advertencia", "Ingrese toda la informacion solicitada anteriormente.");
      return;
    }
  
    producto.ProductoOriginal = this._productoOriginalSeleccionado[0].valueOf();
    producto.ProductoReemplazo = this._productoRemplazoSeleccionado[0].valueOf();
    producto.CantidadDeReemplazo = this.formGroupAlternativos.get('cantidadDeReemplazo').value;
    producto.UsuarioAgrega = this._loginService.Usuario.id.toString();

    this._administracionProductosAlternativosService.PostAlternativo(producto)
    .subscribe(data => {
      Alertas.ok("","Registro Completado");
      this.productosAlternativos.push(data);
      this.limpiar();
    }, error => {
      console.log(error);
      Alertas.errorEnServidor();
    })

  }

  onRowUpdated(e:any):void{
    Alertas.question("","Desea actualizar este producto alternativo ?")
      .then(resp=>{
        const alternativo = this.productosAlternativos.find(x=> x.id == e.key);
        this._administracionProductosAlternativosService.PutAlternativo(alternativo)
          .subscribe(data => {
            Alertas.ok("","Producto alternativo actualizado exitosamente.");
          }, error => {
            console.log(error);
            Alertas.errorEnServidor();
          });
      });
  }

  DeleteAlternativo(producto:ProductoAlternativo):void{
    const deleteProd = this.productosAlternativos.findIndex(x=> x.id == producto.id);
    Alertas.question("",`¿Desea eliminar el Alternativo?`, "Sí", "No").then(r=>{
      this._administracionProductosAlternativosService.DeleteAlternativo(producto.id)
      .subscribe(data=>{
          Alertas.ok("","Producto alternativo eliminado exitosamente.");
          debugger;
          this.productosAlternativos.splice(deleteProd,1);
        }, error => {
          console.log(error);
          Alertas.errorEnServidor();
        }); 
    });
  }

  limpiar():void{
    this.formGroupAlternativos.reset();
    this.productosOriginalDataGrid.instance.deselectAll();
    this.productosRemplazoDataGrid.instance.deselectAll();
  }

  validateControlers():boolean{
    if (this._productoOriginalSeleccionado == undefined) {
      return false;
    }
    if (this._productoRemplazoSeleccionado == undefined) {
      return false;
    }
    if (isNullEmptyOrWhiteSpace(this.formGroupAlternativos.get('cantidadDeReemplazo').value)) {
      return false;
    }
    return true;
  }

}
