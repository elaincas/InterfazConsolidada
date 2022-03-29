import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SubirImagenesService } from './services/subir.imagenes.factura.service';
import DevExpress from "devextreme/bundles/dx.all";
import { ImagenFactura } from "./models/imagen-factura";
import { ImagenFacturaGrid } from "./models/imagen-factura-grid";
import { DxFileUploaderComponent, DxTextBoxComponent } from "devextreme-angular";
import notify from 'devextreme/ui/notify';
import { isUndefined } from "util";
import { Empresa } from './models/empresa.model';
import { helpers } from '../../../helpers/utils';
import { Sucursal } from '../../../maestros/colonias/models/sucursal.model';
import { SeccionFactura } from './models/seccion-factura';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
@Component({
  selector: 'app-subir-imagenes-factura-impresa',
  templateUrl: './subir-imagenes-factura-impresa.component.html',
  styleUrls: ['./subir-imagenes-factura-impresa.component.css'],
  providers: [SubirImagenesService]
})
export class SubirImagenesFacturaImpresaComponent implements OnInit {

  @ViewChild(DxFileUploaderComponent) dxfileuploader: DxFileUploaderComponent;
  @ViewChild('txtNombre') private _txtNombre: DxTextBoxComponent;
  fileDataUri = '';
  SeccionesFactura: SeccionFactura[];
  empresas: Empresa[];
  sucursales: Array<Sucursal>;
  SeccionSeleccionadaId: number;
  NombreImagen: string = "";
  ListaImagenes: ImagenFacturaGrid[];
  id: number = 0;
  empresaId: number = 0;
  sucursalId:number=0;
  mostrarSucursales:boolean=false;
  fileName:string="";

  constructor(private service: SubirImagenesService) {

  }

  ngOnInit() {
    this.llenarSecciones();
    this.llenarImagenes();
    this.obtenerEmpresas();
    this.ObtenerSucursales();
  }

  ObtenerSucursales():void{
    Alertas.load("Obteniendo sucursales");
    this.service.ObtenerSucursales().subscribe(data => {
      this.sucursales = data;
    },erro=>{Alertas.close(); Alertas.errorEnServidor()})
  }

  OnSeccionSeleccionadaChange(event):void{
    
    if(this.SeccionesFactura==undefined){
      return;
    }

    var seccionSeleccionada = this.SeccionesFactura.find(a=> a.id==event.value);
    if(seccionSeleccionada==undefined){
      return;
    }

    let SeccionFacturaTipoIdUnicaPorSucursal =2;
    this.mostrarSucursales = seccionSeleccionada.seccionFacturaTipoId==SeccionFacturaTipoIdUnicaPorSucursal;
    if(this.mostrarSucursales){
      this.llenarImagenes(seccionSeleccionada.id);
    }
  }

  obtenerEmpresas(): void {
    this.service.ObtenerEmpresas().subscribe(data => {
      this.empresas = data;
      this.empresaId = 2;
    });
  }

  llenarSecciones() {
    this.service.ObtenerSeccionesFactura().subscribe(r => {
      this.SeccionesFactura = r;
    });
  }

  llenarImagenes(seccionFacturaId=0) {
    Alertas.load("Obteniendo imagenes");
    this.service.ObtenerImagenesFactura(seccionFacturaId).subscribe(r => {
      Alertas.close();
      this.ListaImagenes = r;
    },erro=>{Alertas.close(); Alertas.errorEnServidor()})
  }

  ObtenerImagenSeleccionadoDxFileUploader(event: any) {
    if (event.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.fileDataUri = event.target.result;
      };
      this.fileName=event.value[0].name;
      reader.readAsDataURL(event.value[0]);
    }
  }

  UploadFile() {
    if (!this.ValidarInfo()) {
      return
    }
    if (this.fileDataUri.length > 0) {      
      const base64File = this.fileDataUri.split(',')[1];      
        var imagenFactura = new ImagenFactura(0, this.NombreImagen, this.fileName, "", this.SeccionSeleccionadaId,this.empresaId,this.sucursalId,base64File);        
        this.service.GuardarInformacionBaseDeDatos(imagenFactura).subscribe(res => {
          this.Limpiar();
          notify({ message: "Imagen guardada" }, "success", 3000)
          this.llenarImagenes()
        });
    }

  }
  ActualizarInformacion() {
    if (!this.ValidarInfo()) {
      return;
    }

    if (this.fileDataUri.length > 0) {

      var imagenFactura = new ImagenFactura(this.id, this.NombreImagen, "", "", this.SeccionSeleccionadaId, this.empresaId,this.sucursalId,"");
      this.service.ActualizarInformacionBaseDeDatos(imagenFactura).subscribe(res => {
        this.Limpiar();
        notify({ message: "Imagen actualizada" }, "success", 3000)
        this.llenarImagenes()
      });

    }

  }


  QuitarImagen(event) {
    this.fileDataUri = "";
  }

  Actualizar(): boolean {
    return this.id > 0;
  }

  EditarImagen(e) {
    this.NombreImagen = e.nombre;
    this.fileDataUri = e.url;
    this.SeccionSeleccionadaId = e.seccionFacturaId;
    this.id = e.id;
    this.empresaId = e.empresaId;
    this.sucursalId=e.sucursalId;
    helpers.setFocus(this._txtNombre);
  }

  Limpiar() {
    this.fileName="";
    this.NombreImagen = "";
    this.fileDataUri = "";
    this.SeccionSeleccionadaId = 0;
    this.id = 0;
    if(this.dxfileuploader!=undefined){
      this.dxfileuploader.instance.reset();
    }
    this.empresaId = 2;
    if(this.sucursales!=undefined){
      this.sucursales=new Array<Sucursal>();
    }
    this.sucursalId=0;
    this.mostrarSucursales=false;
  }
  EliminarSubGrupo(e) {
    console.log(e.id);
    this.service.EliminarImmagen(e.id,e.sucursalId).subscribe(r => {
      this.llenarImagenes();
    })
  }
  ValidarInfo(): boolean {
    let valida: boolean = false;
    if (this.NombreImagen == "") {
      notify({ message: "Debe seleccionar un nombre" }, "error", 3000);
      return valida;
    }

    if (this.SeccionSeleccionadaId == 0 || isUndefined(this.SeccionSeleccionadaId)) {
      notify({ message: "Debe seleccioar una sección" }, "error", 3000);
      return valida;
    }

    if (this.empresaId === 0) {
      notify({ message: "Debe seleccioar una empresa" }, "error", 3000);
      return valida;
    }

    if (this.fileDataUri.length == 0) {
      notify({ message: "Debe seleccionar un archivo de imagen" }, "error", 3000);
      return valida;
    }

    if (this.mostrarSucursales && this.sucursalId==0) {
      notify({ message: "Para la sección seleccionada debe de seleccionar una sucursal" }, "error", 3000);
      return valida;
    }

    valida = true;
    return valida;
  }
}
