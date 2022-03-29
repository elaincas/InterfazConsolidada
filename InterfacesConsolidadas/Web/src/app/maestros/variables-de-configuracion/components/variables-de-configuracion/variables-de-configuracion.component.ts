import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  DxDataGridComponent,
  DxRadioGroupComponent,
} from "devextreme-angular";
import { Empresa } from "../../../../shared/Models/Empresa.model";
import { MaestrosFarmaciaService } from "../../../maestros-farmacia.service";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { Ciudad } from "../../../colonias/models/ciudad.model";
import { Sucursal } from "../../../colonias/models/sucursal.model";
import { ColoniaService } from "../../../colonias/services/coloniaService.service";
import { VariableDeConfiguracion } from '../../models/VariableDeConfiguracion.model'
import { VariablesDeConfiguracionService } from './../../services/variables-de-configuracion.service'

@Component({
  selector: 'app-variables-de-configuracion',
  templateUrl: './variables-de-configuracion.component.html',
  styleUrls: ['./variables-de-configuracion.component.css']
})
export class VariablesDeConfiguracionComponent implements OnInit {

  @ViewChild("gridSucursales") private _gridSucursales: DxDataGridComponent;

  radioGroupTiposAdmin: DxRadioGroupComponent;
  formGroupVariablesDeConfiguracion: FormGroup;
  public formGroupEditVariablesDeConfiguracion: FormGroup;

  Empresas: Empresa[];
  ciudades: Ciudad[];
  sucursales: Sucursal[];
  
  tempSucursales: Sucursal[];
  tempVariablesDeconfiguracion: VariableDeConfiguracion[] = [];

  ciudadesCargadas: boolean = false;
  tiposAdmin: TipoAdminVariableConfiguracion[] = [];
  tipoAdminSeleccionado: number = 0;

  saveButtonOptions: any;
  closeEditPopupButtonOptions: any;

  variablesDeconfiguracion: VariableDeConfiguracion[];

  dataModificarVariablePor = ["Sucursal selccionada", "Multiples Sucursales"];
  mostrarEditDataGridSucursales: boolean = false;

  tipoAdmin = {
    ninguna : 0,
    empresas : 1,
    sucursales : 2,
  }
  constructor(
    private _formBuilder: FormBuilder,
    private _coloniasService: ColoniaService,
    private maestrosService: MaestrosFarmaciaService,
    private _variablesDeConfiguracionService: VariablesDeConfiguracionService
  ) {
    this.ciudades = [];
    this.Empresas = [];
    this.variablesDeconfiguracion = [];
    this.formGroupVariablesDeConfiguracion = this._formBuilder.group({
      nombre: new FormControl(),
      ciudad: new FormControl(),
      sucursal: new FormControl(),
      empresa: new FormControl(),
    });
    this.formGroupEditVariablesDeConfiguracion = this._formBuilder.group({
      txtId: new FormControl(),
      txtNombre : new FormControl(),
      txtDescripcion: new FormControl(),
      txtValor: new FormControl(),
      txtSucursal: new FormControl(),
      lookupVariable: new FormControl()
    })

    this.tiposAdmin = [
      { id: 1, tipo: "Empresa" },
      { id: 2, tipo: "Sucursal" },
    ];
    this.tipoAdminSeleccionado = this.tiposAdmin[1].id;
    this.saveButtonOptions = {
      text: "Guardar",
      onClick: () => {
        Alertas.question("iAtención!", "Se actualizará el valor de la variable para todas las sucursales de la empresa seleccionada. ¿Desea continuar?").then((resp) => {
          this.ModificarMultipleSucursal();
        });
      }
    }
    this.closeEditPopupButtonOptions ={
      text: "Cancelar",
      onClick: () => {
        this.OpenCloseEditPopup()
      }
    }
  }

  ngOnInit() {
   
    this.formGroupEditVariablesDeConfiguracion.disable
    this.ObtenerEmpresas();
    this.obtenerCiudades();
  }

  LimpiarPopupEdit() {
    this.formGroupEditVariablesDeConfiguracion.get('lookupVariable').setValue('')
    this.formGroupEditVariablesDeConfiguracion.get("txtId").setValue('')
    this.formGroupEditVariablesDeConfiguracion.get("txtNombre").setValue('')
    this.formGroupEditVariablesDeConfiguracion.get("txtDescripcion").setValue('')
    this.formGroupEditVariablesDeConfiguracion.get("txtValor").setValue('')

  }
  
