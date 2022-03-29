import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdministracionProductosAlternativosService, isNullEmptyOrWhiteSpace } from './../../services/administracionProductosAlternativos.service';
import { ProductoIndividual } from './../../models/productoIndividual';
import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../../login/services/login.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ConfiguracionProductosRecompraService } from '../../../../ecommerce/recompra/_services/configuracion-productos.service';

@Component({
  selector: 'app-individuales',
  templateUrl: './individuales.component.html',
  styleUrls: ['./individuales.component.css']
})
export class IndividualesComponent implements OnInit, AfterContentInit {

  productosIndividuales: ProductoIndividual[];
  productosTotal: any;
  formGroupIndividual: FormGroup;

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

  constructor(private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _administracionProductosAlternativosService: AdministracionProductosAlternativosService,
    private configuracionProductosService: ConfiguracionProductosRecompraService)
    {}

  ngOnInit():void{
  }

  ngAfterContentInit():void{
    this.loadProductosIndividuales();
  }

  loadProductosIndividuales():void{
    Alertas.load();
    this.configuracionProductosService.ObtenerTodosProductos()
      .subscribe(data => {
        this.productosTotal = data;
      }, error =>{
        console.log("Error al cargar todos los productos.");
      });

    this.formGroupIndividual = this._formBuilder.group({
      cantidadUnidadReemplazo: new FormControl()
    });

    this._administracionProductosAlternativosService.GetIndividuales()
      .subscribe(data => {
        Alertas.close();
        this.productosIndividuales = data;
      }, error =>{
        console.log(error);
        Alertas.errorEnServidor();
      })
  }

  AgregarIndividual():void{
    Alertas.load();
    debugger;
    let producto = new ProductoIndividual();
    if (!this.validateControlers()) {
      Alertas.warning("Advertencia", "Ingrese toda la informacion solicitada anterior mente.");
      return;
    }

    producto.ProductoOriginal = this._productoOriginalSeleccionado[0].valueOf();
    producto.ProductoReemplazo = this._productoRemplazoSeleccionado[0].valueOf();
    producto.CantidadUnidadReemplazo = this.formGroupIndividual.get('cantidadUnidadReemplazo').value;
    producto.UsuarioAgrega = this._loginService.Usuario.id.toString();

    this._administracionProductosAlternativosService.PostIndividual(producto)
      .subscribe(data=>{
        Alertas.ok("","Registro Completado");
        this.productosIndividuales.push(data);
        this.limpiar();
      }, error=>{
        console.log(error);
        Alertas.errorEnServidor();
      });
  }

  limpiar():void{
    this.formGroupIndividual.reset();
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
    if (isNullEmptyOrWhiteSpace(this.formGroupIndividual.get('cantidadUnidadReemplazo').value)) {
      return false;
    }
    return true;
  }

  onRowUpdated(e:any):void{
    const individual = this.productosIndividuales.find(x=> x.id == e.key);
    Alertas.question("","Desea actualizar este producto alternativo ?")
      .then(resp=>{
        this._administracionProductosAlternativosService.PutIndividual(individual)
          .subscribe(data=>{
            Alertas.ok("","Producto individual actualizado.");
          }, error=>{
            console.log(error);
            Alertas.errorEnServidor();
          })
      });
  }

  DeleteIndividual(producto:ProductoIndividual):void{
    debugger;
    const deleteProd = this.productosIndividuales.findIndex(x=> x.id == producto.id);
    Alertas.question("",`¿Desea eliminar el Individual?`, "Sí", "No").then(r=>{
      this._administracionProductosAlternativosService.DeleteIndividual(producto.id)
      .subscribe(data=>{
          Alertas.ok("","Producto Individual eliminado.");
          debugger;
          this.productosIndividuales.splice(deleteProd,1);
        }, error => {
          console.log(error);
          Alertas.errorEnServidor();
        });
    });
  }

}
