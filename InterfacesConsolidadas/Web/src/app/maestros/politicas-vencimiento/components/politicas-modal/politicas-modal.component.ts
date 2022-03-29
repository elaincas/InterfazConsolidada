import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PoliticaVencimientoService } from '../../services/politica-vencimiento.service';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { FormGroup, FormControl } from '@angular/forms';
import { PoliticaProveedor, DistribuidorPoliticaPorProveedorDto, Distribuidores } from '../../models/politicaProveedor';
import { LoginService } from '../../../../login/services/login.service';

@Component({
  selector: 'app-politicas-modal',
  templateUrl: './politicas-modal.component.html',
  styleUrls: ['./politicas-modal.component.css']
})
export class PoliticasModalComponent implements OnInit {

  visible: boolean;
  editar: boolean;
  Politica: PoliticaProveedor;
  PoliticaForm: FormGroup
  PoliticasDto = [];
  Distibuidores = [];
  EtiquetaId: string;
  EtiquetaNombre: string;
  ProveedorId: string;
  IndicadorMeses: string;
  Data = {
    PoliticaDto: DistribuidorPoliticaPorProveedorDto,
    PoliticasDto: Array<DistribuidorPoliticaPorProveedorDto>(),
    Distribuidores: Array<Distribuidores>(),
    ProveedorId: String,
    agregarNuevo: Boolean
  };
  constructor(private politicaService: PoliticaVencimientoService, private loginService: LoginService) {
    this.PoliticaForm = new FormGroup({
      identificador: new FormControl(''),
      descripcion: new FormControl(''),
      mesesVencidos: new FormControl(''),
      distribuidorId: new FormControl('')
    });
    this.Politica = new PoliticaProveedor; 
  }

  ngOnInit() {

  }

  meses(data){
    let meses = data.value;
    if(meses < 0){
      this.IndicadorMeses = "Mes(es) antes de vencer";
    } 
    if(meses == 0){
      this.IndicadorMeses = "En el mes que vence";
    }
    if(meses > 0){
      this.IndicadorMeses = "Mes(es) despues de vencer";
    }
    
  }

  public cargarPolitica(Data) {
    this.editar = false;
    this.ProveedorId = Data.ProveedorId;
    this.EtiquetaId = "";
    this.EtiquetaNombre = "";
    if(Data.agregarNuevo === false){
        this.EtiquetaId = Data.PoliticaDto.etiquetaDistribuidor.identificador;
        this.PoliticaForm.patchValue(Data.PoliticaDto);
        this.editar = true;
        this.PoliticaForm.get('distribuidorId').setValue(Data.PoliticaDto.etiquetaDistribuidor.identificador);
      }else{
        this.PoliticaForm.reset();
      }
      
      this.visible = true;
      
      this.PoliticasDto = Data.PoliticasDto;
      this.Distibuidores = Data.Distribuidores;
  }

  public guardar() {
    this.Politica.UsuarioAgrega = this.loginService.Usuario.id;
    this.Politica.Descripcion = this.PoliticaForm.get('descripcion').value;
    this.Politica.MesesAceptaVencidos = this.PoliticaForm.get('mesesVencidos').value;
    this.Politica.Id = 0;
    this.Politica.ProveedorId = this.ProveedorId;
    this.Politica.DistribuidorId = this.EtiquetaId;
    
    if( this.Politica.Descripcion == null || this.Politica.Descripcion == ""){
      Alertas.warning("Ingrese la descripción de la política");
      return;
    }

    if( !this.Politica.MesesAceptaVencidos ){
      Alertas.warning("Ingrese los meses que acepta vencidos");
      return;
    }
    if(!this.obtenerDistribuidorSeleccionado(this.EtiquetaId)){
      return;
    }
    Alertas.load();
    this.politicaService.agregarPoliticaProveedorActivo(this.Politica).subscribe(res => {
      Alertas.close();
      this.visible = false;
      let insertarPolitica = {
        identificador: res.id,
        descripcion: this.Politica.Descripcion,
        etiquetaDistribuidor: {nombre:this.EtiquetaNombre,identificador:this.EtiquetaId},
        mesesVencidos: this.Politica.MesesAceptaVencidos,
        indicador: this.IndicadorMeses
      };
      this.PoliticasDto.push(insertarPolitica);
    });
  }
  
  obtenerDistribuidorSeleccionado(Dist_ID:string){
    let distribuidor = this.Distibuidores.find(d => d.identificador == Dist_ID);
    if(distribuidor == null || distribuidor == ""){
      this.EtiquetaNombre = "TODOS";
      this.EtiquetaId = "";
    }else{
      this.EtiquetaNombre = distribuidor.nombre;
    }
    return true;
  }

  public editarPolitica() {
   
    this.Politica.UsuarioAgrega = this.loginService.Usuario.id;
    this.Politica.Descripcion = this.PoliticaForm.get('descripcion').value;
    this.Politica.MesesAceptaVencidos = this.PoliticaForm.get('mesesVencidos').value;
    this.Politica.Id = this.PoliticaForm.get('identificador').value;
    this.Politica.ProveedorId = this.ProveedorId;
    this.Politica.DistribuidorId = this.EtiquetaId;

    if( this.Politica.Descripcion == null || this.Politica.Descripcion == ""){
      Alertas.warning("Ingrese la descripción de la política");
      return;
    }

    if( !this.Politica.MesesAceptaVencidos ){
      Alertas.warning("Ingrese los meses que acepta vencidos");
      return;
    }
    if(!this.obtenerDistribuidorSeleccionado(this.EtiquetaId)){
      return;
    }
    Alertas.load();
    this.politicaService.editarPoliticaProveedorActivo(this.Politica).subscribe(res => {
      Alertas.close();
      this.visible = false;
      const politica = this.PoliticasDto.find(x=>x.identificador == this.Politica.Id);
      politica.descripcion = this.Politica.Descripcion;
      politica.etiquetaDistribuidor= {nombre:this.EtiquetaNombre,identificador:this.EtiquetaId}
      politica.mesesVencidos= this.Politica.MesesAceptaVencidos;
      politica.indicador = this.IndicadorMeses;
    });
  }

}
