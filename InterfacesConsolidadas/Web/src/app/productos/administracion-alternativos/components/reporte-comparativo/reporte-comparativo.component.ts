import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, getElement } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ProductoAlternativoComparacion } from '../../models/reporteComparativoModels/productoAlternativoComparacion';
import CustomStorage from 'devextreme/data/custom_store';
import { LoginService } from '../../../../login/services/login.service';
import { AdministracionProductosAlternativosService } from '../../services/administracionProductosAlternativos.service';
import { Productos } from '../../models/reporteComparativoModels/productos';
import { Alertas, Notificaciones } from '../../../../helpers/notificaciones/notificaciones';
import { IngredienteActivosProducto } from '../../models/reporteComparativoModels/ingredienteActivoProducto';
import { ResultadoComparacionProductos } from '../../models/reporteComparativoModels/resultadoComparacionProductos';

@Component({
  selector: 'app-reporte-comparativo',
  templateUrl: './reporte-comparativo.component.html',
  styleUrls: ['./reporte-comparativo.component.css']
})
export class ReporteComparativoComponent implements OnInit {

  productos: Productos[];
  productosId: string[] = [];
  _gridBoxProductoOriginalValue: string;
  _gridBoxProductoAltrnativoValue: string;
  productosComparar: ProductoAlternativoComparacion[] = [];
  productoBase:ProductoAlternativoComparacion;
  productoAlternativo: ProductoAlternativoComparacion;
  mostrar:boolean;
  productoAlternativoConfigurado:boolean = false;

  constructor(private _administracionProductosAlternativosService: AdministracionProductosAlternativosService) { }

  ngOnInit() {
    if(localStorage.getItem("listaProductosReporteComparativo") == undefined){
      this.ObtenerProductos();
    }else{
      this.productos = JSON.parse(localStorage.getItem("listaProductosReporteComparativo"))
    }
    let inicilizar = new ProductoAlternativoComparacion;
    inicilizar.productoIngredientes = [];
    this.productosComparar.push(inicilizar);
    this.productosComparar.push(inicilizar);
    this.mostrar = false;
  }

  set gridBoxProductoOriginalValueSelect(value: Productos) {
    this._gridBoxProductoOriginalValue = "";

    if (value != null) {
      this._gridBoxProductoOriginalValue = value[0].identificador;
    }
  }
  set gridBoxProductoOriginalValue(value: string) {
    this._gridBoxProductoOriginalValue = value || "";
  }
  get gridBoxProductoOriginalValue(): string {
    return this._gridBoxProductoOriginalValue;
  }

  set gridBoxProductoAlternativoValueSelect(value: Productos) {
    this._gridBoxProductoAltrnativoValue = "";

    if (value != null) {
      this._gridBoxProductoAltrnativoValue = value[0].identificador;
    }
  }
  set gridBoxProductoAlternativoValue(value: string) {
    this._gridBoxProductoAltrnativoValue = value || "";
  }
  get gridBoxProductoAlternativoValue(): string {
    return this._gridBoxProductoAltrnativoValue;
  }

  ObtenerProductos(){
    Alertas.load();
    this._administracionProductosAlternativosService.ObtenerTodosProductos()
      .subscribe(data => {
        this.productos = data as Productos[];
        localStorage.setItem("listaProductosReporteComparativo", JSON.stringify(this.productos));
        Alertas.close();
      }, error =>{
        Alertas.close();
        Alertas.errorEnServidor();
      });
  }

  Comparar(){
    let productoPrincipalId = this.gridBoxProductoOriginalValue;
    let productoAlternativoId = this.gridBoxProductoAlternativoValue;

    if(productoPrincipalId == undefined || productoPrincipalId == ""){
      Notificaciones.error("Seleccione el producto base");
      return;
    }

    if(productoAlternativoId == undefined || productoAlternativoId == ""){
      Notificaciones.error("Seleccione el producto alternativo");
      return;
    }
    this.productosId = [];
    this.productosId.push(productoPrincipalId);
    this.productosId.push(productoAlternativoId);
    Alertas.load();
    this._administracionProductosAlternativosService.ObtenerProductosComparar(this.productosId)
      .subscribe(data => {
        let respuesta = data as ResultadoComparacionProductos;
        this.productosComparar = respuesta.productoComparacion;
        this.productoAlternativoConfigurado = respuesta.productoAlternativoConfigurado;
        this.mostrar = true;
        this.productoBase = this.productosComparar.find(x=>x.id==this.gridBoxProductoOriginalValue);
        this.productoAlternativo = this.productosComparar.find(x=>x.id == this.gridBoxProductoAlternativoValue);
        Alertas.close();
      }, error =>{
        Alertas.close();
        Alertas.errorEnServidor();
      });
  }

  Verificar(e){
    let data = e.data as IngredienteActivosProducto;
    if (e.rowType == 'data'
    && this.productoBase.productoIngredientes.
            find(x=>x.cantidad == data.cantidad && x.medidaPesoId == data.medidaPesoId && x.ingredienteActivoId == data.ingredienteActivoId) == undefined) {
      e.rowElement.style.backgroundColor = 'red';
      e.rowElement.style.color = 'white';
      e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
  }
  }

}
