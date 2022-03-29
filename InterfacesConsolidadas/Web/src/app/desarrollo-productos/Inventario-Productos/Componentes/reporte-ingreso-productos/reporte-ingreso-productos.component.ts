import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';

@Component({
  selector: 'app-reporte-ingreso-productos',
  templateUrl: './reporte-ingreso-productos.component.html',
  styleUrls: ['./reporte-ingreso-productos.component.css']
})
export class ReporteIngresoProductosComponent implements OnInit {

  constructor( private formbuilder: FormBuilder, private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService) {
    this.createForm();
  }
  _dataSource:any
  _mostrarPopup:boolean=false;
  _urlImagen:string="";
 _formFilterGroup:FormGroup;
  // Arreglos
  _finalidades: any[];
  ngOnInit() {

    this.obtenerFinalidades()
  }
  obtenerFinalidades() {
    this.serviceInventarioProductoImpulsados.ObtenerFinalidades()
      .subscribe(r => {
        r.push({   FinalidadInventarioId:   0,
          FinalidadInventarioDescripcion:" Todas"});
            this._formFilterGroup.get("FinalidadId").setValue(0);
        this._finalidades = r;
      });
  }

MostrarPopup(url:string){

  this._urlImagen=url;
  this._mostrarPopup=true;
}
createForm():void{
  this._formFilterGroup=this.formbuilder.group({
    FinalidadId:new FormControl(0,Validators.required),
    Desde:new FormControl('',Validators.required),
    Hasta:new FormControl('',Validators.required),

  })
}
cargarReporte():void{
  this.serviceInventarioProductoImpulsados.ObtenerIngresosDeProductosReporte(this._formFilterGroup.getRawValue()).subscribe(r=>{
    this._dataSource=r;
  });

}
}