    OpenCloseEditPopup(){
    this.LimpiarPopupEdit()
    this.tempSucursales = [];
    this.tempVariablesDeconfiguracion = [];
    if (!this.mostrarEditDataGridSucursales) {
      this.tempSucursales = this.sucursales.filter(x => x.id != 0);
      this.tempVariablesDeconfiguracion = this.variablesDeconfiguracion;
    } else {
      this._gridSucursales.instance.clearSelection();
    }
    this.mostrarEditDataGridSucursales = !this.mostrarEditDataGridSucursales
  }

  onValueChangedTempVariable(variableID: any){
    if (variableID.value === '' ) {
      return;
    }
    const variable = this.tempVariablesDeconfiguracion.find(x => x.id == variableID.value);
    this.formGroupEditVariablesDeConfiguracion.enable
    this.formGroupEditVariablesDeConfiguracion.get("txtId").setValue(variable.id);
    this.formGroupEditVariablesDeConfiguracion.get("txtNombre").setValue(variable.nombre);
    this.formGroupEditVariablesDeConfiguracion.get("txtDescripcion").setValue(variable.descripcion);
    this.formGroupEditVariablesDeConfiguracion.get("txtValor").enable
  }

  handleValueChangetipoAdmin(e: any) {
    this.tipoAdminSeleccionado = e.value;
    this.variablesDeconfiguracion = [];
    this.formGroupVariablesDeConfiguracion.get("empresa").setValue("-1");
    this.formGroupVariablesDeConfiguracion.get("ciudad").setValue("-1");
    this.formGroupVariablesDeConfiguracion.get("sucursal").setValue("-1");
  }

  ObtenerEmpresas() {
    this.maestrosService.ObtenerEmpresas().subscribe(
      (response) => {
        this.Empresas = response;
      },
      (error) => {
        console.info("error", error);
        Alertas.error("Error", error)
      }
    );
  }

  obtenerCiudades(): void {
    //add load alert
    this._coloniasService.ObtenerCiudades().subscribe(
      (data) => {
        this.ciudades = data;
      },
      (error) => {
        //add error alert
      }
    );
  }

  onValueChangedCiudad(e: any): void {
    //Ciudad select
    var ciudadId = this.formGroupVariablesDeConfiguracion.get("ciudad").value;
    this.ciudadesCargadas = false;
    this.ObtenerSucursales(ciudadId);
  }

  OnValueChangedSucursal(e: any): void {
    if (e.previousValue != null) {
      this.ObtenerVariables();
    }
  }

  ObtenerSucursales(ciudadId: string): void {
    
    if (this.tipoAdminSeleccionado == this.tipoAdmin.empresas) {
      var EmpresaId = this.formGroupVariablesDeConfiguracion.get("empresa").value;
      
      if (EmpresaId == null || EmpresaId == "-1") {
        return;
      }
      this._coloniasService.ObtenerSucursalesSadPorEmpresa(EmpresaId).subscribe(
        (response) => {
          this.sucursales = response;
          this.ciudadesCargadas = true;
        },
        (error) => {
          console.info("error", error);
          Alertas.error("Error", error)
        }
      );
    } else {
      if (ciudadId == null || ciudadId == "-1") {
        return;
      }
      this._coloniasService.ObtenerSucursalesSadDeCiudad(ciudadId).subscribe(
        (data) => {
          this.sucursales = data;
          this.ciudadesCargadas = true;
          const sucursal = this.sucursales.find((x) => x.id === 0);
          const index = this.sucursales.indexOf(sucursal);
          this.sucursales.splice(index, 1);
        },
        (error) => {
          //add alert error
        }
      );
    }
  }

  onVariableRowUpdated(e: any) {
    const variable = e.key as any;
      Alertas.question("Confirmación de modificación.", `¿Desea modificar el valor de la variable para la sucursal  ${variable.sucursal} ?`).then(
        (response) => {
          this.ModificarValorVariable(variable);
        }
      )
  }

