import { Proveedor } from './../../models/proveedor.model';
import { DxLookupComponent, DxCheckBoxComponent, DxFileUploaderComponent } from 'devextreme-angular';
import { Distribuidor } from './../../models/distribuidor.model';
import { FormGroup, FormBuilder, FormControlName, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { AdministracionPreciosService } from '../../administracionPrecios.service';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { Linea } from '../../models/linea.model';
import { helpers } from '../../../../helpers/utils';
import { Producto } from '../../models/producto.model';
import { SwalPosition } from '../../../../helpers/notificaciones/SwalPosition';
import { ExcelImportExportService } from '../../excel-import-export.service';
import { ProductToChangePrice } from '../../models/ProductToChangePrice.model';
import { ConfigurationProductsToChange } from '../../models/ConfigurationProductsToChange';
import { LoginService } from '../../../../login/services/login.service';
import { ItemInformationList } from '../../models/item-information-list';
import { LoadGridOptions } from '../../../../ecommerce/distribuidores-externos/models/LoadGridOptions';
import { InformationProductsToChangePriceRow } from '../../models/InformationProductsToChangePriceRow';
import { error } from 'util';

@Component({
  selector: 'app-administracion-productos-precio-global',
  templateUrl: './administracion-productos-precio-global.component.html',
  styleUrls: ['./administracion-productos-precio-global.component.css']
})
export class AdministracionProductosprecioglobalComponent implements OnInit, AfterContentInit {

  formGroupProductos: FormGroup;
  @ViewChild('fileExcel') fileExcel: DxFileUploaderComponent;
  listProducts: ProductToChangePrice[] = [];
  list: InformationProductsToChangePriceRow[] = [];
  informationProductsToChangePriceSelect: InformationProductsToChangePriceRow = new InformationProductsToChangePriceRow();
  loadOptions: LoadGridOptions = new LoadGridOptions()
  listOptionSelect: any[] = [{ id: 0, text: 'Todos' },
  { id: 1, text: 'Solo Suben' },
  { id: 2, text: 'Solo Bajan' }];
  listReplaceSelect: any[] = [{ id: true, text: 'Reemplazar' },
  { id: false, text: 'Añadir' }
  ];
 textSaveBotton='Guardar';
 popupVisible=false;
 listProductsNoChange: ProductToChangePrice[] = [];
  listInformation: ItemInformationList[];
  constructor(private _formBuilder: FormBuilder, private _excelService: ExcelImportExportService,
    private _administracionPreciosService: AdministracionPreciosService, private _loginService: LoginService
  ) {

  }

  ngOnInit() {
    this._administracionPreciosService.GetAllList().subscribe(d => {
      this.listInformation = d;
    })
  }

  ngAfterContentInit(): void {
    this.createForm();
    this.showList();
  }
  createForm(): void {
    this.formGroupProductos = this._formBuilder.group({id:new FormControl(0),
      typeChangePrice: new FormControl(0, Validators.required),
      description: new FormControl('', Validators.compose([Validators.required, Validators.min(3)])),
      smallerMargin: new FormControl(0.08),
      dateChange: new FormControl(new Date(Date.now())),
      excelSelected: new FormControl(0, Validators.min(1)),
      updateNow: new FormControl(false),
      replaceList: new FormControl(true),
      oldList: new FormControl(0)
    });

  }
  resetForm(): void {
    this.formGroupProductos.reset({id:0,
      typeChangePrice: 0,
      smallerMargin: 0.08,
      description: '',
      dateChange: new Date(Date.now()),
      excelSelected: 0,
      updateNow: 0,
      replaceList:false,
      oldList:0
    });
    this.fileExcel.instance.reset();
    this.listProducts = [];
this.textSaveBotton='Guardar';
  }
  uploadExcel(e: any): void {
    var excelSelected = e.value.length;
    this.formGroupProductos.get('excelSelected').setValue(excelSelected);
  }
  uploadFromExcel(): void {
    this._excelService.ExcelToJson<any>(this.fileExcel.value[0]).subscribe(d => {
      d.forEach(p => {
        const product = new ProductToChangePrice();
        product.productoId = p.Codigo;
        product.normalNewPrice = p.Precio;
        product.senioPriceWithDiscount = p.Precio3ra;
        product.discount = p.Descuento;
        this.listProducts.push(product);
      });


    });

  }
  
  filterProducts(products: ProductToChangePrice[], optionSelect: number): void {
    switch (optionSelect) {
      case 1:
        this.listProducts = this.listProducts.concat(products.filter(dp => ((1 - dp.discount) * dp.normalNewPrice) > ((1 - dp.discountOriginal) * dp.oldPrice)));
        break;
      case 2:
        this.listProducts = this.listProducts.concat(products.filter(dp => ((1 - dp.discountOriginal) * dp.oldPrice) > ((1 - dp.discount) * dp.normalNewPrice)));
        break;
      default:
        this.listProducts = this.listProducts.concat(products);
        break;
    }

  }
  saveForm2(): void {
    Alertas.load();
    ;
    var con: ConfigurationProductsToChange = this.formGroupProductos.getRawValue() as ConfigurationProductsToChange;
    con.products = this.listProducts;
    con.userId = this._loginService.Usuario.id;
    con.username = this._loginService.Usuario.usuario;

    this._administracionPreciosService.SaveNewPrices(con).subscribe(d => {
      Alertas.ok('¡Exito!', 'Los Productos han sido guardados.');
      this.resetForm();
    }, error => {

      Alertas.close();
      Alertas.errorEnServidor('¡Error!', 'Error al guardar los productos para actualizar');
    });


  }
  saveForm(): void {
    Alertas.load();
    this.listProducts = [];
    this._excelService.ExcelToJson<any>(this.fileExcel.value[0]).subscribe(d => {
      d.forEach(p => {
        const product = new ProductToChangePrice();
        product.productoId = p.Codigo;
        product.priceWithDiscount = p.Precio;
        product.senioPriceWithDiscount = p.Precio3ra;
        product.discount = p.Descuento;
        this.listProducts.push(product);
      });
      var con: ConfigurationProductsToChange = this.formGroupProductos.getRawValue() as ConfigurationProductsToChange;
      con.products = this.listProducts;
      con.userId = this._loginService.Usuario.id;
      con.username = this._loginService.Usuario.usuario;

      this._administracionPreciosService.SaveNewPrices(con).subscribe(d => {
        this.showList();
        Alertas.close();
        if (d.length==0){
           Alertas.ok('¡Exito!', 'Los Productos han sido guardados.');

         }else{
         this.listProductsNoChange=d;
         this.popupVisible=true;
         }
        this.resetForm();
        this.showList();
      }, error => {

        Alertas.close();
        Alertas.errorEnServidor('¡Error!', 'Error al guardar los productos para actualizar');
      });

    });
  }
  onRowPrepared(e): void {
    if (e.rowType == 'data' && e.data.status == 2) {
      e.rowElement.style.backgroundColor = 'red';
      e.rowElement.style.color = 'white';

      e.rowElement.className = e.rowElement.className.replace('dx-row-alt', '');
    }
    if (e.rowType == 'data' && e.data.status == 4) {
      e.rowElement.style.backgroundColor = '#F7428';
      e.rowElement.style.color = 'white';

      e.rowElement.className = e.rowElement.className.replace('dx-row-alt', '');
    }
  }

  updateNowhandleValueChange(e: any): void {
    this.formGroupProductos.get("dateChange").setValue(new Date(Date.now()));
    if (e.value) {
      this.formGroupProductos.get("dateChange").disable();
    } else {
      this.formGroupProductos.get("dateChange").enable();

    }
  }
  showList(): void {
    Alertas.load();
    this._administracionPreciosService.GridListPrice(this.loadOptions).subscribe(d => {

      this.list = d.items;
      Alertas.close();
    }, error => {
      Alertas.close();
      Alertas.errorEnServidor('¡Error!', 'Error al mostrar Las Listas');
    })
  }
  showListProducts(e): void {
    Alertas.load();
    this.informationProductsToChangePriceSelect = e;
    this._administracionPreciosService.GridProductos(this.informationProductsToChangePriceSelect.id.toString()).subscribe(d => {

      this.listProducts = d.items
      this.gridproductsVisible=true;
      Alertas.close();
      
    }, error => {
      Alertas.close();
      this.gridproductsVisible=false;
      Alertas.errorEnServidor('¡Error!', 'Error al mostrar los productos de la lista');
    })
  }
  gridproductsVisible=false;
  deleteList(e: InformationProductsToChangePriceRow) {
    Alertas.question('', `¿Desea  eliminar la lista productos ${e.description}?`).then(x => {
      Alertas.load();
      this._administracionPreciosService.DeleteList(e.id.toString()).subscribe(d => {
        Alertas.close();
        this.showList();
      }, error => {
        Alertas.close();
        Alertas.errorEnServidor('¡Error!', 'Error al eliminar La Lista');
      })
    });

  }
  ocultarListProd():void{
    this.gridproductsVisible=false;
  }
  editList(listId:string,replaceList:boolean):void{
    Alertas.load();
this._administracionPreciosService.GetList(listId).subscribe(d=>{

  this.resetForm();
this.formGroupProductos.get("id").setValue(d.id);
this.formGroupProductos.get("description").setValue(d.description);
this.formGroupProductos.get("typeChangePrice").setValue(d.typeChangePrice);
this.formGroupProductos.get("smallerMargin").setValue(d.smallerMargin);
this.formGroupProductos.get("updateNow").setValue(d.updateNow);
this.formGroupProductos.get("replaceList").setValue(replaceList);
this.formGroupProductos.get("oldList").setValue(d.id);
this.textSaveBotton=replaceList==true?'Reemplazar':'Añadir';

Alertas.close();

})
  }
}
