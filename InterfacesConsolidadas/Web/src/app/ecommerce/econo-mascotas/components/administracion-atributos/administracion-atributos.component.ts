import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DxFileUploaderComponent } from 'devextreme-angular';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ExcelImportExportService } from '../../../../productos/administracion-precios/excel-import-export.service';
import { EconoMascotasService } from '../../econo-mascotas.service';
import { ProductoAtributo } from '../../models/producto-atributo';
import { ProductoAtributoDetalle } from '../../models/producto-atributo-detalle';
import { ProductoAtributoValor } from '../../models/producto-atributo-valor';
import { DetailGridComponent } from '../detail-grid/detail-grid.component';
import dataSource from 'devextreme/data/data_source';
import customStorage from 'devextreme/data/custom_store';
@Component({
  selector: 'app-administracion-atributos',
  templateUrl: './administracion-atributos.component.html',
  styleUrls: ['./administracion-atributos.component.css']
})
export class AdministracionAtributosComponent implements OnInit {
  _productoAtributos: ProductoAtributo[] = [];
  _productoAtributosValor: ProductoAtributoValor[] = [];
  _productos: any;
  _excelLoad: boolean = false;
  formGroupAtributo: FormGroup;
  _productosGrid:any;
  _productosAtributosGrid:any;
  dataSourceProductos: dataSource;
  producto_seleccionado: any;
  @ViewChild('fileExcel') fileExcel: DxFileUploaderComponent;


  constructor(public econoMascotasService: EconoMascotasService,  private _excelService: ExcelImportExportService) {
this.configurarDataSource();
    this.ObtenerAtributos();

    this.crarForm();
    this.CargarGrid();

  }

  ngOnInit() {
  }
  crarForm(): void {
    this.formGroupAtributo = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      productoId: new FormControl('', [Validators.required]),
      productoAtributoId: new FormControl('', [Validators.required]),
      productoAtributoValorId: new FormControl(0),
      valor: new FormControl('', [Validators.required])


    });
  }
  resetForm(): void {
    this.formGroupAtributo.reset({
      id: 0,
      productoId: '',
      productoAtributoId: '',
      productoAtributoValorId: '',
      valor: ''
    });
  }
  limpiar(): void {
    this.resetForm();
    this._excelLoad = false;
    this.fileExcel.instance.reset();

  }
 CargarGrid():void{
   this.econoMascotasService.GetAtributosProductosDetalle().subscribe(d=> {this._productosGrid=d})
 }
  ObtenerAtributos(): void {
    Alertas.load()
    this.econoMascotasService.GetAtributosProductos().subscribe(d => {

      this._productoAtributos = d;
      Alertas.close();
    })
  }


  ObtenerAtributosValor(productoAtributoId: string): void {
    if (productoAtributoId == '') {
      return;
    }
    Alertas.load("Obteniendo Atributos valores")
    this.econoMascotasService.GetAtributosProductosValor(productoAtributoId).subscribe(d => {

      this._productoAtributosValor = d;
      Alertas.close()
    })
  }
  onValueChanged(e: any): void {
    this.ObtenerAtributosValor(e.value)
  }
  onValueChangedValor(e: any): void {
    console.log(e.value);
   if (e.value == null || e.value==0){
    this. formGroupAtributo.get("valor").setValue("");
    this. formGroupAtributo.get("valor").clearValidators();
    this. formGroupAtributo.get("valor").setValidators(Validators.required);
    this. formGroupAtributo.get("valor").updateValueAndValidity();

    this. formGroupAtributo.get("productoAtributoValorId").setValue(0);
    this. formGroupAtributo.get("productoAtributoValorId").clearValidators();
    this. formGroupAtributo.get("productoAtributoValorId").updateValueAndValidity();



   }else{
     this. formGroupAtributo.get("valor").setValue("");
     this. formGroupAtributo.get("valor").clearValidators();
     this. formGroupAtributo.get("valor").updateValueAndValidity();
     this. formGroupAtributo.get("productoAtributoValorId").clearValidators();
     this. formGroupAtributo.get("productoAtributoValorId").setValidators(Validators.required);
     this. formGroupAtributo.get("productoAtributoValorId").updateValueAndValidity();


   }
  }
  GuardarProductoDetalle(): void {
    Alertas.load("Guardando");
    let  productosAtributosDetalle:ProductoAtributoDetalle[]=[]
if (this._excelLoad){
  this._excelService.ExcelToJson<any>(this.fileExcel.value[0]).subscribe(d => {
    d.forEach(p => {
      const product = new ProductoAtributoDetalle();
      product.productoId = p.Codigo;
      product.productoAtributoId = p.AtributoCodigo;
      product.productoAtributoValorId = p.AtributoValorCodigo;
      product.valor = p.Valor;
      productosAtributosDetalle.push(product)
    });
    this.econoMascotasService.SaveProductoAtributoDetalles(productosAtributosDetalle).subscribe(respuesta=>{
      Alertas.close();
      this.CargarGrid();
      this.limpiar();

      if(respuesta.message.length>0){
        Alertas.warning("","A los siguientes productos no se les pudo guardar el Atributo:"+respuesta.message);
      }else{

        Alertas.ok("Atributos Guardado Correctamente");
      }

    },erro=>{Alertas.close(); Alertas.errorEnServidor()})
  });
}else{
  let atributoDetalle = this.formGroupAtributo.getRawValue() as ProductoAtributoDetalle
  this.econoMascotasService.SaveProductoAtributoDetalle(atributoDetalle).subscribe(d => {
    this.CargarGrid();
    this.limpiar();
    Alertas.close();
    Alertas.ok("Atributo Guardado Correctamente");
  },erro=>{Alertas.close(); Alertas.errorEnServidor()})

}

  }

  uploadExcel(e: any): void {
    this._excelLoad = e.value.length > 0;

  }
  onRowExpanding(e:any){

  }

  configurarDataSource() {
    const custom = new customStorage({
      load: this.buscarProductos.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve();
      }),
    });

    this.dataSourceProductos = new dataSource({
      store: custom
    });
  }


  buscarProductos(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceProductos.searchValue();
      this.econoMascotasService.ObtenerProductosPorDescripcion(textoBusqueda)
        .then(data => resolve(data));
    });
  }
}