  ObtenerVariables() {
    var sucursalId = this.formGroupVariablesDeConfiguracion.get("sucursal").value;
    if (sucursalId == "-1") {
      return;
    }
    if (sucursalId == null) {
      Alertas.info("", "Debe seleccionar al menos una sucursal.");
      return;
    }
    Alertas.load();
    this.variablesDeconfiguracion = [];
    if (sucursalId == 0 && this.tipoAdminSeleccionado == this.tipoAdmin.empresas) {
      this.ObtenerVariablesPorEmpresa();
    } else {
      this._variablesDeConfiguracionService
        .ObtenerVariablesDeConfiguracionPorSucursal(sucursalId)
        .subscribe((response) => {
          
          if (response.ok) {
            this.variablesDeconfiguracion = response.data;
            Alertas.close();
          } else {
            Alertas.close();
            Alertas.error("Error",response.mensaje )
          }
        },
        (error) => {
          Alertas.close();
          Alertas.error("Error", error)
          //add alert error
        }
        );
    }
  }

  ObtenerVariablesPorEmpresa() {
    var EmpresaId = this.formGroupVariablesDeConfiguracion.get("empresa").value;
    this._variablesDeConfiguracionService
      .ObtenerVariablesDeConfiguracionPorEmpresa(EmpresaId)
      .subscribe(
        (response) => {
          this.variablesDeconfiguracion = response.data;
          Alertas.close();
        },
        (error) => {
          Alertas.close()
          Alertas.error("Error", error);
          //add alert error
        }
      );
  }

  ModificarValorVariable(variable: VariableDeConfiguracion) {
    //this.GetSelectedRows()
    var sucursalId = this.formGroupVariablesDeConfiguracion.get("sucursal").value;
    Alertas.load();
    this._variablesDeConfiguracionService
      .ModificarVariableDeConfiguracion(variable, sucursalId)
      .subscribe((response) => {
        Alertas.close();
        if (response.ok) {
          Alertas.ok("", "Variable modificada corretamente.");
          this.ObtenerVariables();
        } else {
          Alertas.error("Error", response.mensaje)
        }
      },
      (error) => {
        Alertas.close()
        Alertas.error("Error", error)
        //add alert error
      });
  }

  ModificarMultipleSucursal(){
    const variableID = this.formGroupEditVariablesDeConfiguracion.get("txtId").value
    const variableName = this.formGroupEditVariablesDeConfiguracion.get("txtNombre").value
    const variableDesc = this.formGroupEditVariablesDeConfiguracion.get("txtDescripcion").value
    const variableValue = this.formGroupEditVariablesDeConfiguracion.get("txtValor").value

    if (variableID == '') {
      Alertas.warning("Advertencia", "Debe seleccionar la variable de configuración a modificar. ")
      return;
    }
    if (variableValue == '') {
      Alertas.warning("Advertencia", "Debe ingresar el nuevo valor de la variable.")
      return;
    }

    var variable = this.variablesDeconfiguracion.find(x => x.id == variableID)
    variable.valor = variableValue;

    Alertas.load()
    this._gridSucursales.instance.getSelectedRowsData()
    .then((data: Sucursal[]) => {
      if (data.length == 0 || data == null) {
        Alertas.warning("Advertencia", "Debe seleccionar al menos una sucursal.")
        return;
      }
      var sucursalesId = []

      data.forEach(sucursal => {
        sucursalesId.push(sucursal.id)
      })

      Alertas.load();
      this._variablesDeConfiguracionService
      .ModificarVariableDeConfiguracionMultipleSucursal({variable: variable, sucursales: sucursalesId, usuarioId: 0})
      .subscribe(
        (response) => {
          Alertas.close();
          if (response.ok) {
            Alertas.ok("", "Variable actualizada en las sucursales seleccionadas.")
            this.OpenCloseEditPopup();
          } else {
            Alertas.error("Error", response.mensaje)
          }
          
        },
        (error) => {
          Alertas.close()
          Alertas.error("Error", error);
          //add alert error
        }
        );
        
      })
  }

  GetSelectedRows() {
    var sucursalesId = []
    this._gridSucursales.instance.getSelectedRowsData()
    .then((data: Sucursal[]) => {
      data.forEach(sucursal => {
        sucursalesId.push(sucursal.id)
      })
    })
    return sucursalesId;
  }


  
}

export interface TipoAdminVariableConfiguracion {
  id: number;
  tipo: string;
}

// export enum tipoAdmin {
//   ninguna = 0,
//   empresas = 1,
//   sucursales = 2,
// }
